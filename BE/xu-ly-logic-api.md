# Phần 2: Tài liệu xử lý logic và API BE

Tài liệu này mô tả backend cho Pixpress theo hướng **ảnh sẵn đăng**. BE không chỉ nhận ảnh rồi nén. BE phải biết preset, mục tiêu dung lượng, resize, format, nền, xóa nền, kiểm tra kết quả đạt yêu cầu và trả về lý do nếu chưa đạt.

## 1. Vai trò của backend

Backend cần đảm nhiệm các việc sau:

- Nhận upload ảnh.
- Validate file thật sự là ảnh đọc được.
- Đọc metadata ảnh gốc.
- Lưu file gốc tạm thời.
- Quản lý preset chuẩn ở server.
- Nhận yêu cầu xử lý theo preset hoặc tùy chỉnh.
- Resolve preset thành options cụ thể.
- Resize, crop, pad, convert format, nén ảnh bằng Sharp.
- Tối ưu lặp để cố đạt `targetMaxBytes`.
- Gọi dịch vụ xóa nền nếu cần.
- Ghép nền mới: trong suốt, trắng, màu tùy chọn, bóng nhẹ sau MVP.
- Đánh giá kết quả có đạt mục tiêu hay không.
- Trả preview và download.
- Xóa file hết hạn.

BE nên là nơi giữ logic chuẩn để tránh FE tự hard-code luật xử lý ảnh. FE có thể hiển thị preset, nhưng BE phải validate và resolve lại.

## 2. Công nghệ đề xuất

- Node.js + Express.
- Multer để nhận multipart upload.
- Sharp để xử lý ảnh.
- Zod hoặc Joi để validate request body.
- nanoid hoặc uuid để tạo id.
- remove.bg API cho xóa nền MVP.
- Local filesystem cho MVP.
- S3/R2 sau khi cần scale.
- BullMQ/Redis sau MVP nếu xử lý batch hoặc job async dài.

## 3. Cấu trúc thư mục đề xuất

```txt
src/
  app.js
  server.js
  config/
    env.js
    presets.js
  routes/
    health.routes.js
    image.routes.js
    preset.routes.js
  controllers/
    image.controller.js
    preset.controller.js
  services/
    upload.service.js
    image.service.js
    processing.service.js
    preset.service.js
    compression.service.js
    background.service.js
    storage.service.js
    job.service.js
  validators/
    upload.validator.js
    process.validator.js
    preset.validator.js
  middlewares/
    upload.middleware.js
    error.middleware.js
    rate-limit.middleware.js
  utils/
    file.util.js
    image.util.js
    mime.util.js
```

Thư mục lưu file MVP:

```txt
storage/
  uploads/
  results/
  temp/
```

## 4. Khái niệm chính

### 4.1 Image

Đại diện ảnh gốc user upload.

```json
{
  "imageId": "img_123",
  "originalName": "product.png",
  "mimeType": "image/png",
  "format": "png",
  "size": 2489000,
  "width": 3024,
  "height": 3024,
  "path": "storage/uploads/img_123/original.png",
  "createdAt": "2026-05-06T10:00:00.000Z",
  "expiresAt": "2026-05-06T11:00:00.000Z"
}
```

### 4.2 Preset

Preset mô tả nơi đăng và rule xử lý mặc định.

```json
{
  "presetId": "shopee-product-square",
  "name": "Shopee ảnh sản phẩm",
  "group": "ecommerce",
  "description": "Ảnh sản phẩm vuông, nền trắng, nhẹ dung lượng.",
  "output": {
    "format": "jpg",
    "width": 1024,
    "height": 1024,
    "fit": "contain",
    "background": {
      "mode": "solid",
      "color": "#FFFFFF"
    },
    "paddingPercent": 8,
    "quality": 82,
    "targetMaxBytes": 512000
  },
  "removeBackgroundDefault": false,
  "priority": "balanced"
}
```

### 4.3 ProcessOptions

Options cuối cùng sau khi resolve preset và override từ user.

```json
{
  "presetId": "shopee-product-square",
  "format": "webp",
  "quality": 80,
  "targetMaxBytes": 512000,
  "priority": "balanced",
  "resize": {
    "width": 1024,
    "height": 1024,
    "fit": "contain",
    "keepAspectRatio": true,
    "withoutEnlargement": true,
    "paddingPercent": 8
  },
  "background": {
    "remove": true,
    "mode": "solid",
    "color": "#FFFFFF",
    "shadow": false
  }
}
```

