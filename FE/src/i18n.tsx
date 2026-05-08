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
      title: "Prepare images for marketplaces, social posts, and websites",
      description:
        "Upload an image, choose where it will be published, and Pixpress will prepare the size, format, file weight, and background.",
      uploadStatus: "Upload status",
      limit: "Limit",
      mode: "Mode",
      singleFile: "Single file",
      queue: "Image details",
      fileName: "File name",
      noFile: "No file selected",
      type: "Type",
      continue: "Continue",
      uploading: "Preparing...",
      sellerWorkflow: "Image publishing workflow",
      seoTitle: "Create platform-ready images faster",
      seoDescription:
        "Pixpress starts from where you want to publish, then applies practical defaults for size, format, file weight, and background.",
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
      faqFormatsText: "Pixpress accepts JPG, PNG, and WEBP files up to 10MB.",
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
      eyebrow: "Step 2 — Edit",
      title: "Choose where this image will be used",
      description: "Use platform presets for ready-to-publish files, or switch to custom mode for manual control.",
      settings: "Edit settings",
      alpha: "Alpha",
      controls: "Custom settings",
      process: "Create image",
      processing: "Processing...",
      invalidDimensions: "Width and height must be greater than 0.",
      jpgTransparency: "JPG does not support transparency.",
      pngCompression: "PNG compression may be less effective than JPG or WEBP.",
      avifSlow: "AVIF compresses well, but processing can take longer.",
      stepTarget: "Choose destination",
      stepLayout: "Crop & size",
      stepOutput: "Output quality",
      stepBackground: "Background",
      targetHelp: "Choose where the image will be published. Pixpress applies the recommended size and format.",
      layoutHelp: "Fit the image to the selected frame and adjust the crop when needed.",
      outputHelp: "Set the output format and target file size.",
      backgroundHelp: "Choose the background color.",
      removeBackgroundLocked: "Auto background removal — coming soon.",
      multiTitle: "Export for multiple platforms",
      multiHelp: "Create separate files for each platform at once.",
      output: "Output",
      target: "Size goal",
      estimate: "Estimate",
      modePlatform: "By platform",
      modeCustom: "Custom",
      platformModeTitle: "Choose publishing platforms",
      platformModeDesc: "Pixpress creates a separate image for each platform, with the required size, format, crop, and file weight.",
      platformProcessBtn: "Create selected platform images",
      platformProcessing: "Processing...",
      platformNote: "Each selected platform gets its own output size and crop. You can fine-tune any result before downloading.",
      platformBgRemovalNote: "Auto background removal — coming soon",
      customModeTitle: "Custom settings",
      customModeDesc: "Manually adjust size, format, quality, and background as needed.",
    },
    controls: {
      outputFormat: "Output format",
      resize: "Output frame",
      width: "Width",
      height: "Height",
      keepAspect: "Keep aspect ratio",
      removeBackground: "Remove background",
      originalPreview: "Original preview",
      cropPreview: "Crop area",
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
      processImage: "The image could not be processed.",
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
      waiting: "Chưa có ảnh",
      queued: "Đã chọn",
      ready: "Sẵn sàng",
      idle: "Trống",
      running: "Đang xử lý",
      complete: "Hoàn tất",
      on: "Bật",
      off: "Tắt",
      back: "Quay lại",
      file: "File",
      size: "Dung lượng",
      format: "Định dạng",
      quality: "Chất lượng",
      status: "Trạng thái",
      dimensions: "Kích thước",
    },
    upload: {
      eyebrow: "Bước 1 — Tải ảnh",
      title: "Chuẩn bị ảnh sẵn sàng đăng bán",
      description:
        "Tải ảnh lên, chọn nơi đăng, Pixpress sẽ chuẩn hóa kích thước, định dạng, dung lượng và nền ảnh.",
      uploadStatus: "Thông tin ảnh",
      limit: "Giới hạn",
      mode: "Chế độ",
      singleFile: "Một ảnh",
      queue: "Thông tin ảnh",
      fileName: "Tên file",
      noFile: "Chưa chọn ảnh",
      type: "Định dạng",
      continue: "Tiếp tục",
      uploading: "Đang chuẩn bị...",
      sellerWorkflow: "Quy trình chuẩn bị ảnh đăng",
      seoTitle: "Tạo ảnh đúng chuẩn sàn nhanh hơn",
      seoDescription:
        "Pixpress bắt đầu từ nơi bạn muốn đăng ảnh, sau đó áp dụng kích thước, định dạng và dung lượng phù hợp.",
      featureCompressTitle: "Nén ảnh",
      featureCompressText: "Giảm dung lượng ảnh để tải lên nhanh hơn mà vẫn giữ chất lượng hiển thị phù hợp.",
      featureConvertTitle: "Chuyển sang WEBP",
      featureConvertText: "Chuyển ảnh sang định dạng phù hợp cho website, cửa hàng online và bài đăng bán hàng.",
      featureResizeTitle: "Đổi kích thước",
      featureResizeText: "Tạo ảnh đúng kích thước theo yêu cầu của từng sàn, nền tảng hoặc vị trí hiển thị.",
      faq: "Câu hỏi thường gặp",
      faqFreeTitle: "Pixpress có miễn phí không?",
      faqFreeText: "Có. Hiện tại hoàn toàn miễn phí, không cần đăng nhập và không chèn watermark.",
      faqFormatsTitle: "Hỗ trợ định dạng nào?",
      faqFormatsText: "Pixpress nhận file JPG, PNG và WEBP tối đa 10MB.",
      faqProductTitle: "Pixpress dùng được cho việc gì?",
      faqProductText: "Dùng cho ảnh sản phẩm, bài đăng mạng xã hội, ảnh hồ sơ, website và các nhu cầu tối ưu ảnh hằng ngày.",
    },
    dropzone: {
      drop: "Thả ảnh vào đây",
      supports: "Hỗ trợ JPG, PNG và WEBP. Tối đa 10MB.",
      choose: "Chọn ảnh",
      remove: "Xoá ảnh",
      tooLarge: "File vượt quá 10MB.",
      unsupported: "Định dạng không hỗ trợ. Dùng JPG, PNG hoặc WEBP.",
      rejected: "Không thể nhận file này.",
    },
    edit: {
      eyebrow: "Bước 2 — Chỉnh ảnh",
      title: "Chọn nơi dùng ảnh",
      description: "Chọn theo sàn để tạo file sẵn đăng, hoặc tự chỉnh nếu bạn cần kiểm soát từng thông số.",
      settings: "Tuỳ chỉnh ảnh",
      alpha: "Nền trong suốt",
      controls: "Tuỳ chỉnh",
      process: "Tạo ảnh",
      processing: "Đang xử lý...",
      invalidDimensions: "Chiều rộng và chiều cao phải lớn hơn 0.",
      jpgTransparency: "JPG không hỗ trợ nền trong suốt.",
      pngCompression: "PNG có thể nén kém hiệu quả hơn JPG hoặc WEBP.",
      avifSlow: "AVIF nén tốt, nhưng xử lý có thể lâu hơn.",
      stepTarget: "Chọn nơi đăng",
      stepLayout: "Cắt & kích thước",
      stepOutput: "Chất lượng xuất",
      stepBackground: "Nền ảnh",
      targetHelp: "Chọn nơi ảnh sẽ được sử dụng. Pixpress sẽ áp dụng kích thước và định dạng phù hợp.",
      layoutHelp: "Căn ảnh theo khung đã chọn và điều chỉnh vùng cắt khi cần.",
      outputHelp: "Chọn định dạng ảnh và dung lượng mục tiêu.",
      backgroundHelp: "Chọn màu nền ảnh.",
      removeBackgroundLocked: "Xóa nền tự động — sắp ra mắt.",
      multiTitle: "Xuất cho nhiều sàn",
      multiHelp: "Tạo file riêng cho từng sàn cùng lúc.",
      output: "Đầu ra",
      target: "Mục tiêu",
      estimate: "Ước tính",
      modePlatform: "Theo sàn",
      modeCustom: "Tự chỉnh",
      platformModeTitle: "Chọn sàn cần tạo ảnh",
      platformModeDesc: "Pixpress tạo file riêng cho từng sàn, đúng kích thước, định dạng, vùng cắt và dung lượng mục tiêu.",
      platformProcessBtn: "Tạo ảnh cho các sàn đã chọn",
      platformProcessing: "Đang xử lý...",
      platformNote: "Mỗi sàn sẽ có ảnh đầu ra riêng. Bạn có thể kiểm tra và chỉnh lại từng ảnh trước khi tải xuống.",
      platformBgRemovalNote: "Xóa nền tự động — sắp ra mắt",
      customModeTitle: "Tuỳ chỉnh thông số",
      customModeDesc: "Tự điều chỉnh kích thước, định dạng, chất lượng và nền ảnh theo nhu cầu riêng.",
    },
    controls: {
      outputFormat: "Định dạng",
      resize: "Khung ảnh",
      width: "Rộng",
      height: "Cao",
      keepAspect: "Giữ tỷ lệ",
      removeBackground: "Xóa nền",
      originalPreview: "Ảnh gốc",
      cropPreview: "Vùng cắt",
    },
    result: {
      unavailable: "Không có kết quả",
      expiredTitle: "Kết quả đã hết hạn",
      expiredText: "Kết quả không còn khả dụng. Hãy xử lý lại ảnh.",
      expiredError: "Kết quả đã hết hạn. Hãy xử lý lại ảnh.",
      processAnother: "Xử lý ảnh khác",
      eyebrow: "Bước 3 — Kết quả",
      title: "Ảnh đã sẵn sàng tải xuống",
      description: "Xem ảnh đã xử lý, so sánh thông tin và tải về.",
      status: "Trạng thái",
      job: "Lần xử lý",
      processedPreview: "Ảnh sau xử lý",
      downloadConsole: "Tải xuống",
      download: "Tải xuống",
      editAgain: "Chỉnh lại",
      details: "Thông tin chi tiết",
      originalFile: "File gốc",
      originalSize: "Dung lượng gốc",
      originalDimensions: "Kích thước gốc",
      resultFile: "File kết quả",
      resultSize: "Dung lượng sau xử lý",
      resultDimensions: "Kích thước sau xử lý",
      reduction: "Mức giảm dung lượng",
    },
    errors: {
      readImage: "Không thể đọc ảnh.",
      processImage: "Không thể xử lý ảnh.",
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
