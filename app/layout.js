import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GIRLBOSS | Lüks Body Mist Koleksiyonu",
  description:
    "Kendine güvenen, güçlü ve zarif kadınlar için tasarlanmış lüks body mist koleksiyonu. Kokunla Hükmet.",
  keywords: [
    "body mist",
    "parfüm",
    "kadın",
    "lüks",
    "koku",
    "girlboss",
    "victoria secret tarzı",
  ],
  openGraph: {
    title: "GIRLBOSS | Kokunla Hükmet",
    description:
      "6 eşsiz body mist ile tanışın. Kendine güvenen kadınlar için tasarlandı.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
