module.exports = {
  presets: [
    {
      presetId: "tiktok-shop-product",
      name: "TikTok Shop - Ảnh sản phẩm",
      group: "ecommerce",
      description: "Ảnh sản phẩm cho TikTok Shop - 1:1, nền trắng, 1200x1200px",
      platform: "tiktok-shop",
      output: {
        format: "png",
        width: 1200,
        height: 1200,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 8,
        quality: 90,
        targetMaxBytes: 3000000
      },
      constraints: {
        minWidth: 800,
        maxWidth: 2000,
        minHeight: 800,
        maxHeight: 2000,
        maxTargetBytes: 5242880,
        allowedFormats: ["png"],
        productFillPercent: 70
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "shopee-product-square",
      name: "Shopee - Ảnh sản phẩm",
      group: "ecommerce",
      description: "Ảnh sản phẩm cho Shopee - 1:1, nền trắng, 1024x1024px",
      platform: "shopee",
      output: {
        format: "png",
        width: 1024,
        height: 1024,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 8,
        quality: 82,
        targetMaxBytes: 512000
      },
      constraints: {
        minWidth: 500,
        maxWidth: 2000,
        minHeight: 500,
        maxHeight: 2000,
        maxTargetBytes: 2097152,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 70
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "lazada-product-square",
      name: "Lazada - Ảnh sản phẩm",
      group: "ecommerce",
      description: "Ảnh sản phẩm cho Lazada - 1:1, nền trắng, 1200x1200px",
      platform: "lazada",
      output: {
        format: "png",
        width: 1200,
        height: 1200,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 8,
        quality: 85,
        targetMaxBytes: 512000
      },
      constraints: {
        minWidth: 500,
        maxWidth: 2000,
        minHeight: 500,
        maxHeight: 2000,
        maxTargetBytes: 2097152,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 80
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "website-webp",
      name: "Website - Ảnh WebP",
      group: "website",
      description: "Ảnh tối ưu cho website - WebP, nén nhẹ",
      output: {
        format: "webp",
        width: 1600,
        height: null,
        fit: "inside",
        background: {
          mode: "original"
        },
        quality: 80,
        targetMaxBytes: 800000
      },
      constraints: {
        maxWidth: 2400,
        maxHeight: 2400,
        maxTargetBytes: 5242880,
        allowedFormats: ["webp", "avif", "jpg"]
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "blog-thumbnail",
      name: "Blog - Thumbnail",
      group: "website",
      description: "Thumbnail cho bài blog - 1200x630, cover",
      output: {
        format: "webp",
        width: 1200,
        height: 630,
        fit: "cover",
        background: {
          mode: "original"
        },
        quality: 80,
        targetMaxBytes: 350000
      },
      constraints: {
        maxWidth: 2000,
        maxHeight: 2000,
        maxTargetBytes: 2097152,
        allowedFormats: ["webp", "jpg", "png"]
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "avatar-square",
      name: "Avatar",
      group: "personal",
      description: "Ảnh đại diện - 512x512, vuông",
      output: {
        format: "jpg",
        width: 512,
        height: 512,
        fit: "cover",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        quality: 85,
        targetMaxBytes: 200000
      },
      constraints: {
        maxWidth: 1024,
        maxHeight: 1024,
        maxTargetBytes: 1048576,
        allowedFormats: ["jpg", "png", "webp"]
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "social-instagram",
      name: "Instagram - Ảnh bài viết",
      group: "social",
      description: "Ảnh cho bài viết Instagram - 1080x1080",
      output: {
        format: "jpg",
        width: 1080,
        height: 1080,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        quality: 90,
        targetMaxBytes: 1000000
      },
      constraints: {
        minWidth: 320,
        maxWidth: 2048,
        minHeight: 320,
        maxHeight: 2048,
        maxTargetBytes: 30000000,
        allowedFormats: ["jpg", "png"]
      },
      removeBackgroundDefault: false,
      priority: "best"
    },
    {
      presetId: "facebook-marketplace",
      name: "Facebook Marketplace - Ảnh sản phẩm",
      group: "ecommerce",
      description: "Ảnh sản phẩm cho Facebook Marketplace - 1:1, nền trắng",
      platform: "facebook-marketplace",
      output: {
        format: "png",
        width: 1200,
        height: 1200,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 5,
        quality: 85,
        targetMaxBytes: 2000000
      },
      constraints: {
        minWidth: 500,
        maxWidth: 2048,
        minHeight: 500,
        maxHeight: 2048,
        maxTargetBytes: 10485760,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 70
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "youtube-thumbnail",
      name: "YouTube - Thumbnail",
      group: "social",
      description: "Thumbnail cho video YouTube - 1280x720, 16:9",
      platform: "youtube",
      output: {
        format: "jpg",
        width: 1280,
        height: 720,
        fit: "cover",
        background: {
          mode: "original"
        },
        quality: 90,
        targetMaxBytes: 500000
      },
      constraints: {
        minWidth: 640,
        maxWidth: 3840,
        minHeight: 360,
        maxHeight: 2160,
        maxTargetBytes: 2097152,
        allowedFormats: ["jpg", "png", "webp"]
      },
      removeBackgroundDefault: false,
      priority: "best"
    },
    {
      presetId: "custom",
      name: "Tùy chỉnh",
      group: "personal",
      description: "Tùy chỉnh kích thước, format, chất lượng theo nhu cầu",
      output: {
        format: "jpg",
        width: null,
        height: null,
        fit: "inside",
        background: {
          mode: "original"
        },
        quality: 80,
        targetMaxBytes: null
      },
      constraints: {
        maxWidth: 4000,
        maxHeight: 4000,
        maxTargetBytes: 10485760,
        allowedFormats: ["jpg", "png", "webp", "avif"]
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    }
  ],

  groups: [
    { id: "ecommerce", name: "Thương mại điện tử" },
    { id: "social", name: "Mạng xã hội" },
    { id: "website", name: "Website" },
    { id: "personal", name: "Cá nhân" }
  ]
};