import { BackgroundMode, FitMode, ImageFormat, OptimizationPriority } from "../types";
import type { Language } from "../i18n";

type LocalizedText = Record<Language, string>;

export type PlatformPreset = {
  id: string;
  group: LocalizedText;
  name: LocalizedText;
  summary: LocalizedText;
  format: ImageFormat;
  width: number;
  height: number;
  maxSizeKb: number;
  backgroundMode: BackgroundMode;
  removeBackground: boolean;
  paddingPercent: number;
  fitMode: FitMode;
  quality: number;
  priority: OptimizationPriority;
};

export const platformPresets: PlatformPreset[] = [
  preset("shopee-product", "Marketplace", "Sàn thương mại", "Shopee", "Shopee", "Square image, 1024x1024, WEBP, white background, under 500KB", "Ảnh vuông 1024x1024, WEBP, nền trắng, dưới 500KB", "webp", 1024, 1024, 500, "white", true, 12, "pad", 82, "balanced"),
  preset("lazada-product", "Marketplace", "Sàn thương mại", "Lazada", "Lazada", "Square image, 1200x1200, JPG, white background, under 700KB", "Ảnh vuông 1200x1200, JPG, nền trắng, dưới 700KB", "jpg", 1200, 1200, 700, "white", true, 10, "pad", 84, "balanced"),
  preset("tiktok-shop", "Marketplace", "Sàn thương mại", "TikTok Shop", "TikTok Shop", "Square image, 1080x1080, WEBP, clean background, under 600KB", "Ảnh vuông 1080x1080, WEBP, nền sạch, dưới 600KB", "webp", 1080, 1080, 600, "white", true, 10, "pad", 82, "balanced"),
  preset("amazon-product", "Marketplace", "Sàn thương mại", "Amazon", "Amazon", "Square product image, 2000x2000, JPG, white background, under 2MB", "Ảnh sản phẩm vuông 2000x2000, JPG, nền trắng, dưới 2MB", "jpg", 2000, 2000, 2000, "white", false, 8, "pad", 88, "best"),
  preset("ebay-product", "Marketplace", "Sàn thương mại", "eBay", "eBay", "Square listing image, 1600x1600, JPG, clean background, under 1.5MB", "Ảnh listing vuông 1600x1600, JPG, nền sạch, dưới 1.5MB", "jpg", 1600, 1600, 1500, "white", false, 8, "pad", 86, "balanced"),
  preset("etsy-listing", "Marketplace", "Sàn thương mại", "Etsy", "Etsy", "4:3 listing image, 2000x1500, JPG, under 1.5MB", "Ảnh listing 4:3, 2000x1500, JPG, dưới 1.5MB", "jpg", 2000, 1500, 1500, "white", false, 4, "cover", 86, "balanced"),
  preset("facebook-marketplace", "Marketplace", "Sàn thương mại", "Facebook Marketplace", "Facebook Marketplace", "Square marketplace image, 1200x1200, JPG, under 1MB", "Ảnh sàn vuông 1200x1200, JPG, dưới 1MB", "jpg", 1200, 1200, 1000, "white", false, 6, "pad", 84, "balanced"),
  preset("shopify-product", "Website", "Website", "Shopify product", "Shopify product", "Square product image, 2048x2048, WEBP, under 1MB", "Ảnh sản phẩm vuông 2048x2048, WEBP, dưới 1MB", "webp", 2048, 2048, 1000, "white", false, 6, "pad", 84, "balanced"),
  preset("woocommerce-product", "Website", "Website", "WooCommerce product", "WooCommerce product", "Square store image, 1200x1200, WEBP, under 700KB", "Ảnh cửa hàng vuông 1200x1200, WEBP, dưới 700KB", "webp", 1200, 1200, 700, "white", false, 6, "pad", 82, "balanced"),
  preset("facebook-post", "Social", "Mạng xã hội", "Facebook post", "Facebook post", "4:5, 1080x1350, JPG, under 700KB", "4:5, 1080x1350, JPG, dưới 700KB", "jpg", 1080, 1350, 700, "white", false, 0, "cover", 84, "balanced"),
  preset("instagram-square", "Social", "Mạng xã hội", "Instagram square", "Instagram square", "1:1, 1080x1080, JPG, under 650KB", "1:1, 1080x1080, JPG, dưới 650KB", "jpg", 1080, 1080, 650, "white", false, 0, "cover", 84, "balanced"),
  preset("pinterest-pin", "Social", "Mạng xã hội", "Pinterest pin", "Pinterest pin", "2:3 pin image, 1000x1500, JPG, under 700KB", "Ảnh ghim 2:3, 1000x1500, JPG, dưới 700KB", "jpg", 1000, 1500, 700, "white", false, 0, "cover", 84, "balanced"),
  preset("tiktok-cover", "Social", "Mạng xã hội", "TikTok cover", "TikTok cover", "9:16, 1080x1920, JPG, under 900KB", "9:16, 1080x1920, JPG, dưới 900KB", "jpg", 1080, 1920, 900, "white", false, 0, "cover", 84, "balanced"),
  preset("website-webp", "Website", "Website", "Website WebP", "Website WebP", "1600x900, WEBP, balanced quality, under 450KB", "1600x900, WEBP, cân bằng, dưới 450KB", "webp", 1600, 900, 450, "transparent", false, 0, "contain", 80, "balanced"),
  preset("blog-thumbnail", "Website", "Website", "Blog thumbnail", "Blog thumbnail", "1200x630, WEBP, under 350KB", "1200x630, WEBP, dưới 350KB", "webp", 1200, 630, 350, "transparent", false, 0, "cover", 78, "smallest"),
  preset("landing-hero", "Website", "Website", "Landing page hero", "Landing page hero", "1920x1080, WEBP, best quality, under 900KB", "1920x1080, WEBP, đẹp nhất, dưới 900KB", "webp", 1920, 1080, 900, "transparent", false, 0, "cover", 88, "best"),
  preset("avatar", "Personal", "Cá nhân", "Avatar", "Avatar", "1:1, 800x800, JPG, centered, under 300KB", "1:1, 800x800, JPG, căn giữa, dưới 300KB", "jpg", 800, 800, 300, "light-gray", false, 6, "cover", 84, "balanced"),
  preset("cv-profile", "Personal", "Cá nhân", "CV / profile", "CV / hồ sơ", "3:4, 900x1200, JPG, clean background, under 450KB", "3:4, 900x1200, JPG, nền sạch, dưới 450KB", "jpg", 900, 1200, 450, "white", false, 4, "cover", 84, "balanced"),
  preset("custom", "Personal", "Cá nhân", "Custom", "Tự chỉnh", "Keep original size, choose every output setting manually", "Giữ kích thước gốc, tự chỉnh mọi thông số", "webp", 0, 0, 800, "transparent", false, 0, "contain", 80, "balanced"),
];

function preset(
  id: string,
  groupEn: string,
  groupVi: string,
  nameEn: string,
  nameVi: string,
  summaryEn: string,
  summaryVi: string,
  format: ImageFormat,
  width: number,
  height: number,
  maxSizeKb: number,
  backgroundMode: BackgroundMode,
  removeBackground: boolean,
  paddingPercent: number,
  fitMode: FitMode,
  quality: number,
  priority: OptimizationPriority,
): PlatformPreset {
  return {
    id,
    group: { en: groupEn, vi: groupVi },
    name: { en: nameEn, vi: nameVi },
    summary: { en: summaryEn, vi: summaryVi },
    format,
    width,
    height,
    maxSizeKb,
    backgroundMode,
    removeBackground,
    paddingPercent,
    fitMode,
    quality,
    priority,
  };
}