### 4.4 Job

Đại diện một lần xử lý ảnh.

```json
{
  "jobId": "job_456",
  "imageId": "img_123",
  "status": "completed",
  "presetId": "shopee-product-square",
  "options": {},
  "goal": {
    "targetMaxBytes": 512000,
    "passed": true,
    "reason": null
  },
  "original": {
    "fileName": "product.png",
    "size": 2489000,
    "width": 3024,
    "height": 3024,
    "format": "png"
  },
  "result": {
    "fileName": "product-pixpress.webp",
    "mimeType": "image/webp",
    "format": "webp",
    "size": 438000,
    "width": 1024,
    "height": 1024,
    "path": "storage/results/job_456/product-pixpress.webp",
    "previewUrl": "/api/images/jobs/job_456/preview",
    "downloadUrl": "/api/images/jobs/job_456/download"
  },
  "createdAt": "2026-05-06T10:01:00.000Z",
  "expiresAt": "2026-05-06T11:01:00.000Z"
}
```

## 5. Preset MVP đề xuất

BE nên có preset hard-code trong `config/presets.js` ở MVP. Sau này chuyển DB.

### 5.1 Shopee ảnh sản phẩm

- `presetId`: `shopee-product-square`
- Size: 1024x1024.
- Fit: `contain`.
- Padding: 8%.
- Background: trắng.
- Format: JPG hoặc WEBP.
- Target: 500KB.
- Priority: balanced.

### 5.2 Website WebP

- `presetId`: `website-webp`
- Width tối đa: 1600.
- Height tự theo tỷ lệ.
- Format: WEBP.
- Target: 300KB-800KB tùy ảnh.
- Không đổi nền mặc định.

### 5.3 Blog thumbnail

- `presetId`: `blog-thumbnail`
- Size: 1200x630.
- Fit: `cover`.
- Format: WEBP.
- Target: 350KB.

### 5.4 Avatar

- `presetId`: `avatar-square`
- Size: 512x512.
- Fit: `cover`.
- Format: JPG hoặc WEBP.
- Target: 200KB.

### 5.5 Tự chỉnh

- `presetId`: `custom`
- Không ép size.
- User tự chọn format, quality, target.

## 6. API cần code

Base path đề xuất:

```txt
/api
```

