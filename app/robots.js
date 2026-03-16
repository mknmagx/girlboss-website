import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/kullanici/",
          "/sepet/",
          "/odeme/",
          "/favoriler/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
