import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Hakkımızda – Kokunla Hükmet",
  description:
    "GIRLBOSS, kendine güvenen, cesur ve zarif kadınlar için doğdu. Her bir koku, bir kadının farklı yüzünü temsil eder. Markamızın hikayesini keşfedin.",
  keywords: [
    "girlboss hakkında",
    "girlboss hikayesi",
    "body mist markası",
    "lüks parfüm türkiye",
    "girlboss kimdir",
    "tongzi bertug",
  ],
  alternates: {
    canonical: `${BASE_URL}/hakkimizda`,
  },
  openGraph: {
    title: "Hakkımızda – GIRLBOSS | Kokunla Hükmet",
    description:
      "GIRLBOSS, kendine güvenen, cesur ve zarif kadınlar için doğdu.",
    url: `${BASE_URL}/hakkimizda`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda – GIRLBOSS",
    description: "GIRLBOSS, kendine güvenen kadınlar için doğdu.",
  },
};

export default function HakkimizdaLayout({ children }) {
  return children;
}