### 6.1 Health check

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "status": "ok"
}
```

### 6.2 Lấy danh sách preset

FE cần API này để hiển thị preset và không hard-code quá nhiều.

```http
GET /api/presets
```

Query optional:

```txt
group=ecommerce|social|website|personal
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "presetId": "shopee-product-square",
      "name": "Shopee ảnh sản phẩm",
      "group": "ecommerce",
      "description": "Ảnh sản phẩm vuông, nền trắng, nhẹ dung lượng.",
      "defaults": {
        "format": "jpg",
        "width": 1024,
        "height": 1024,
        "fit": "contain",
        "targetMaxBytes": 512000,
        "backgroundMode": "solid",
        "backgroundColor": "#FFFFFF",
        "paddingPercent": 8
      }
    }
  ]
}
```

### 6.3 Lấy chi tiết preset

```http
GET /api/presets/:presetId
```

Response:

```json
{
  "success": true,
  "data": {
    "presetId": "website-webp",
    "name": "Website WebP",
    "group": "website",
    "defaults": {},
    "constraints": {
      "allowedFormats": ["webp", "avif", "jpg"],
      "maxWidth": 2400,
      "maxHeight": 2400,
      "maxTargetBytes": 5242880
    }
  }
}
```

### 6.4 Upload ảnh

```http
POST /api/images/upload
```

Request:

```txt
Content-Type: multipart/form-data
file: image
```

Validation:

- Bắt buộc có file.
- Chỉ nhận `image/jpeg`, `image/png`, `image/webp`.
- Dung lượng tối đa 10MB cho MVP.
- File phải đọc được bằng Sharp.
- Không dùng `originalName` để tạo path thật.

Response thành công:

```json
{
  "success": true,
  "data": {
    "imageId": "img_123",
    "originalName": "product.png",
    "mimeType": "image/png",
    "format": "png",
    "size": 2489000,
    "width": 3024,
    "height": 3024,
    "previewUrl": "/api/images/img_123/preview",
    "expiresAt": "2026-05-06T11:00:00.000Z"
  }
}
```

### 6.5 Preview ảnh gốc

```http
GET /api/images/:imageId/preview
```

Response:

- Trả file ảnh gốc hoặc preview đã giới hạn kích thước.
- Header `Content-Type` đúng theo ảnh.
- Có cache ngắn nếu cần.

### 6.6 Resolve preset trước khi xử lý

API này giúp FE preview options cuối cùng khi user chọn preset + override.

```http
POST /api/images/resolve-options
```

Request:

```json
{
  "imageId": "img_123",
  "presetId": "shopee-product-square",
  "overrides": {
    "format": "webp",
    "targetMaxBytes": 512000,
    "background": {
      "remove": true,
      "mode": "solid",
      "color": "#FFFFFF"
    }
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "options": {
      "presetId": "shopee-product-square",
      "format": "webp",
      "quality": 80,
      "targetMaxBytes": 512000,
      "priority": "balanced",
      "resize": {
        "width": 1024,
        "height": 1024,
        "fit": "contain",
        "keepAspectRatio": true,
        "withoutEnlargement": true,
        "paddingPercent": 8
      },
      "background": {
        "remove": true,
        "mode": "solid",
        "color": "#FFFFFF",
        "shadow": false
      }
    },
    "warnings": []
  }
}
```

Warnings ví dụ:

```json
[
  {
    "code": "JPG_NO_TRANSPARENCY",
    "message": "JPG không hỗ trợ nền trong suốt. Hãy dùng PNG hoặc WEBP."
  }
]
```

### 6.7 Xử lý ảnh

```http
POST /api/images/process
```

Request:

```json
{
  "imageId": "img_123",
  "presetId": "shopee-product-square",
  "overrides": {
    "format": "webp",
    "quality": 80,
    "targetMaxBytes": 512000,
    "priority": "balanced",
    "resize": {
      "width": 1024,
      "height": 1024,
      "fit": "contain",
      "paddingPercent": 8
    },
    "background": {
      "remove": true,
      "mode": "solid",
      "color": "#FFFFFF",
      "shadow": false
    }
  }
}
```

Validation:

- `imageId` tồn tại và chưa hết hạn.
- `presetId` tồn tại, hoặc là `custom`.
- `format` thuộc `jpg`, `png`, `webp`, `avif`.
- `quality` từ 1 đến 100.
- `targetMaxBytes` nếu có phải lớn hơn 10KB và nhỏ hơn giới hạn hệ thống.
- Width/height nếu có phải lớn hơn 0.
- Width/height không vượt giới hạn xử lý, ví dụ 8000px.
- `fit` thuộc `contain`, `cover`, `inside`.
- `paddingPercent` từ 0 đến 30.
- `background.color` phải là mã màu hợp lệ nếu mode là `solid`.

Response thành công:

```json
{
  "success": true,
  "data": {
    "jobId": "job_456",
    "imageId": "img_123",
    "status": "completed",
    "presetId": "shopee-product-square",
    "goal": {
      "targetMaxBytes": 512000,
      "passed": true,
      "actualBytes": 438000,
      "reason": null,
      "suggestions": []
    },
    "result": {
      "fileName": "product-pixpress.webp",
      "format": "webp",
      "mimeType": "image/webp",
      "size": 438000,
      "width": 1024,
      "height": 1024,
      "previewUrl": "/api/images/jobs/job_456/preview",
      "downloadUrl": "/api/images/jobs/job_456/download"
    }
  }
}
```

Response khi xử lý xong nhưng chưa đạt mục tiêu:

```json
{
  "success": true,
  "data": {
    "jobId": "job_789",
    "status": "completed",
    "goal": {
      "targetMaxBytes": 300000,
      "passed": false,
      "actualBytes": 412000,
      "reason": "TARGET_SIZE_NOT_REACHED",
      "suggestions": [
        "Giảm kích thước ảnh xuống 900px.",
        "Chọn ưu tiên Nhẹ nhất.",
        "Đổi sang WEBP hoặc AVIF nếu nền tảng hỗ trợ."
      ]
    },
    "result": {
      "fileName": "product-pixpress.webp",
      "format": "webp",
      "size": 412000,
      "width": 1024,
      "height": 1024,
      "previewUrl": "/api/images/jobs/job_789/preview",
      "downloadUrl": "/api/images/jobs/job_789/download"
    }
  }
}
```

Lưu ý: chưa đạt target không nên là HTTP error nếu ảnh vẫn xử lý thành công. Đây là trạng thái sản phẩm, không phải lỗi server.

### 6.8 Lấy thông tin job

```http
GET /api/images/jobs/:jobId
```

Response:

```json
{
  "success": true,
  "data": {
    "jobId": "job_456",
    "imageId": "img_123",
    "status": "completed",
    "presetId": "shopee-product-square",
    "goal": {
      "targetMaxBytes": 512000,
      "passed": true,
      "actualBytes": 438000
    },
    "original": {
      "fileName": "product.png",
      "format": "png",
      "mimeType": "image/png",
      "size": 2489000,
      "width": 3024,
      "height": 3024
    },
    "result": {
      "fileName": "product-pixpress.webp",
      "format": "webp",
      "mimeType": "image/webp",
      "size": 438000,
      "width": 1024,
      "height": 1024,
      "previewUrl": "/api/images/jobs/job_456/preview",
      "downloadUrl": "/api/images/jobs/job_456/download"
    }
  }
}
```

### 6.9 Preview kết quả

```http
GET /api/images/jobs/:jobId/preview
```

Response:

- Trả ảnh kết quả.
- Nếu file hết hạn, trả lỗi `JOB_EXPIRED`.

### 6.10 Download kết quả

```http
GET /api/images/jobs/:jobId/download
```

Response:

```http
Content-Type: image/webp
Content-Disposition: attachment; filename="product-pixpress.webp"
```

### 6.11 Lịch sử xử lý local

Optional sau MVP nếu chưa có tài khoản.

```http
GET /api/images/history
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "jobId": "job_456",
      "presetId": "shopee-product-square",
      "fileName": "product-pixpress.webp",
      "createdAt": "2026-05-06T10:01:00.000Z",
      "originalSize": 2489000,
      "resultSize": 438000,
      "goalPassed": true,
      "downloadUrl": "/api/images/jobs/job_456/download"
    }
  ]
}
```

### 6.12 Xóa job và file

```http
DELETE /api/images/jobs/:jobId
```

Response:

```json
{
  "success": true
}
```

## 7. Pipeline xử lý ảnh

### 7.1 Pipeline tổng quát

```txt
Nhận request
-> Validate imageId, presetId, overrides
-> Lấy metadata ảnh gốc
-> Resolve preset + overrides thành ProcessOptions
-> Chuẩn bị input buffer
-> Xóa nền nếu background.remove = true
-> Resize/crop/pad theo fit mode
-> Ghép nền nếu cần
-> Convert format
-> Nén theo quality ban đầu
-> Nếu có targetMaxBytes, chạy compression loop
-> Ghi file kết quả
-> Đọc metadata kết quả
-> Đánh giá goal passed/failed
-> Lưu job
-> Trả response
```

### 7.2 Resolve preset

Thứ tự ưu tiên:

```txt
System default
-> Preset default
-> User overrides
-> Backend validation/safety clamp
```

Ví dụ:

- Preset Shopee đặt size 1024x1024.
- User đổi format sang WEBP.
- BE giữ size preset, đổi format theo user.
- Nếu user đặt target 5KB, BE clamp hoặc trả validation error vì quá thấp.

### 7.3 Fit mode

`contain`:

- Giữ toàn bộ ảnh.
- Nếu output có width/height cố định, phần trống được fill bằng background.
- Hợp ảnh sản phẩm.

`cover`:

- Crop để lấp đầy khung.
- Hợp thumbnail social/blog.

`inside`:

- Resize để ảnh nằm trong max width/height.
- Không thêm canvas.
- Hợp ảnh website.

### 7.4 Xóa nền

Pipeline:

```txt
Input file
-> Gửi remove.bg hoặc service tương đương
-> Nhận PNG/WebP có alpha
-> Lưu temp
-> Đưa temp vào Sharp pipeline
-> Xóa temp sau khi xong
```

Quy tắc:

- Timeout riêng, ví dụ 30 giây.
- Nếu xóa nền fail, trả `BACKGROUND_REMOVE_FAILED`.
- Nếu format output là JPG và background mode là transparent, phải cảnh báo hoặc tự đổi background trắng.
- Không gọi remove.bg nếu user không bật xóa nền.

### 7.5 Ghép nền

Mode đề xuất:

```txt
original      Giữ nền gốc
transparent  Giữ alpha
solid         Đổ nền màu
```

Với `solid`:

- Tạo canvas màu.
- Composite ảnh lên canvas.
- Nếu có padding, resize ảnh vào vùng nhỏ hơn canvas.

### 7.6 Compression loop để đạt target

Nếu request có `targetMaxBytes`, BE không nên nén một lần rồi thôi. Cần thử nhiều mức quality.

Thuật toán MVP:

```txt
qualityStart = user quality hoặc preset quality
qualityMin theo priority
qualityStep = 5

