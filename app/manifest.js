import { company } from "@/lib/config/company";

export default function manifest() {
  return {
    id: "/",
    name: company.brandName,
    short_name: company.brandName,
    description: company.brandDescription,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf8f5",
    theme_color: "#b76e79",
    categories: ["shopping", "lifestyle", "beauty"],
    lang: "tr",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og-image.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "wide",
        label: "GIRLBOSS Ana Sayfa",
      },
    ],
    shortcuts: [
      {
        name: "Ürünler",
        short_name: "Ürünler",
        description: "Tüm body mist koleksiyonu",
        url: "/urunler",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
