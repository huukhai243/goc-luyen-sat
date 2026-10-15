# Góc Luyện SAT

Trang web luyện thi Digital SAT với giao diện tiếng Việt. Chỉ gồm HTML, CSS và JavaScript thuần, không cần cài đặt hay build.

## Tính năng

- **Tổng quan**: điểm ước tính (thang 400–1600), tỉ lệ đúng, chuỗi ngày học, độ chính xác theo 8 mảng kiến thức.
- **Luyện tập**: lọc theo phần thi, mảng kiến thức, độ khó; có lời giải tiếng Việt sau mỗi câu.
- **Thi thử**: một module có bấm giờ như đề thật (Reading & Writing 27 câu / 32 phút, Math 22 câu / 35 phút) hoặc bản rút gọn 10 câu; có đánh dấu câu, gạch bỏ đáp án, bảng công thức.
- **Ôn câu sai** và **thẻ từ vựng** học thuật.

## Chạy thử

Mở `index.html` bằng trình duyệt. Tiến độ được lưu trong trình duyệt (localStorage).

## Cấu trúc

| File | Nội dung |
| --- | --- |
| `index.html` | Giao diện và CSS |
| `questions-rw.js` | 27 câu Reading & Writing |
| `questions-math.js` | 22 câu Math |
| `vocab.js` | 30 từ vựng |
| `app-core.js` | Lưu tiến độ, hiển thị câu hỏi, trang Tổng quan |
| `app-practice.js` | Luyện tập, Ôn câu sai |
| `app-test.js` | Thi thử, Từ vựng |

Câu hỏi được tự biên soạn theo định dạng Digital SAT, không phải đề chính thức của College Board. Điểm ước tính chỉ để tham khảo.