render ở qualityStart
nếu size <= target -> đạt
nếu chưa đạt:
  giảm quality mỗi vòng
  render lại
  dừng khi đạt hoặc quality <= qualityMin

nếu vẫn chưa đạt:
  trả ảnh tốt nhất đã tạo
  goal.passed = false
  suggestions = đề xuất giảm size / đổi format / chọn ưu tiên nhẹ hơn
```

Quality min theo priority:

```txt
lightest: 45
balanced: 60
best: 75
```

Sau MVP có thể dùng binary search thay vì giảm tuyến tính.

### 7.7 Khi target quá thấp

Không nên cố nén đến mức ảnh hỏng.

Ví dụ:

- Ảnh 1024x1024 target 20KB gần như không hợp lý.
- BE nên trả validation warning hoặc xử lý xong nhưng `goal.passed = false`.

Gợi ý response:

```json
{
  "code": "TARGET_TOO_AGGRESSIVE",
  "message": "Mục tiêu dung lượng quá thấp so với kích thước ảnh."
}
```

## 8. Service responsibilities

### preset.service.js

Nhiệm vụ:

- Trả danh sách preset.
- Trả chi tiết preset.
- Resolve preset + overrides.
- Validate preset theo constraints.

Hàm đề xuất:

```txt
listPresets(group)
getPresetById(presetId)
resolveProcessOptions(image, presetId, overrides)
validateResolvedOptions(options)
```

### upload.service.js

Nhiệm vụ:

- Nhận file từ Multer.
- Validate MIME.
- Đọc metadata bằng Sharp.
- Lưu file upload.
- Tạo Image record.

Hàm đề xuất:

```txt
createImageFromUpload(file)
getImageById(imageId)
getOriginalPreview(imageId)
```

### processing.service.js

Nhiệm vụ:

- Điều phối toàn bộ pipeline xử lý.
- Gọi background service nếu cần.
- Gọi compression service.
- Ghi result và tạo job.

Hàm đề xuất:

```txt
processImage(imageId, presetId, overrides)
buildSharpPipeline(input, options)
composeBackground(input, options)
writeResult(jobId, buffer, options)
```

### compression.service.js

Nhiệm vụ:

- Convert format.
- Apply quality.
- Thử nhiều quality để đạt target dung lượng.
- Trả kết quả tốt nhất.

Hàm đề xuất:

```txt
renderWithFormat(buffer, options, quality)
optimizeToTarget(buffer, options, targetMaxBytes, priority)
getQualityBounds(priority)
```

### background.service.js

Nhiệm vụ:

- Gọi API xóa nền.
- Quản lý timeout.
- Chuẩn hóa lỗi xóa nền.

Hàm đề xuất:

```txt
removeBackground(inputPath)
```

### storage.service.js

Nhiệm vụ:

- Lưu upload.
- Lưu result.
- Lưu temp.
- Lấy path an toàn.
- Xóa file hết hạn.

Hàm đề xuất:

```txt
saveUpload(file, imageId)
saveResult(jobId, fileName, buffer)
saveTemp(buffer, extension)
getUploadPath(imageId)
getResultPath(jobId)
deleteJobFiles(jobId)
cleanupExpiredFiles()
```

### job.service.js

Nhiệm vụ:

- Tạo job.
- Lấy job.
- Cập nhật status.
- Tính goal result.

Hàm đề xuất:

```txt
createJob(data)
getJobById(jobId)
completeJob(jobId, result)
failJob(jobId, error)
evaluateGoal(result, options)
```

## 9. Error response chuẩn

Tất cả API lỗi nên trả cùng format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ.",
    "details": []
  }
}
```

