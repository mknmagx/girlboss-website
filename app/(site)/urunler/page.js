import { getProductsServer } from "@/lib/firebase/adminFirestore";
import UrunlerClient from "./UrunlerClient";

// ISR: rebuild every hour
export const revalidate = 3600;

export default async function UrunlerPage() {
  const all = await getProductsServer();
  const activeProducts = all.filter((p) => p.active !== false);
  return <UrunlerClient products={activeProducts} />;
}
