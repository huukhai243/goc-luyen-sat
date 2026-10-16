// Giả lập SePay báo tiền về, để thử luồng thanh toán trên máy mà không cần chuyển tiền thật.
// Dùng: npm run fake-pay -- SAT123456 499000
const [code, amount = "499000"] = process.argv.slice(2);
if (!code) {
  console.error("Thiếu mã đơn. Ví dụ: npm run fake-pay -- SAT123456 499000");
  process.exit(1);
}

const port = process.env.PORT || 3000;
fetch(`http://localhost:${port}/api/webhooks/sepay`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: "Apikey " + process.env.SEPAY_API_KEY },
  body: JSON.stringify({
    id: Date.now(),
    gateway: "Vietcombank",
    transferType: "in",
    transferAmount: Number(amount),
    content: `${code} chuyen tien mua khoa hoc`
  })
})
  .then(async (res) => console.log(res.status, await res.text()))
  .catch((e) => { console.error("Không gọi được server. Bạn đã chạy npm start chưa?", e.message); process.exit(1); });
