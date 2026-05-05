# Pixpress - Tài liệu tổng quan

Pixpress được định vị là công cụ biến ảnh thô thành **ảnh sẵn đăng** cho seller, marketer, creator và người làm website tại Việt Nam.

Thay vì chỉ là web nén ảnh, Pixpress tập trung vào câu hỏi thực tế hơn:

> Ảnh này đã đúng kích thước, đúng dung lượng, đúng nền và sẵn để đăng lên nền tảng mình cần chưa?

## Tài liệu chính

1. [Tài liệu giao diện FE](./FE/giao-dien.md)
2. [Tài liệu thiết kế FE](./FE/design.md)
3. [Tài liệu xử lý logic và API BE](./BE/xu-ly-logic-api.md)

## Định vị sản phẩm

Pixpress không nên cạnh tranh trực diện với các công cụ nén ảnh chung chung. Điểm khác biệt nên là:

- Preset theo nơi đăng: Shopee, Lazada, TikTok Shop, Facebook, Zalo, website, avatar, CV.
- Tối ưu theo mục tiêu: dưới 500KB, ảnh vuông 1:1, nền trắng, WebP nhẹ, không vỡ chữ.
- Xử lý ảnh sản phẩm 1-click: xóa nền, thêm nền trắng, căn giữa, thêm padding, tạo bóng nhẹ.
- So sánh trước/sau rõ ràng: dung lượng, kích thước, định dạng, mức giảm, trạng thái đạt yêu cầu.
- Batch theo công thức: dùng cùng một preset cho nhiều ảnh.

## Mục tiêu MVP mới

MVP nên chứng minh được giá trị “ảnh sẵn đăng”, không chỉ chứng minh được nén ảnh.

Phạm vi nên làm trước:

- Upload một ảnh.
- Chọn preset nền tảng hoặc chỉnh tay.
- Chọn mục tiêu dung lượng tối đa.
- Resize theo preset hoặc kích thước tự nhập.
- Đổi định dạng JPG, PNG, WEBP, AVIF.
- Nén ảnh theo chất lượng hoặc tự tối ưu để đạt mục tiêu dung lượng.
- Xóa nền nếu có cấu hình API ngoài.
- Thêm nền trắng hoặc giữ nền trong suốt.
- Preview trước/sau.
- Báo ảnh đã đạt hay chưa đạt yêu cầu.
- Download ảnh kết quả.

Tính năng làm sau MVP:

- Xử lý nhiều ảnh cùng lúc.
- Lưu preset cá nhân.
- Lịch sử xử lý.
- Tài khoản người dùng.
- Gói trả phí cho batch lớn, lưu cloud, API riêng.
- Model xóa nền tự host.

## Luồng sản phẩm đề xuất

```txt
Upload ảnh
-> Chọn mục đích đăng
-> Pixpress tự điền preset
-> User chỉnh thêm nếu cần
-> Xử lý ảnh
-> So sánh kết quả và trạng thái đạt yêu cầu
-> Tải ảnh sẵn đăng
```

## Thứ tự làm đề xuất

1. Cập nhật FE để có preset theo nền tảng.
2. Cập nhật FE để có mục tiêu dung lượng tối đa.
3. Code BE upload và đọc metadata ảnh.
4. Code BE xử lý ảnh bằng Sharp.
5. Code thuật toán nén tự động để đạt mục tiêu dung lượng.
6. Code preset resolver ở BE để tránh FE tự quyết toàn bộ.
7. Tích hợp xóa nền qua API ngoài.
8. Thêm background composer: nền trắng, nền trong suốt, bóng nhẹ, padding.
9. Thêm batch sau khi single-image flow ổn định.
