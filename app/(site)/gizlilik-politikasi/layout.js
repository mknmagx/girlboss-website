import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Gizlilik Politikası – KVKK Aydınlatma Metni",
  description: `${company.brandName} kişisel verilerin korunması politikası. KVKK kapsamında kişisel verilerin nasıl işlendiği, saklandığı ve korunduğu hakkında bilgi alın.`,
  keywords: ["gizlilik politikası", "kvkk", "kişisel verilerin korunması", "girlboss gizlilik"],
  alternates: { canonical: `${BASE_URL}/gizlilik-politikasi` },
  openGraph: {
    title: "Gizlilik Politikası – GIRLBOSS",
    description: "KVKK kapsamında kişisel verilerin korunması politikamız.",
    url: `${BASE_URL}/gizlilik-politikasi`,
    type: "website",
  },
};

export default function GizlilikLayout({ children }) {
  return children;
}
