import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Giriş Yap",
  description: "GIRLBOSS hesabınıza giriş yapın ve alışverişe devam edin.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/kullanici/giris` },
};

export default function GirisLayout({ children }) {
  return children;
}
