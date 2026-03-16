import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: `${company.brandName} mesafeli satış sözleşmesi. Online alışverişte tüketici haklarınız ve sözleşme koşulları hakkında bilgi alın.`,
  keywords: ["mesafeli satış sözleşmesi", "tüketici hakları", "online alışveriş sözleşmesi"],
  alternates: { canonical: `${BASE_URL}/mesafeli-satis-sozlesmesi` },
  openGraph: {
    title: "Mesafeli Satış Sözleşmesi – GIRLBOSS",
    description: "Online alışverişte tüketici haklarınız ve sözleşme koşulları.",
    url: `${BASE_URL}/mesafeli-satis-sozlesmesi`,
    type: "website",
  },
};

export default function MesafeliSatisLayout({ children }) {
  return children;
}
