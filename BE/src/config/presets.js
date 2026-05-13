export const presets = [
    {
      presetId: "tiktok-shop-product",
      name: "TikTok Shop",
      group: "ecommerce",
      description: "Ảnh vuông cho TikTok Shop, nền trắng, 1200x1200px",
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
      name: "Shopee",
      group: "ecommerce",
      description: "Ảnh vuông cho Shopee, nền trắng, 1024x1024px",
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
      name: "Lazada",
      group: "ecommerce",
      description: "Ảnh vuông cho Lazada, nền trắng, 1200x1200px",
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
      presetId: "amazon-product",
      name: "Amazon",
      group: "ecommerce",
      description: "Square product image, white background, 2000x2000px",
      platform: "amazon",
      output: {
        format: "jpg",
        width: 2000,
        height: 2000,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 8,
        quality: 88,
        targetMaxBytes: 2048000
      },
      constraints: {
        minWidth: 1000,
        maxWidth: 3000,
        minHeight: 1000,
        maxHeight: 3000,
        maxTargetBytes: 10485760,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 75
      },
      removeBackgroundDefault: false,
      priority: "best"
    },
    {
      presetId: "ebay-product",
      name: "eBay",
      group: "ecommerce",
      description: "Square listing image, clean background, 1600x1600px",
      platform: "ebay",
      output: {
        format: "jpg",
        width: 1600,
        height: 1600,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 8,
        quality: 86,
        targetMaxBytes: 1536000
      },
      constraints: {
        minWidth: 500,
        maxWidth: 3000,
        minHeight: 500,
        maxHeight: 3000,
        maxTargetBytes: 10485760,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 70
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "etsy-listing",
      name: "Etsy",
      group: "ecommerce",
      description: "4:3 listing image, 2000x1500px",
      platform: "etsy",
      output: {
        format: "jpg",
        width: 2000,
        height: 1500,
        fit: "cover",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 4,
        quality: 86,
        targetMaxBytes: 1536000
      },
      constraints: {
        minWidth: 1000,
        maxWidth: 3000,
        minHeight: 750,
        maxHeight: 3000,
        maxTargetBytes: 10485760,
        allowedFormats: ["jpg", "png"],
        productFillPercent: 75
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "website-webp",
      name: "Website WebP",
      group: "website",
      description: "Ảnh WebP tối ưu cho website, dung lượng nhẹ",
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
      name: "Thumbnail bài viết",
      group: "website",
      description: "Ảnh đại diện bài viết, 1200x630px",
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
      description: "Ảnh đại diện vuông, 512x512px",
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
      name: "Instagram",
      group: "social",
      description: "Ảnh vuông cho bài đăng Instagram, 1080x1080px",
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
      name: "Facebook Marketplace",
      group: "ecommerce",
      description: "Ảnh vuông cho Facebook Marketplace, nền trắng",
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
      presetId: "shopify-product",
      name: "Shopify product",
      group: "website",
      description: "Square product image for online stores, 2048x2048px",
      platform: "shopify",
      output: {
        format: "webp",
        width: 2048,
        height: 2048,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 6,
        quality: 84,
        targetMaxBytes: 1024000
      },
      constraints: {
        minWidth: 800,
        maxWidth: 3000,
        minHeight: 800,
        maxHeight: 3000,
        maxTargetBytes: 5242880,
        allowedFormats: ["jpg", "png", "webp"],
        productFillPercent: 75
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "woocommerce-product",
      name: "WooCommerce product",
      group: "website",
      description: "Square product image for WooCommerce stores, 1200x1200px",
      platform: "woocommerce",
      output: {
        format: "webp",
        width: 1200,
        height: 1200,
        fit: "contain",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 6,
        quality: 82,
        targetMaxBytes: 716800
      },
      constraints: {
        minWidth: 600,
        maxWidth: 2400,
        minHeight: 600,
        maxHeight: 2400,
        maxTargetBytes: 5242880,
        allowedFormats: ["jpg", "png", "webp"],
        productFillPercent: 75
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "youtube-thumbnail",
      name: "YouTube thumbnail",
      group: "social",
      description: "Ảnh thumbnail YouTube, 1280x720px, tỷ lệ 16:9",
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
      presetId: "pinterest-pin",
      name: "Pinterest pin",
      group: "social",
      description: "2:3 Pinterest pin image, 1000x1500px",
      platform: "pinterest",
      output: {
        format: "jpg",
        width: 1000,
        height: 1500,
        fit: "cover",
        background: {
          mode: "solid",
          color: "#FFFFFF"
        },
        paddingPercent: 0,
        quality: 84,
        targetMaxBytes: 716800
      },
      constraints: {
        minWidth: 600,
        maxWidth: 2000,
        minHeight: 900,
        maxHeight: 3000,
        maxTargetBytes: 5242880,
        allowedFormats: ["jpg", "png", "webp"]
      },
      removeBackgroundDefault: false,
      priority: "balanced"
    },
    {
      presetId: "custom",
      name: "Tùy chỉnh",
      group: "personal",
      description: "Tự chọn kích thước, định dạng và chất lượng theo nhu cầu",
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
  ];
