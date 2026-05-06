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

## 14. Cập nhật MVP: FE dùng Sharp pipeline thật từ BE

FE không nên tạo kết quả giả bằng estimate khi nối với BE. Estimate chỉ dùng trước khi xử lý để user hiểu ảnh có thể về khoảng bao nhiêu KB.

Luồng tích hợp BE:

```txt
Upload ảnh
-> POST /api/images/upload
-> BE trả imageId + metadata thật
-> FE hiển thị metadata
-> User chọn preset/options
-> POST /api/images/resolve-options nếu cần preview config
-> POST /api/images/process
-> BE trả job thật + result thật + compliance
-> FE mở /result/:jobId
-> User tải file từ downloadUrl thật
```

Màn Upload cần dùng metadata từ BE:

- Tên file.
- Dung lượng file gốc.
- Width/height gốc.
- MIME/format.
- Preview URL từ BE hoặc object URL local trong lúc chờ upload.
- Lỗi upload: file quá lớn, sai định dạng, không đọc được ảnh.

Màn Edit cần gửi options rõ:

- `presetId`.
- Format.
- Quality.
- Target dung lượng.
- Resize width/height/fit.
- Background mode/color/padding.
- Remove background nếu user bật.

Màn Result chỉ hiển thị số liệu từ BE:

- Dung lượng result thật.
- Kích thước result thật.
- Format result thật.
- `goal.passed`.
- `downloadUrl`.
- `compliance`.

FE không được tự kết luận "đạt chuẩn sàn" chỉ bằng state local. Trạng thái cuối phải dựa trên response BE.

## 15. Compliance Checker UI

Compliance checker nên xuất hiện ở màn Result, và có thể preview nhanh ở Edit sau khi resolve options. UI cần phân biệt rule chắc và warning.

Nhóm check chắc:

- Kích thước.
- Tỉ lệ.
- Dung lượng.
- Format.
- Nền theo preset.
- Trạng thái mục tiêu nén.

Nhóm warning MVP:

- Text/watermark.
- Product coverage.
- Product lệch tâm.
- Nền sạch tuyệt đối.

Copy nên trung thực:

```txt
Đạt rule kỹ thuật
Cần kiểm tra thủ công
Chưa đạt
```

Không dùng copy kiểu:

```txt
Chắc chắn được Shopee duyệt
Chắc chắn được TikTok duyệt
```

UI đề xuất:

```txt
Compliance panel
- Status badge: Đạt / Cần kiểm tra / Chưa đạt
- Checklist rule chắc
- Warning chưa xác minh
- CTA chỉnh lại nếu failed
```

Ví dụ:

```txt
Đạt rule kỹ thuật
✓ Kích thước: 1024x1024
✓ Tỉ lệ: 1:1
✓ Dung lượng: 438KB / 500KB
✓ Format: WEBP
✓ Nền: trắng
! Text/watermark: Pixpress chưa kiểm tra chắc ở MVP
! Product coverage: cần kiểm tra thủ công
```

## 16. Multi-Platform Export

Multi-platform export cho phép user upload một ảnh và chọn nhiều nền tảng để Pixpress xuất nhiều file đúng preset từng nền tảng.

Vị trí trong product:

- Sau single-image pipeline thật.
- Sau compliance checker.
- Trước batch, vì flow vẫn chỉ có một ảnh gốc.

Luồng:

```txt
Upload 1 ảnh
-> Chọn chế độ "Xuất cho nhiều nền tảng"
-> Tick Shopee, Lazada, TikTok Shop
-> Pixpress xử lý từng preset
-> Hiển thị kết quả từng nền tảng
-> Tải ZIP hoặc tải từng ảnh
```

UI trong màn Edit:

- Thêm toggle/chế độ: `Một nền tảng` / `Nhiều nền tảng`.
- Khi chọn `Một nền tảng`: dùng PresetSelector hiện tại.
- Khi chọn `Nhiều nền tảng`: hiển thị checkbox card cho Shopee, Lazada, TikTok Shop.
- Ít nhất một nền tảng phải được chọn.
- Shared settings áp dụng cho tất cả: remove background, nền trắng, padding nếu phù hợp.
- Setting riêng theo nền tảng do BE preset quyết định: size, format, target dung lượng.

Copy đề xuất:

```txt
Xuất một ảnh cho nhiều sàn
Chọn các nền tảng bạn muốn đăng. Pixpress sẽ tạo file riêng theo preset từng nền tảng.
```

Màn Result multi-platform:

- Hiển thị bảng/card theo nền tảng.
- Mỗi nền tảng có thumbnail, format, kích thước, dung lượng, compliance status.
- Nền tảng fail không làm mất kết quả nền tảng pass.
- CTA chính: `Tải ZIP`.
- CTA phụ: tải từng ảnh.

Ví dụ:

```txt
Shopee       1024x1024  WEBP  438KB  Cần kiểm tra thủ công
Lazada       1200x1200  JPG   612KB  Đạt rule kỹ thuật
TikTok Shop  1080x1080  WEBP  501KB  Đạt rule kỹ thuật
```

Route có thể dùng:

```txt
/export/:exportId
```

Hoặc dùng `/result/:jobId` cho single-image và `/export/:exportId` cho multi-platform để tránh result model bị phình.

Component đề xuất thêm:

```txt
MultiPlatformSelector.tsx
ExportVariantCard.tsx
ExportSummary.tsx
ZipDownloadButton.tsx
```

## 17. Batch + Template sau single-image ổn định

Batch là luồng sau MVP, không chen vào single-image flow khi pipeline thật chưa ổn. Mục tiêu batch đầu tiên là xử lý 20-50 ảnh bằng cùng công thức và tải ZIP.

Route sau MVP:

```txt
/batch              Upload nhiều ảnh
/batch/:batchId     Theo dõi batch
/templates          Quản lý công thức đã lưu
```

Luồng batch:

```txt
Upload 20-50 ảnh
-> Chọn preset hoặc template đã lưu
-> Xem bảng ảnh + metadata
-> Bấm xử lý batch
-> Theo dõi progress từng ảnh
-> Retry ảnh lỗi nếu cần
-> Tải từng file hoặc download ZIP
```

Template nên lưu từ single-image options:

- Tên template.
- Preset.
- Format.
- Target dung lượng.
- Resize/fit.
- Background.
- Padding.
- Remove background.

UI batch cần:

- Bảng danh sách ảnh.
- Trạng thái từng ảnh: pending, processing, completed, failed.
- Dung lượng trước/sau.
- Compliance status từng ảnh.
- Retry từng ảnh.
- Download ZIP.

Giới hạn hiển thị rõ:

```txt
Tối đa 50 ảnh/lần. Mỗi ảnh tối đa 10MB.
```