Mã lỗi đề xuất:

```txt
VALIDATION_ERROR
FILE_REQUIRED
FILE_TOO_LARGE
UNSUPPORTED_FILE_TYPE
IMAGE_READ_FAILED
IMAGE_NOT_FOUND
IMAGE_EXPIRED
PRESET_NOT_FOUND
UNSUPPORTED_FORMAT
INVALID_TARGET_SIZE
INVALID_RESIZE_OPTIONS
BACKGROUND_REMOVE_FAILED
IMAGE_PROCESS_FAILED
JOB_NOT_FOUND
JOB_EXPIRED
DOWNLOAD_FILE_NOT_FOUND
RATE_LIMITED
INTERNAL_ERROR
```

## 10. Bảo mật và giới hạn

Cần có:

- Giới hạn dung lượng upload.
- Validate MIME bằng cả file header/metadata, không chỉ tin `file.mimetype`.
- Không dùng tên file gốc để tạo path.
- Không expose path thật.
- Giới hạn pixel tối đa để tránh ảnh quá lớn gây tốn RAM.
- Giới hạn số vòng compression loop.
- Timeout khi xử lý Sharp.
- Timeout khi gọi remove.bg.
- Xóa temp file trong `finally`.
- Rate limit upload/process nếu public internet.
- TTL cho upload/result.

