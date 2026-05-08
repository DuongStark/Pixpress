# Pixpress Backend API Docs

Tài liệu này mô tả API backend cho Pixpress theo cơ chế **hybrid client-first**:

- Máy người dùng đủ khỏe: FE xử lý ảnh ngay trên client, không upload ảnh lên BE.
- Máy yếu, browser thiếu capability, ảnh quá nặng, hoặc xử lý local lỗi: FE gửi ảnh lên BE để xử lý fallback bằng Sharp.
- MVP không upload ảnh gốc lên R2, không lưu file lâu dài, không tạo job async.
- MVP có hỗ trợ xóa nền bằng API ngoài. Với tác vụ có `removeBackground = true`, FE luôn gửi ảnh lên BE, BE gọi Re-imaged rồi xử lý tiếp bằng Sharp.

## 1. Backend Làm Gì

Backend trong MVP có 4 nhiệm vụ chính:

1. Cung cấp preset chuẩn cho FE.
2. Validate request và options khi FE cần fallback.
3. Gọi Re-imaged để xóa nền khi user bật `removeBackground`.
4. Xử lý ảnh fallback bằng Sharp rồi trả file kết quả trực tiếp.

Backend chưa làm trong MVP:

- Không lưu ảnh gốc lên R2.
- Không lưu ảnh gốc vào local storage bền.
- Không tạo history.
- Không tạo account.
- Không tạo job async.
- Không tạo download URL lâu dài.
- Không batch.

Backend có gọi service ngoài trong MVP:

- Re-imaged `POST /api/remove_background` cho xóa nền.
- BE không expose API key cho FE.
- BE không lưu response Re-imaged ra disk, chỉ giữ trong memory trong thời gian xử lý request.
- Nếu Re-imaged lỗi, BE trả lỗi để FE hiển thị user retry hoặc tắt xóa nền.

## 2. Base URL

Local development:

```txt
http://localhost:3001/api
```

FE dev server proxy:

```txt
/api
```

## 3. Response Format Chung

Các API trả JSON dùng format:

```json
{
  "success": true,
  "data": {}
}
```

Lỗi dùng format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "Human readable error message."
  }
}
```

Riêng `POST /api/images/process` khi thành công trả binary image, không trả JSON.

## 4. Health API

### `GET /api/health`

Kiểm tra backend còn sống.

Request:

```http
GET /api/health
```

Response `200`:

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-05-08T00:00:00.000Z"
}
```

FE dùng API này để:

- Kiểm tra backend available trước khi fallback.
- Hiển thị lỗi mềm nếu server fallback không sẵn sàng.

## 5. Preset APIs

Preset là rule chuẩn cho từng nơi đăng ảnh. BE là nguồn chuẩn, FE có thể cache nhưng không nên tự quyết rule chính.

### `GET /api/presets`

Lấy danh sách preset.

Request:

```http
GET /api/presets
```

Query optional:

| Query | Type | Required | Notes |
| --- | --- | --- | --- |
| `group` | string | no | `ecommerce`, `social`, `website`, `personal` |

Ví dụ:

```http
GET /api/presets?group=ecommerce
```

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "presetId": "shopee-product-square",
      "name": "Shopee - Ảnh sản phẩm",
      "group": "ecommerce",
      "description": "Ảnh sản phẩm cho Shopee - 1:1, nền trắng, 1024x1024px",
      "platform": "shopee",
      "output": {
        "format": "png",
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
      "constraints": {
        "minWidth": 500,
        "maxWidth": 2000,
        "minHeight": 500,
        "maxHeight": 2000,
        "maxTargetBytes": 2097152,
        "allowedFormats": ["jpg", "png"],
        "productFillPercent": 70
      },
      "removeBackgroundDefault": false,
      "priority": "balanced"
    }
  ]
}
```

Validation:

- Nếu `group` rỗng hoặc không truyền: trả toàn bộ preset.
- Nếu `group` không thuộc danh sách hỗ trợ: trả `400`.

Error `400`:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "Unsupported preset group."
  }
}
```

FE dùng API này để:

- Render preset selector.
- Lấy default options cho client-side processing.
- Lấy cùng preset để gửi lên server fallback khi cần.

## 6. Image Processing APIs

### `POST /api/images/process`

Server xử lý một ảnh khi FE cần fallback hoặc khi tác vụ bắt buộc chạy backend.

API này được gọi trong 2 trường hợp:

1. Máy/browser không đủ điều kiện client-side, hoặc client-side xử lý fail.
2. User bật `removeBackground`. Case này luôn chạy backend vì BE phải gọi Re-imaged.

Request:

