import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "İletişim – Bize Ulaşın",
  description: `GIRLBOSS müşteri hizmetleriyle iletişime geçin. ${company.phone} | ${company.email} | ${company.address}. Sorularınız, siparişleriniz ve önerileriniz için buradayız.`,
  keywords: [
    "girlboss iletişim",
    "müşteri hizmetleri",
    "girlboss telefon",
    "girlboss e-posta",
    "body mist satış iletişim",
  ],
  alternates: {
    canonical: `${BASE_URL}/iletisim`,
  },
  openGraph: {
    title: "İletişim – GIRLBOSS",
    description:
      "Sorularınız için bize ulaşın. Müşteri hizmetleri her zaman yanınızda.",
    url: `${BASE_URL}/iletisim`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function IletisimLayout({ children }) {
  return children;
}
