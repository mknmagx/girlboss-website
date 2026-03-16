import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Kayıt Ol",
  description: "GIRLBOSS'a üye olun. Siparişlerinizi takip edin, favorilerinizi kaydedin.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/kullanici/kayit` },
};

export default function KayitLayout({ children }) {
  return children;
}
