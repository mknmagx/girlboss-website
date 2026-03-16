import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Ödeme",
  description: "GIRLBOSS siparişinizi güvenli bir şekilde tamamlayın.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/odeme` },
};

export default function OdemeLayout({ children }) {
  return children;
}
