import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Favorilerim",
  description: "Beğendiğin GIRLBOSS body mist ürünlerini favorilerine ekle, istediğin zaman kolayca sepete at.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE_URL}/favoriler` },
};

export default function FavorilerLayout({ children }) {
  return children;
}
