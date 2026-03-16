import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Hesabım",
  description: "GIRLBOSS hesabınızı yönetin. Siparişlerinizi takip edin, adres bilgilerinizi güncelleyin.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/kullanici` },
};

export default function KullaniciLayout({ children }) {
  return children;
}