```http
POST /api/images/process
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `file` | File | yes | JPG, PNG, WEBP |
| `options` | JSON string | no | Process options từ FE |

Ví dụ `options`:

```json
{
  "format": "webp",
  "quality": 82,
  "resize": {
    "width": 1024,
    "height": 1024,
    "fit": "contain"
  },
  "goal": {
    "maxSizeKb": 500,
    "priority": "balanced"
  },
  "background": {
    "mode": "white",
    "color": "#FFFFFF",
    "paddingPercent": 8,
    "centerProduct": true,
    "softShadow": false
  },
  "removeBackground": true,
  "preset": {
    "id": "shopee-product-square",
    "name": "Shopee - Ảnh sản phẩm"
  }
}
```

MVP xử lý các fields sau:

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `format` | string | input format hoặc `webp` | `jpg`, `jpeg`, `png`, `webp`, `avif` |
| `quality` | number | `82` | Clamp về 1-100 |
| `resize.width` | number | original width | Số nguyên dương nếu truyền |
| `resize.height` | number | original height | Số nguyên dương nếu truyền |
| `resize.fit` | string | `inside` | `contain`, `cover`, `inside`; `pad` map sang `contain` |
| `removeBackground` | boolean | `false` | Nếu `true`, BE gọi Re-imaged trước khi xử lý Sharp |

Thứ tự xử lý MVP:

```txt
Nếu removeBackground = true:
1. BE nhận ảnh gốc từ FE.
2. BE gửi ảnh gốc dạng base64 lên Re-imaged.
3. Re-imaged trả PNG có alpha.
4. BE dùng PNG này làm input cho Sharp.
5. BE crop/resize/convert/compress theo options.
6. BE trả binary image cuối cùng về FE.

Nếu removeBackground = false:
1. BE dùng ảnh user upload làm input cho Sharp.
2. BE crop/resize/convert/compress theo options.
3. BE trả binary image cuối cùng về FE.
```

Không crop/nén mạnh trên client trước khi gọi xóa nền, vì làm mất detail ở viền subject và có thể làm AI cắt xấu hơn. Ngoại lệ duy nhất: nếu ảnh quá lớn, BE có thể downscale nhẹ trước khi gọi Re-imaged để giảm payload, nhưng không nên JPEG-compress mạnh.

MVP nhận nhưng chưa xử lý thật các fields sau:

| Field | Notes |
| --- | --- |
| `goal.maxSizeKb` | Chưa có compression loop để đảm bảo target |
| `goal.priority` | Chưa dùng để chọn quality min |
| `background.mode` | Chưa compose nền nâng cao |
| `background.paddingPercent` | Chưa tạo canvas/padding nâng cao |
| `background.softShadow` | Chưa hỗ trợ |
| `preset` | Chưa resolve lại preset trong endpoint này |

Response thành công `200`:

```http
Content-Type: image/webp
Content-Disposition: attachment; filename="product-pixpress.webp"
X-Pixpress-File-Name: product-pixpress.webp
X-Pixpress-Format: webp
X-Pixpress-Size: 438000
X-Pixpress-Width: 1024
X-Pixpress-Height: 1024
```

Body là binary image.

FE xử lý response như sau:

1. Đọc body thành `Blob`.
2. Tạo object URL bằng `URL.createObjectURL(blob)`.
3. Đọc metadata từ response headers.
4. Dùng object URL làm preview/download URL.

Ví dụ FE pseudo-code:

```ts
const formData = new FormData();
formData.append("file", file);
formData.append("options", JSON.stringify(options));

const response = await fetch("/api/images/process", {
  method: "POST",
  body: formData,
});

if (!response.ok) {
  throw await parseApiError(response);
}

const blob = await response.blob();
const result = {
  fileName: response.headers.get("X-Pixpress-File-Name") ?? "image-pixpress.webp",
  format: response.headers.get("X-Pixpress-Format") ?? options.format,
  size: Number(response.headers.get("X-Pixpress-Size") ?? blob.size),
  width: Number(response.headers.get("X-Pixpress-Width")),
  height: Number(response.headers.get("X-Pixpress-Height")),
  previewUrl: URL.createObjectURL(blob),
};
```

Validation:

- `file` bắt buộc.
- `file.mimetype` phải thuộc `image/jpeg`, `image/png`, `image/webp`.
- `file.size <= MAX_UPLOAD_BYTES`.
- Sharp phải đọc được metadata.
- `format` phải thuộc `jpg`, `jpeg`, `png`, `webp`, `avif`.
- `quality` nếu truyền sẽ clamp 1-100.
- `resize.width` và `resize.height` nếu truyền phải là số nguyên dương.
- `resize.fit` phải thuộc `contain`, `cover`, `inside`, `pad`.

Error examples:

Không có file:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "No file uploaded."
  }
}
```

Sai định dạng:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "Unsupported file type: image/gif"
  }
}
```

Options JSON lỗi:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "Invalid options JSON."
  }
}
```

Format output không hỗ trợ:

```json
{
  "success": false,
  "error": {
    "code": "ERROR",
    "message": "Unsupported output format."
  }
}
```

## 7. Hybrid Decision Contract

FE quyết định local hay server trước khi process.

Decision input:

```ts
type ClientProcessDecisionInput = {
  file: File;
  image: {
    width: number;
    height: number;
    mimeType: string;
  };
  options: ProcessOptions;
};
```

Rule MVP:

```txt
Use client-side when:
- file.size <= 10MB
- width * height <= 20MP
- output format is supported in browser
- navigator.deviceMemory is missing or >= 4
- removeBackground is false

Use server fallback when:
- removeBackground is true
- any condition above fails
- client-side processing throws
- user manually chooses server fallback later
```

Luồng ví dụ user chọn crop + compress + remove background:

```txt
FE
-> Không crop/nén trước.
-> POST /api/images/process với file gốc và options đầy đủ.

BE
-> Gọi Re-imaged remove_background bằng ảnh gốc.
-> Nhận PNG transparent.
-> Apply crop/resize/format/quality bằng Sharp.
-> Trả ảnh cuối về FE.
```

Luồng ví dụ user chỉ chọn crop + compress:

```txt
FE
-> Nếu máy đủ khỏe: xử lý bằng canvas/browser API, không upload file lên BE.
-> Nếu máy yếu hoặc lỗi: POST /api/images/process để BE xử lý bằng Sharp.
```

FE pseudo-code:

```ts
async function processImage(file, image, options) {
  if (options.removeBackground) {
    return processOnServer(file, options);
  }

  if (shouldUseClientProcessing(file, image, options)) {
    try {
      return await processOnClient(file, options);
    } catch {
      return processOnServer(file, options);
    }
  }

  return processOnServer(file, options);
}
```

## 8. API Loại Khỏi MVP

### `POST /api/images/upload`

Không dùng trong MVP.

Lý do:

- Client khỏe không cần upload.
- Server fallback nhận file trực tiếp trong `/api/images/process`.
- Upload raw file lên R2 trước khi biết có cần server hay không làm chậm flow và tăng cost.

### Job APIs

Chưa làm trong MVP:

```txt
GET /api/images/:imageId/preview
GET /api/images/jobs/:jobId
GET /api/images/jobs/:jobId/preview
GET /api/images/jobs/:jobId/download
DELETE /api/images/jobs/:jobId
```

Chỉ thêm lại khi có job storage thật.

### Export APIs

Chưa làm trong MVP:

```txt
POST /api/images/export-platforms
GET /api/exports/:exportId
GET /api/exports/:exportId/download.zip
GET /api/exports/:exportId/variants/:variantId/download
```

Chỉ thêm sau khi single-image pipeline ổn.

## 9. API Nên Thêm Sau MVP

### `POST /api/images/resolve-options`

Mục đích: BE resolve preset + overrides thành options cuối cùng để FE preview trước khi process.

Request:

```json
{
  "presetId": "shopee-product-square",
  "overrides": {
    "format": "webp",
    "quality": 80,
    "resize": {
      "width": 1024,
      "height": 1024,
      "fit": "contain"
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
        "fit": "contain"
      },
      "background": {
        "mode": "solid",
        "color": "#FFFFFF",
        "paddingPercent": 8
      }
    },
    "warnings": []
  }
}
```

### `POST /api/images/process-json`

Chỉ cần nếu sau MVP muốn lưu result lên R2 hoặc object storage rồi trả JSON.

Response dạng đó:

```json
{
  "success": true,
  "data": {
    "jobId": "job_123",
    "result": {
      "fileName": "product-pixpress.webp",
      "format": "webp",
      "mimeType": "image/webp",
      "size": 438000,
      "width": 1024,
      "height": 1024,
      "downloadUrl": "https://cdn.example.com/results/job_123.webp"
    }
  }
}
```

Không thêm API này nếu chưa cần URL sống lâu.

## 10. Environment Variables

```env
PORT=3001
NODE_ENV=development
API_PREFIX=/api
MAX_UPLOAD_BYTES=10485760
REIMAGED_API_KEY=
```

Notes:

- `REIMAGED_API_KEY` chỉ nằm ở BE.
- Không đưa key này vào FE env.
- Khi deploy, set key bằng secret/env của hosting provider.

MVP không cần:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

## 11. Implementation Priority

Thứ tự code hợp lý:

1. Giữ `GET /api/health`.
2. Giữ `GET /api/presets`.
3. Hoàn thiện `POST /api/images/process` fallback.
4. Thêm Re-imaged integration cho `removeBackground = true`.
5. FE dùng preset từ BE.
6. FE làm client-side processing thật cho tác vụ không xóa nền.
7. FE thêm decision layer local/server.
8. Thêm compression loop cho target size.
9. Thêm background composer.
10. Thêm compliance checker.
11. Sau đó mới tính R2, job async, multi-platform, batch.

## 12. R2 Khi Nào Quay Lại

Chỉ thêm R2 khi có nhu cầu rõ:

- User cần link tải sống sau request.
- Có account/history.
- Batch async cần ZIP.
- Job xử lý lâu cần queue.
- Muốn share result qua URL public.

Khi thêm lại, ưu tiên lưu **result**, không upload raw file như bước bắt buộc:

```txt
FE fallback
-> POST /api/images/process-json
-> BE process Sharp
-> BE upload result lên R2
-> BE trả JSON downloadUrl
```
