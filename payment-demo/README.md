# Demo thanh toán khóa học bằng mã QR

Học viên quét mã VietQR bằng app ngân hàng. [SePay](https://sepay.vn) theo dõi tài khoản và gọi webhook về server khi tiền về. Server so mã đơn và số tiền rồi tự mở khóa học.

```
Bấm "Mua"  →  server tạo đơn SAT123456 + mã QR (có sẵn số tiền, nội dung)
Quét mã, chuyển tiền  →  SePay gọi POST /api/webhooks/sepay
Server kiểm tra API key, mã đơn, số tiền  →  đơn "paid", mở khóa học
Trang thanh toán hỏi trạng thái mỗi 3 giây  →  báo thành công
```

## Chạy trên máy

Cần Node.js 22.13 trở lên (dùng SQLite có sẵn trong Node, không phải cài thêm cơ sở dữ liệu).

```bash
cd payment-demo
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm start
```

Mở http://localhost:3000/buy.html và bấm **Thanh toán bằng mã QR**. Ghi lại mã đơn, ví dụ `SAT123456`.

Giả lập tiền về mà không cần chuyển khoản thật (mở một cửa sổ terminal khác):

```bash
npm run fake-pay -- SAT123456 499000
```

Trong vòng 3 giây, trang sẽ báo thanh toán thành công và chuyển sang trang khóa học.

## Chạy thật

1. Đăng ký SePay và liên kết tài khoản ngân hàng nhận tiền.
2. Điền số tài khoản thật vào `.env`. Đặt `SEPAY_API_KEY` là một chuỗi bí mật dài.
3. Đưa server lên nơi có địa chỉ công khai (Render, Railway, VPS...). Khi thử trên máy thì dùng `ngrok http 3000` hoặc `cloudflared`.
4. Trong trang quản lý SePay, tạo webhook trỏ tới `https://<domain>/api/webhooks/sepay`, chọn xác thực **API Key** và dán đúng chuỗi trong `SEPAY_API_KEY`.

Tên các trường trong webhook (`id`, `transferType`, `transferAmount`, `content`) theo tài liệu SePay. Hãy đối chiếu lại với tài liệu mới nhất của họ trước khi chạy thật.

## Các API

| Phương thức | Đường dẫn | Việc làm |
| --- | --- | --- |
| `POST` | `/api/orders` | Tạo đơn, trả về mã đơn và link ảnh QR |
| `GET` | `/api/orders/:code` | Trạng thái đơn: `pending`, `paid`, `expired` |
| `POST` | `/api/webhooks/sepay` | SePay báo có giao dịch |
| `GET` | `/api/courses/:id/lessons` | Bài học, chỉ trả cho người đã mua |

## Cần làm thêm trước khi bán thật

- **Đăng nhập.** Bản demo cho trình duyệt tự gửi `userId` lên. Thực tế phải lấy người dùng từ phiên đăng nhập trên server.
- **Đối soát.** Giao dịch không khớp đơn (quên ghi nội dung, chuyển thiếu) được lưu trong bảng `transactions`. Cần thêm trang quản trị để xem và kích hoạt bằng tay.
- **Bảo vệ nội dung.** Video và tài liệu chỉ được trả qua API có kiểm tra quyền, không để công khai trong thư mục `public/`.
- **HTTPS** cho toàn bộ trang, cùng điều khoản sử dụng và chính sách hoàn tiền.