Giới hạn MVP đề xuất:

```txt
MAX_FILE_SIZE_MB=10
MAX_IMAGE_PIXELS=40000000
MAX_OUTPUT_WIDTH=4000
MAX_OUTPUT_HEIGHT=4000
MAX_COMPRESSION_ATTEMPTS=10
FILE_TTL_MINUTES=60
REMOVE_BG_TIMEOUT_MS=30000
```

## 11. Biến môi trường

```env
PORT=3000
NODE_ENV=development

MAX_FILE_SIZE_MB=10
MAX_IMAGE_PIXELS=40000000
MAX_OUTPUT_WIDTH=4000
MAX_OUTPUT_HEIGHT=4000
MAX_COMPRESSION_ATTEMPTS=10

UPLOAD_DIR=storage/uploads
RESULT_DIR=storage/results
TEMP_DIR=storage/temp
FILE_TTL_MINUTES=60

REMOVE_BG_API_KEY=
REMOVE_BG_TIMEOUT_MS=30000
```

## 12. Thứ tự code BE đề xuất

1. Tạo Express app, health check, error middleware.
2. Tạo upload middleware bằng Multer.
3. Code `POST /api/images/upload`.
4. Code storage local và image record in-memory hoặc JSON file cho MVP.
5. Code `GET /api/images/:imageId/preview`.
6. Tạo preset config và `GET /api/presets`.
7. Code preset resolver.
8. Code `POST /api/images/resolve-options`.
9. Code Sharp pipeline cơ bản: resize + format + quality.
10. Code `POST /api/images/process`.
11. Code result preview/download.
12. Code compression loop theo `targetMaxBytes`.
13. Code background solid/padding cho ảnh sản phẩm.
14. Tích hợp xóa nền.
15. Thêm cleanup file hết hạn.
16. Thêm batch sau MVP.

## 13. Tiêu chí hoàn thành BE MVP

- Upload ảnh hợp lệ thành công.
- Từ chối file sai định dạng.
- Từ chối file quá lớn.
- Đọc metadata ảnh gốc.
- Trả preview ảnh gốc.
- Trả danh sách preset.
- Resolve preset + override đúng.
- Resize được theo `contain`, `cover`, `inside`.
- Convert được JPG, PNG, WEBP, AVIF.
- Nén theo quality.
- Cố đạt target dung lượng bằng compression loop.
- Trả `goal.passed = true/false`.
- Trả suggestions khi chưa đạt.
- Ghép nền trắng cho ảnh sản phẩm.
- Download được file kết quả.
- Xóa temp file sau xử lý.
- Lỗi API có format chuẩn.
