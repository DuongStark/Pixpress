---
version: beta
name: Pixpress Seller Utility
description: Giao diện công cụ ảnh sẵn đăng cho seller và creator Việt Nam.
colors:
  ink: "#171717"
  muted: "#666666"
  line: "#D8D8D8"
  canvas: "#F7F6F2"
  panel: "#FFFFFF"
  action: "#1769AA"
  success: "#168A4A"
  warning: "#B86B00"
  danger: "#B42318"
typography:
  display:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 2.5rem
    fontWeight: 700
  h1:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1.75rem
    fontWeight: 700
  body:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.95rem
    lineHeight: 1.5
  label:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.78rem
    letterSpacing: "0"
rounded:
  sm: 4px
  md: 6px
  lg: 8px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px 18px
  panel:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.line}"
    rounded: "{rounded.lg}"
    padding: 20px
---

# Tài liệu thiết kế FE

## 1. Hướng thiết kế

Pixpress nên nhìn như một công cụ làm việc nhanh, đáng tin và thực dụng. Tránh cảm giác landing page trang trí. Người dùng vào để xử lý ảnh và rời đi với file dùng được.

Tính cách giao diện:

- Gọn.
- Rõ trạng thái.
- Ưu tiên tác vụ.
- Dễ quét thông tin.
- Có cảm giác chuyên nghiệp cho seller.

## 2. Nguyên tắc

- Màn hình đầu tiên phải là công cụ upload, không phải hero marketing dài.
- Preset phải nổi bật hơn các thông số kỹ thuật.
- Mỗi màn chỉ có một CTA chính.
- Kết quả phải nói rõ “đạt” hoặc “chưa đạt”.
- Thông số kỹ thuật phải có ích cho quyết định của user, không chỉ để trưng.

## 3. Màu sắc

- Ink `#171717`: chữ chính.
- Muted `#666666`: mô tả, metadata.
- Canvas `#F7F6F2`: nền trang ấm nhẹ, không quá trắng.
- Panel `#FFFFFF`: vùng thao tác.
- Action `#1769AA`: CTA chính, link quan trọng.
- Success `#168A4A`: trạng thái đạt yêu cầu.
- Warning `#B86B00`: chưa đạt target, cần chỉnh.
- Danger `#B42318`: lỗi.

Không dùng palette một màu. Không dùng gradient làm nền chính. Không dùng card lồng card.

## 4. Typography

Nên dùng Inter hoặc system font. Pixpress là tool, không cần kiểu chữ quá cá tính.

Kích thước:

- H1: 28px desktop, 24px mobile.
- H2 trong panel: 18-20px.
- Body: 15-16px.
- Label: 12-13px.
- Metadata: 13-14px.

Không scale font theo viewport width. Letter spacing để `0` trừ label rất nhỏ nếu cần.

## 5. Layout

Desktop:

```txt
Header
Main content 2 cột
- Cột trái rộng: preview
- Cột phải cố định: preset và control
```

Mobile:

```txt
Header compact
Preview
Preset
Mục tiêu
Tùy chỉnh
CTA sticky dưới cùng nếu cần
```

Panel dùng border rõ, radius tối đa 8px. Tránh bóng đổ mạnh.

## 6. Component quan trọng

### Preset card

Mục đích: giúp user chọn nhanh theo nơi đăng.

Nội dung:

- Tên preset.
- Nơi dùng.
- Kích thước.
- Target dung lượng.
- Badge nền: trắng / trong suốt / giữ nguyên.

Trạng thái:

- Default.
- Hover.
- Selected.
- Disabled nếu preset yêu cầu tính năng chưa bật.

### Goal status badge

Trạng thái:

- `Đạt yêu cầu`.
- `Chưa đạt`.
- `Chưa xử lý`.
- `Cần chỉnh`.

Màu:

- Đạt: xanh.
- Chưa đạt: cam.
- Lỗi: đỏ.

### Before/after block

