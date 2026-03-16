import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Teslimat & İade Politikası",
  description: `${company.brandName} teslimat süreleri, iade koşulları ve kargo bilgileri. Siparişinizi kolayca iade etmek için ihtiyacınız olan her şey.`,
  keywords: ["teslimat bilgisi", "iade politikası", "kargo", "iade koşulları", "girlboss kargo"],
  alternates: { canonical: `${BASE_URL}/teslimat-iade` },
  openGraph: {
    title: "Teslimat & İade Politikası – GIRLBOSS",
    description: "Teslimat süreleri, iade koşulları ve kargo bilgileri.",
    url: `${BASE_URL}/teslimat-iade`,
    type: "website",
  },
};

export default function TeslimatIadeLayout({ children }) {
  return children;
}
