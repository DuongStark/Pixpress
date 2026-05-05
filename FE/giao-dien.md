# Phần 1: Tài liệu giao diện FE

Tài liệu này mô tả trải nghiệm người dùng, màn hình, component, trạng thái UI và luồng thao tác của Pixpress theo định vị mới: **biến ảnh thô thành ảnh sẵn đăng**.

## 1. Tư duy sản phẩm

Pixpress không nên mở đầu bằng câu hỏi “bạn muốn nén bao nhiêu phần trăm?”. Người dùng phổ thông thường không biết cần quality 72 hay 85. Họ biết mình cần đăng ảnh lên Shopee, Facebook, Zalo, website hoặc gửi form.

Vì vậy FE nên ưu tiên:

- Chọn mục đích đăng trước.
- Tự điền kích thước, định dạng, nền và giới hạn dung lượng.
- Cho phép chỉnh tay khi cần.
- Báo rõ ảnh đã đạt yêu cầu hay chưa.
- Giữ flow ngắn: upload -> chọn preset -> xử lý -> tải xuống.

## 2. Người dùng chính

### Seller thương mại điện tử

Nhu cầu:

- Ảnh sản phẩm vuông.
- Nền trắng hoặc nền sạch.
- Dung lượng nhẹ để upload nhanh.
- Nhiều ảnh dùng cùng một công thức.

Điểm đau:

- Không biết kích thước chuẩn.
- Ảnh bị từ chối vì quá nặng.
- Xóa nền xong ảnh bị lệch, bị sát mép, thiếu padding.

### Content creator và marketer

Nhu cầu:

- Ảnh post social đúng tỷ lệ.
- Thumbnail nhẹ.
- WebP cho landing page hoặc blog.
- Preview nhanh trước/sau.

Điểm đau:

- Mỗi nền tảng cần tỷ lệ khác nhau.
- Công cụ nén ảnh thường không nói ảnh đã phù hợp nơi đăng chưa.

### Người làm website

Nhu cầu:

- Chuyển ảnh sang WebP/AVIF.
- Resize ảnh hero, card, thumbnail.
- Giảm dung lượng nhưng vẫn đẹp.
- So sánh kích thước file rõ ràng.

## 3. Cấu trúc điều hướng

Route đề xuất cho MVP:

```txt
/                  Trang upload
/edit/:imageId     Trang chọn mục đích và tùy chỉnh
/result/:jobId     Trang kết quả
```

Route sau MVP:

```txt
/batch             Xử lý nhiều ảnh
/history           Lịch sử xử lý
/presets           Preset cá nhân
/settings          Cấu hình tài khoản
```

Luồng chính:

```txt
Upload ảnh
-> Chọn preset
-> Chỉnh mục tiêu nếu cần
-> Xử lý
-> Xem ảnh trước/sau
-> Tải xuống
```

## 4. Màn Upload

### Mục đích

Cho người dùng đưa ảnh vào Pixpress và hiểu ngay công cụ này giúp ảnh “sẵn đăng”, không chỉ nén ảnh.

### Nội dung chính

Tiêu đề gợi ý:

```txt
Biến ảnh thô thành ảnh sẵn đăng
```

Mô tả gợi ý:

```txt
Tải ảnh lên, chọn nơi bạn muốn đăng, Pixpress sẽ tối ưu kích thước, dung lượng, định dạng và nền ảnh.
```

### Thành phần UI

- Header có logo Pixpress, luồng 3 bước và đổi ngôn ngữ.
- Dropzone kéo thả ảnh.
- Nút chọn ảnh.
- Preview ảnh đã chọn.
- Metadata ảnh: tên file, dung lượng, định dạng, kích thước.
- Badge định dạng hỗ trợ: JPG, PNG, WEBP.
- CTA: `Tiếp tục tối ưu`.

### Trạng thái

Chưa chọn file:

- Dropzone rỗng.
- CTA disabled.
- Gợi ý “Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB.”

Đang kéo file:

- Viền dropzone đổi trạng thái.
- Copy ngắn: `Thả ảnh để bắt đầu`.

Đã chọn file hợp lệ:

- Hiển thị thumbnail.
- Hiển thị metadata.
- CTA enabled.

File không hợp lệ:

- Sai định dạng.
- Quá dung lượng.
- Không đọc được metadata.

Đang upload:

- Khóa dropzone.
- Nút chuyển trạng thái loading.

## 5. Màn Edit

### Mục đích

Đây là màn quan trọng nhất. FE cần chuyển từ “bảng chỉnh thông số” sang “bảng chuẩn bị ảnh để đăng”.

### Bố cục desktop

```txt
Cột trái: Preview ảnh gốc / preview thử nếu có
Cột phải: Preset + mục tiêu + tùy chỉnh
```

### Bố cục mobile

```txt
Preview ảnh
Preset
Mục tiêu
Tùy chỉnh nâng cao
CTA xử lý
```

## 6. Preset theo nơi đăng

Preset nên là cụm UI đầu tiên trong màn Edit.

### Nhóm preset MVP

```txt
Thương mại điện tử
- Shopee ảnh sản phẩm
- Lazada ảnh sản phẩm
- TikTok Shop ảnh sản phẩm

Mạng xã hội
- Facebook post
- Instagram square
- TikTok cover

Website
- Website WebP
- Blog thumbnail
- Landing page hero

Cá nhân
- Avatar
- CV / hồ sơ
- Tự chỉnh
```

### Thông tin mỗi preset cần hiển thị

Mỗi card preset nên có:

- Tên preset.
- Tỷ lệ/kích thước đầu ra.
- Định dạng đề xuất.
- Mục tiêu dung lượng.
- Có cần nền trắng không.

Ví dụ:

```txt
Shopee ảnh sản phẩm
1:1, 1024x1024, JPG hoặc WEBP, nền trắng, dưới 500KB
```

### Hành vi khi chọn preset

Khi user chọn preset, FE tự cập nhật:

- Output format.
- Width/height.
- Keep aspect ratio.
- Max file size.
- Background mode.
- Padding.
- Remove background mặc định nếu preset cần ảnh sản phẩm sạch.

User vẫn có thể chỉnh tay sau đó.

## 7. Mục tiêu tối ưu

FE nên có một block tên `Mục tiêu`.

Các control:

- `Dung lượng tối đa`: input số + đơn vị KB/MB.
- `Ưu tiên`: segmented control.

Ưu tiên đề xuất:

```txt
Nhẹ nhất
Cân bằng
Đẹp nhất
```

Ý nghĩa:

- Nhẹ nhất: giảm quality mạnh hơn, cho phép resize nhỏ hơn nếu cần.
- Cân bằng: giữ ảnh ổn, cố đạt target.
- Đẹp nhất: không giảm quá sâu, nếu không đạt thì báo chưa đạt.

### Trạng thái mục tiêu

Trước khi xử lý:

```txt
Pixpress sẽ cố đưa ảnh xuống dưới 500KB.
```

Sau khi xử lý:

```txt
Đạt: 438KB / mục tiêu 500KB
```

Hoặc:

```txt
Chưa đạt: 612KB / mục tiêu 500KB. Hãy giảm kích thước hoặc chọn ưu tiên Nhẹ nhất.
```

## 8. Tùy chỉnh ảnh

### Định dạng đầu ra

Segmented control:

```txt
JPG
PNG
WEBP
AVIF
```

Gợi ý UX:

- WEBP nên là mặc định cho website.
- JPG phù hợp ảnh nền trắng, không cần trong suốt.
- PNG phù hợp ảnh cần trong suốt nhưng có thể nặng.
- AVIF nén tốt nhưng xử lý lâu hơn và không phải mọi nơi đều nhận.

### Resize

Control:

- Width.
- Height.
- Giữ tỷ lệ ảnh.
- Fit mode.

Fit mode nên có:

```txt
Vừa khung
Cắt đầy khung
Thêm viền/padding
```

Giải thích:

- Vừa khung: giữ toàn bộ ảnh, có thể không đủ kích thước cả hai chiều.
- Cắt đầy khung: crop để lấp đầy.
- Thêm viền/padding: phù hợp ảnh sản phẩm cần canvas vuông.