MVP có thể là hai preview cạnh nhau hoặc preview kết quả + metadata. Sau MVP nên có slider trước/sau.

Metadata nên đặt sát preview:

```txt
2.4MB -> 438KB
3024x3024 -> 1024x1024
PNG -> WEBP
```

## 7. Copywriting

Nên dùng ngôn ngữ hành động:

- `Chọn nơi đăng`
- `Tối ưu ảnh`
- `Ảnh đã sẵn đăng`
- `Giảm kích thước`
- `Đổi sang WebP`

Tránh:

- Thuật ngữ quá sâu như chroma subsampling, effort, lossless nếu chưa cần.
- Đoạn giải thích dài trong UI.

## 8. Accessibility

- Tất cả button icon cần `aria-label`.
- Control preset phải dùng button/radio semantic.
- Slider quality cần label và value rõ.
- Error cần liên kết với input nếu lỗi input.
- Badge màu phải có text, không chỉ dựa vào màu.

## 9. Tiêu chí thiết kế đạt

- User nhìn 5 giây hiểu Pixpress dùng để làm ảnh sẵn đăng.
- User không cần biết kỹ thuật vẫn chọn được preset.
- User biết vì sao ảnh chưa đạt.
- User có bước tiếp theo rõ khi ảnh chưa đạt.
- UI dùng tốt trên mobile.

## 10. Compliance Checker Design

Compliance checker là công cụ ra quyết định, không phải badge trang trí. Thiết kế cần làm user thấy rule nào chắc, rule nào chỉ là cảnh báo.

Trạng thái:

- `Đạt rule kỹ thuật`: dùng success.
- `Cần kiểm tra thủ công`: dùng warning.
- `Chưa đạt`: dùng danger.

Checklist:

- Mỗi dòng có icon trạng thái, tên rule, giá trị thực tế.
- Rule fail cần có hành động gần đó: chỉnh kích thước, đổi format, giảm target, xử lý lại.
- Warning text/watermark/product coverage phải dùng ngôn ngữ "chưa kiểm tra chắc", không nói như lỗi chắc chắn.

Không nên:

- Gộp mọi warning thành lỗi đỏ.
- Hứa "chắc chắn được sàn duyệt".
- Dùng đoạn giải thích dài trong panel.

## 11. Multi-Platform Export Design

Multi-platform export cần rõ là một ảnh gốc tạo nhiều file đầu ra. UI không nên làm user tưởng ba nền tảng dùng cùng một file.

Selector:

- Dùng segmented control: `Một nền tảng` / `Nhiều nền tảng`.
- Khi nhiều nền tảng, dùng checkbox card nhỏ cho Shopee, Lazada, TikTok Shop.
- Card selected cần hiển thị kích thước/format/target chính.
- Không dùng dropdown multi-select vì khó quét trên mobile.

Result:

- Dùng danh sách variant theo nền tảng.
- Mỗi variant có thumbnail nhỏ, nền tảng, kích thước, format, dung lượng, compliance badge.
- CTA chính `Tải ZIP` đặt trên cùng hoặc cuối panel, disabled khi chưa có variant completed.
- CTA tải từng ảnh đặt trong từng variant, nhỏ hơn CTA ZIP.

Copy:

- `Xuất cho nhiều sàn`.
- `Tải ZIP`.
- `Tải ảnh Shopee`.
- `Lazada chưa đạt dung lượng mục tiêu`.

## 12. Batch Design Sau MVP

Batch dùng cho seller xử lý nhiều ảnh, nên layout cần dày thông tin hơn màn single-image.

Màn batch nên giống bảng công việc:

- Cột file/thumbnail.
- Cột metadata gốc.
- Cột preset/template.
- Cột trạng thái.
- Cột dung lượng trước/sau.
- Cột compliance.
- Hành động retry/download.

Progress cần rõ từng ảnh và toàn batch. Download ZIP chỉ enabled khi có ít nhất một ảnh completed.
