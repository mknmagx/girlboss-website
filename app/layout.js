import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { company } from "@/lib/config/company";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${company.brandName} | Lüks Body Mist Koleksiyonu`,
    template: `%s | ${company.brandName}`,
  },
  description: `${company.brandDescription} ${company.brandTagline}. Türkiye'nin en seçkin lüks body mist koleksiyonu.`,
  keywords: [
    "body mist",
    "lüks body mist",
    "kadın parfümü",
    "body mist türkiye",
    "kalıcı body mist",
    "girlboss",
    "vegan parfüm",
    "dermatolog onaylı body mist",
    "body mist koleksiyonu",
    "hediye parfüm",
  ],
  authors: [{ name: company.brandName, url: BASE_URL }],
  creator: company.brandName,
  publisher: company.legalName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: `${company.brandName} | ${company.brandTagline}`,
    description: `${company.brandDescription} 6 eşsiz body mist ile tanışın.`,
    type: "website",
    url: BASE_URL,
    siteName: company.brandName,
    locale: "tr_TR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${company.brandName} – ${company.brandTagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.brandName} | ${company.brandTagline}`,
    description: `${company.brandDescription}`,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#b76e79",
  width: "device-width",
  initialScale: 1,
};

/* ─── Organization + WebSite JSON-LD ─────────────────────── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.brandName,
  legalName: company.legalName,
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  description: company.brandDescription,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: company.phone,
    contactType: "customer service",
    email: company.email,
    availableLanguage: "Turkish",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yakuplu Mah. Dereboyu Cad. No:4/1",
    addressLocality: "Beylikdüzü",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: company.brandName,
  url: BASE_URL,
  description: company.brandDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/urunler?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Dark mode: apply theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gb_theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