### Xóa nền và nền mới

Block nên tách thành:

- Toggle `Xóa nền`.
- `Nền sau xử lý`.

Nền sau xử lý:

```txt
Trong suốt
Trắng
Xám nhạt
Tùy chọn màu
```

Sau MVP:

```txt
Bóng nhẹ
Nền gradient nhẹ
Nền theo màu thương hiệu
```

### Căn giữa và padding

Đặc biệt cần cho ảnh sản phẩm.

Control:

- Toggle `Căn giữa sản phẩm`.
- Slider `Padding`: 0-30%.
- Toggle `Bóng nhẹ`.

## 9. Preview

Preview không nên chỉ hiển thị ảnh gốc. Cần hỗ trợ so sánh.

MVP:

- Preview ảnh gốc ở màn Edit.
- Preview ảnh kết quả ở màn Result.

Sau MVP:

- Slider trước/sau.
- Zoom.
- Checkerboard cho nền trong suốt.
- Nút đổi nền preview: trắng, đen, caro.

## 10. Màn Result

### Mục đích

Cho user biết ảnh đã sẵn đăng hay chưa, rồi tải xuống.

### Thành phần UI

- Preview kết quả.
- So sánh dung lượng trước/sau.
- So sánh kích thước trước/sau.
- Format đầu ra.
- Preset đã dùng.
- Trạng thái mục tiêu.
- CTA tải xuống.
- CTA chỉnh lại.
- CTA xử lý ảnh khác.

### Result summary nên có

```txt
Preset: Shopee ảnh sản phẩm
Trạng thái: Đạt yêu cầu
Dung lượng: 2.4MB -> 438KB
Kích thước: 3024x3024 -> 1024x1024
Định dạng: PNG -> WEBP
Nền: Trắng
```

### Trạng thái đạt/chưa đạt

Đạt:

```txt
Ảnh đã sẵn đăng
```

Chưa đạt:

```txt
Ảnh chưa đạt mục tiêu dung lượng
```

Khi chưa đạt, FE nên đưa hành động cụ thể:

- Giảm kích thước.
- Chọn ưu tiên Nhẹ nhất.
- Đổi sang WEBP hoặc AVIF.
- Tắt PNG nếu không cần trong suốt.

## 11. Batch sau MVP

Batch là tính năng nên làm sau khi single-image flow chắc.

Luồng:

```txt
Upload nhiều ảnh
-> Chọn một preset
-> Áp dụng cùng công thức
-> Xem danh sách kết quả
-> Tải từng ảnh hoặc tải ZIP
```

UI cần:

- Bảng danh sách ảnh.
- Trạng thái từng ảnh.
- Dung lượng trước/sau từng ảnh.
- Retry từng ảnh.
- Download ZIP.

## 12. Component đề xuất

```txt
src/
  components/
    AppHeader.tsx
    ImageDropzone.tsx
    ImagePreview.tsx
    PresetSelector.tsx
    OptimizationGoal.tsx
    PlatformPresetCard.tsx
    FormatSelector.tsx
    QualitySlider.tsx
    ResizeControls.tsx
    FitModeSelector.tsx
    BackgroundControls.tsx
    RemoveBackgroundToggle.tsx
    ResultSummary.tsx
    GoalStatusBadge.tsx
    BeforeAfterPreview.tsx
    LoadingButton.tsx
    ErrorAlert.tsx
```

## 13. Tiêu chí hoàn thành FE MVP

- User upload được một ảnh.
- User chọn được preset.
- Preset tự điền format, size, target dung lượng và background.
- User chỉnh được output format.
- User chỉnh được width/height.
- User bật/tắt giữ tỷ lệ.
- User nhập được target dung lượng.
- User bật/tắt xóa nền.
- User chọn được nền sau xử lý.
- User bấm xử lý và thấy trạng thái loading.
- User xem được kết quả.
- User biết kết quả đạt hay chưa đạt mục tiêu.
- User tải được ảnh.
- Lỗi hiển thị gần nơi phát sinh, không làm treo trang.
