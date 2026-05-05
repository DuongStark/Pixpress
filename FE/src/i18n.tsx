import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type Language = "en" | "vi";

const languageKey = "pixpress.language";

const dictionaries = {
  en: {
    header: {
      home: "Pixpress home",
      workflow: "Workflow",
      upload: "01 Upload",
      edit: "02 Edit",
      result: "03 Result",
      newImage: "New image",
      language: "Language",
    },
    common: {
      waiting: "Waiting",
      queued: "Queued",
      ready: "Ready",
      idle: "Idle",
      running: "Running",
      complete: "Complete",
      on: "On",
      off: "Off",
      back: "Back",
      file: "File",
      size: "Size",
      format: "Format",
      quality: "Quality",
      status: "Status",
      dimensions: "Dimensions",
    },
    upload: {
      eyebrow: "Step 01 / Input",
      title: "Turn raw images into ready-to-publish assets",
      description:
        "Upload an image, choose where you want to publish it, and Pixpress will optimize size, format, file weight, and background.",
      uploadStatus: "Upload status",
      limit: "Limit",
      mode: "Mode",
      singleFile: "Single file",
      queue: "Queue / 001",
      fileName: "File name",
      noFile: "No file selected",
      type: "Type",
      continue: "Continue optimizing",
      uploading: "Uploading...",
      sellerWorkflow: "Everyday image workflow",
      seoTitle: "Prepare product, social, and website images faster",
      seoDescription:
        "Pixpress starts from the publishing target, then fills practical defaults for size, format, target weight, and background.",
      featureCompressTitle: "Compress images",
      featureCompressText: "Reduce file size for photos, screenshots, banners, and uploads while keeping previews clean.",
      featureConvertTitle: "Convert to WEBP",
      featureConvertText: "Prepare modern image files for websites, blogs, online stores, portfolios, and landing pages.",
      featureResizeTitle: "Resize for any requirement",
      featureResizeText: "Set width and height values when a platform, form, profile, shop, or layout needs exact dimensions.",
      faq: "FAQ",
      faqFreeTitle: "Is Pixpress free?",
      faqFreeText: "Yes. The current tool is free to use, with no login and no watermark.",
      faqFormatsTitle: "Which image formats are supported?",
      faqFormatsText: "Pixpress accepts JPG, PNG, and WEBP files up to 10MB in the current MVP.",
      faqProductTitle: "What can I use Pixpress for?",
      faqProductText:
        "Use it for websites, product photos, social posts, profile images, documents, portfolios, and everyday image uploads.",
    },
    dropzone: {
      drop: "Drop an image here",
      supports: "Supports JPG, PNG, and WEBP. Max file size 10MB.",
      choose: "Choose image",
      remove: "Remove image",
      tooLarge: "File is larger than 10MB.",
      unsupported: "Unsupported file type. Use JPG, PNG, or WEBP.",
      rejected: "The file could not be accepted.",
    },
    edit: {
      eyebrow: "Step 02 / Settings",
      title: "Prepare image for publishing",
      description: "Choose a platform preset, then adjust target size, format, resize, and background when needed.",
      settings: "Processing settings",
      alpha: "Alpha",
      controls: "Publishing controls",
      process: "Process image",
      processing: "Processing...",
      invalidDimensions: "Width and height must be greater than 0.",
      jpgTransparency: "JPG does not support transparency.",
      pngCompression: "PNG compression may be less effective than JPG or WEBP.",
      avifSlow: "AVIF compresses well, but processing can take longer.",
    },
    controls: {
      outputFormat: "Output format",
      resize: "Resize",
      width: "Width",
      height: "Height",
      keepAspect: "Keep aspect ratio",
      removeBackground: "Remove background",
      originalPreview: "Original preview",
    },
    result: {
      unavailable: "Result unavailable",
      expiredTitle: "File expired",
      expiredText: "The result is no longer available. Process the image again.",
      expiredError: "File expired. Please process the image again.",
      processAnother: "Process another image",
      eyebrow: "Step 03 / Output",
      title: "Result ready",
      description: "Review the processed image, compare metadata, and download the final file.",
      status: "Result status",
      job: "Job",
      processedPreview: "Processed preview",
      downloadConsole: "Download console",
      download: "Download",
      editAgain: "Edit again",
      details: "Result details",
      originalFile: "Original file",
      originalSize: "Original size",
      originalDimensions: "Original dimensions",
      resultFile: "Result file",
      resultSize: "Result size",
      resultDimensions: "Result dimensions",
      reduction: "Estimated reduction",
    },
    errors: {
      readImage: "The image could not be read.",
    },
  },
  vi: {
    header: {
      home: "Trang chủ Pixpress",
      workflow: "Quy trình",
      upload: "01 Tải ảnh",
      edit: "02 Chỉnh ảnh",
      result: "03 Kết quả",
      newImage: "Ảnh mới",
      language: "Ngôn ngữ",
    },
    common: {
      waiting: "Đang chờ",
      queued: "Đã xếp hàng",
      ready: "Sẵn sàng",
      idle: "Rảnh",
      running: "Đang chạy",
      complete: "Hoàn tất",
      on: "Bật",
      off: "Tắt",
      back: "Quay lại",
      file: "Tệp",
      size: "Dung lượng",
      format: "Định dạng",
      quality: "Chất lượng",
      status: "Trạng thái",
      dimensions: "Kích thước",
    },
    upload: {
      eyebrow: "Bước 01 / Ảnh đầu vào",
      title: "Biến ảnh thô thành ảnh sẵn đăng",
      description:
        "Tải ảnh lên, chọn nơi bạn muốn đăng, Pixpress sẽ tối ưu kích thước, dung lượng, định dạng và nền ảnh.",
      uploadStatus: "Trạng thái tải ảnh",
      limit: "Giới hạn",
      mode: "Chế độ",
      singleFile: "Một ảnh",
      queue: "Hàng chờ / 001",
      fileName: "Tên tệp",
      noFile: "Chưa chọn tệp",
      type: "Loại",
      continue: "Tiếp tục tối ưu",
      uploading: "Đang tải...",
      sellerWorkflow: "Quy trình xử lý ảnh hằng ngày",
      seoTitle: "Chuẩn bị ảnh sản phẩm, social và website nhanh hơn",
      seoDescription:
        "Pixpress bắt đầu từ nơi đăng, sau đó tự điền kích thước, định dạng, mục tiêu dung lượng và nền ảnh phù hợp.",
      featureCompressTitle: "Nén ảnh",
      featureCompressText: "Giảm dung lượng cho ảnh chụp, screenshot, banner và tệp tải lên nhưng vẫn giữ bản xem trước rõ.",
      featureConvertTitle: "Chuyển sang WEBP",
      featureConvertText: "Chuẩn bị định dạng ảnh hiện đại cho website, blog, cửa hàng online, portfolio và landing page.",
      featureResizeTitle: "Đổi kích thước theo nhu cầu",
      featureResizeText: "Đặt chiều rộng và chiều cao khi nền tảng, biểu mẫu, hồ sơ, shop hoặc layout cần kích thước chính xác.",
      faq: "FAQ",
      faqFreeTitle: "Pixpress có miễn phí không?",
      faqFreeText: "Có. Công cụ hiện tại miễn phí, không cần đăng nhập và không chèn watermark.",
      faqFormatsTitle: "Hỗ trợ định dạng ảnh nào?",
      faqFormatsText: "Pixpress nhận tệp JPG, PNG và WEBP tối đa 10MB trong bản MVP hiện tại.",
      faqProductTitle: "Pixpress dùng được cho việc gì?",
      faqProductText: "Dùng cho website, ảnh sản phẩm, bài đăng mạng xã hội, ảnh hồ sơ, tài liệu, portfolio và nhu cầu tải ảnh hằng ngày.",
    },
    dropzone: {
      drop: "Thả ảnh vào đây",
      supports: "Hỗ trợ JPG, PNG và WEBP. Dung lượng tối đa 10MB.",
      choose: "Chọn ảnh",
      remove: "Xóa ảnh",
      tooLarge: "Tệp lớn hơn 10MB.",
      unsupported: "Định dạng chưa hỗ trợ. Hãy dùng JPG, PNG hoặc WEBP.",
      rejected: "Không thể nhận tệp này.",
    },
    edit: {
      eyebrow: "Bước 02 / Cài đặt",
      title: "Chuẩn bị ảnh để đăng",
      description: "Chọn preset theo nơi đăng, rồi chỉnh mục tiêu, định dạng, kích thước và nền khi cần.",
      settings: "Cài đặt xử lý",
      alpha: "Nền trong",
      controls: "Bảng chuẩn bị ảnh",
      process: "Xử lý ảnh",
      processing: "Đang xử lý...",
      invalidDimensions: "Chiều rộng và chiều cao phải lớn hơn 0.",
      jpgTransparency: "JPG không hỗ trợ nền trong suốt.",
      pngCompression: "PNG có thể nén kém hiệu quả hơn JPG hoặc WEBP.",
      avifSlow: "AVIF nén tốt, nhưng xử lý có thể lâu hơn.",
    },
    controls: {
      outputFormat: "Định dạng đầu ra",
      resize: "Đổi kích thước",
      width: "Rộng",
      height: "Cao",
      keepAspect: "Giữ tỷ lệ ảnh",
      removeBackground: "Xóa nền",
      originalPreview: "Ảnh gốc",
    },
    result: {
      unavailable: "Không có kết quả",
      expiredTitle: "Tệp đã hết hạn",
      expiredText: "Kết quả không còn khả dụng. Hãy xử lý ảnh lại.",
      expiredError: "Tệp đã hết hạn. Hãy xử lý ảnh lại.",
      processAnother: "Xử lý ảnh khác",
      eyebrow: "Bước 03 / Đầu ra",
      title: "Kết quả đã sẵn sàng",
      description: "Xem ảnh đã xử lý, so sánh thông tin và tải tệp cuối cùng.",
      status: "Trạng thái kết quả",
      job: "Job",
      processedPreview: "Ảnh đã xử lý",
      downloadConsole: "Bảng tải xuống",
      download: "Tải xuống",
      editAgain: "Chỉnh lại",
      details: "Chi tiết kết quả",
      originalFile: "Tệp gốc",
      originalSize: "Dung lượng gốc",
      originalDimensions: "Kích thước gốc",
      resultFile: "Tệp kết quả",
      resultSize: "Dung lượng kết quả",
      resultDimensions: "Kích thước kết quả",
      reduction: "Mức giảm ước tính",
    },
    errors: {
      readImage: "Không thể đọc ảnh.",
    },
  },
} as const;

type WidenStrings<T> = {
  readonly [Key in keyof T]: T[Key] extends string ? string : WidenStrings<T[Key]>;
};

type Dictionary = WidenStrings<typeof dictionaries.en>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = window.localStorage.getItem(languageKey);
    if (stored === "vi" || stored === "en") {
      return stored;
    }

    return window.navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en";
  });

  const value = useMemo<I18nContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      window.localStorage.setItem(languageKey, nextLanguage);
      setLanguageState(nextLanguage);
      document.documentElement.lang = nextLanguage;
    }

    document.documentElement.lang = language;

    return {
      language,
      setLanguage,
      t: dictionaries[language],
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
