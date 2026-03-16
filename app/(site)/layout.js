import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

/**
 * Site route group layout.
 * Provides homepage-level metadata; individual sub-routes
 * override this via their own layout.js files.
 */
export const metadata = {
  title: `${company.brandName} | Lüks Body Mist Koleksiyonu`,
  description: `${company.brandDescription} ${company.brandTagline}. Türkiye'nin en seçkin lüks body mist koleksiyonu.`,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: `${company.brandName} | ${company.brandTagline}`,
    description: `${company.brandDescription} 6 eşsiz body mist ile tanışın.`,
    url: BASE_URL,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function SiteLayout({ children }) {
  return children;
}
