// Demo bán khóa học: tạo đơn kèm mã VietQR, nhận webhook SePay khi tiền về, mở khóa học.
// Chạy: npm install → sao chép .env.example thành .env và điền thông tin → npm start
const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const crypto = require("node:crypto");
const path = require("node:path");

const { SEPAY_API_KEY, BANK_ID = "VCB", ACCOUNT_NO, ACCOUNT_NAME, PORT = 3000 } = process.env;
if (!SEPAY_API_KEY || !ACCOUNT_NO || !ACCOUNT_NAME) {
  console.error("Thiếu biến môi trường. Sao chép .env.example thành .env và điền đủ thông tin.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Cơ sở dữ liệu ----------
const db = new DatabaseSync(path.join(__dirname, "shop.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    code TEXT PRIMARY KEY, user_id TEXT NOT NULL, course_id TEXT NOT NULL, amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL, paid_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS enrollments (
    user_id TEXT NOT NULL, course_id TEXT NOT NULL, PRIMARY KEY (user_id, course_id)
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY, order_code TEXT, amount INTEGER, raw TEXT, received_at INTEGER
  );
`);

const COURSES = {
  "sat-1600": {
    name: "Khóa SAT 1600",
    price: 499000,
    lessons: [
      { title: "Bài 1: Words in Context", minutes: 18 },
      { title: "Bài 2: Command of Evidence", minutes: 24 },
      { title: "Bài 3: Hệ phương trình tuyến tính", minutes: 21 }
    ]
  }
};
const ORDER_TTL = 15 * 60 * 1000; // mã QR hiển thị trong 15 phút

function sameSecret(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function newOrderCode() {
  const exists = db.prepare("SELECT 1 FROM orders WHERE code = ?");
  let code;
  do code = "SAT" + crypto.randomInt(100000, 1000000); while (exists.get(code));
  return code;
}

// ---------- 1) Tạo đơn hàng + mã QR ----------
app.post("/api/orders", (req, res) => {
  const userId = req.body?.userId; // DEMO. Thực tế lấy từ phiên đăng nhập, không tin client gửi lên
  const courseId = req.body?.courseId;
  const course = COURSES[courseId];
  if (!userId || !course) return res.status(400).json({ error: "Thiếu người mua hoặc khóa học" });

  const code = newOrderCode();
  const createdAt = Date.now();
  db.prepare("INSERT INTO orders (code, user_id, course_id, amount, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(code, userId, courseId, course.price, createdAt);

  // Ảnh QR chuẩn VietQR, đã gắn sẵn số tiền và nội dung chuyển khoản
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png`
    + `?amount=${course.price}&addInfo=${code}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  res.json({ code, amount: course.price, course: course.name, qrUrl, expiresAt: createdAt + ORDER_TTL });
});

// ---------- 2) Trình duyệt hỏi xem đơn đã thanh toán chưa ----------
app.get("/api/orders/:code", (req, res) => {
  const o = db.prepare("SELECT status, created_at FROM orders WHERE code = ?").get(req.params.code);
  if (!o) return res.status(404).json({ error: "Không tìm thấy đơn" });
  const expired = o.status === "pending" && Date.now() - o.created_at > ORDER_TTL;
  res.json({ status: expired ? "expired" : o.status });
});

// ---------- 3) SePay gọi vào đây mỗi khi tài khoản có biến động ----------
app.post("/api/webhooks/sepay", (req, res) => {
  // Xác thực: chỉ SePay biết API key này
  if (!sameSecret(req.get("Authorization") || "", "Apikey " + SEPAY_API_KEY)) {
    return res.status(401).json({ success: false });
  }

  const t = req.body || {}; // { id, transferType, transferAmount, content, ... }
  if (t.id == null) return res.status(400).json({ success: false });
  if (t.transferType !== "in") return res.json({ success: true }); // bỏ qua tiền ra

  const code = String(t.content || "").toUpperCase().match(/SAT\d{6}/)?.[0] ?? null;
  const amount = Number(t.transferAmount) || 0;

  db.exec("BEGIN");
  try {
    // Chống xử lý trùng: SePay có thể gửi lại cùng một giao dịch.
    // Giao dịch không khớp đơn nào vẫn được lưu ở đây để đối soát bằng tay.
    const saved = db.prepare("INSERT OR IGNORE INTO transactions (id, order_code, amount, raw, received_at) VALUES (?, ?, ?, ?, ?)")
      .run(String(t.id), code, amount, JSON.stringify(t), Date.now());

    if (saved.changes > 0 && code) {
      const o = db.prepare("SELECT * FROM orders WHERE code = ?").get(code);
      // Đơn hết hạn trên giao diện vẫn là 'pending', nên học viên chuyển muộn vẫn được mở khóa học.
      // Chuyển thiếu thì giữ nguyên để xử lý tay.
      if (o && o.status === "pending" && amount >= o.amount) {
        db.prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE code = ?").run(Date.now(), code);
        db.prepare("INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)").run(o.user_id, o.course_id);
        console.log(`Đơn ${code} đã thanh toán ${amount}đ`);
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e; // trả 500 để SePay gửi lại
  }
  res.json({ success: true });
});

// ---------- 4) Nội dung khóa học: chỉ trả cho người đã mua ----------
app.get("/api/courses/:id/lessons", (req, res) => {
  const userId = req.query.userId; // DEMO, thực tế lấy từ phiên đăng nhập
  const course = COURSES[req.params.id];
  if (!course) return res.status(404).json({ error: "Không có khóa học này" });
  const ok = db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?").get(userId, req.params.id);
  if (!ok) return res.status(403).json({ error: "Bạn chưa mua khóa học này" });
  res.json({ course: course.name, lessons: course.lessons });
});

app.listen(PORT, () => console.log(`Mở http://localhost:${PORT}/buy.html`));
