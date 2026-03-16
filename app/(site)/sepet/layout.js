import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Sepetim",
  description: "GIRLBOSS alışveriş sepetinizi görüntüleyin ve siparişinizi tamamlayın.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/sepet` },
};

export default function SepetLayout({ children }) {
  return children;
}
