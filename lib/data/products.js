/**
 * GIRLBOSS — Product Data
 * 6 Body Mist Products
 *
 * `images`           — ürüne ait görsel dizisi (carousel için).
 * `ingredients`      — şişe üzerindeki INCI bileşen listesi.
 * `features`         — ikon anahtarı + metin çiftleri. İkon: "leaf"|"clock"|"shield"|"star"|"heart"|"sparkle"
 * `reviews`          — başlangıç müşteri değerlendirmeleri (seed verisi).
 * `rating`           — ortalama puan (0–5).
 * `reviewCount`      — toplam değerlendirme sayısı.
 * `ratingBreakdown`  — yıldız dağılımı [{stars, count, pct}].
 * `originalPrice`    — üstü çizili eski fiyat.
 */

export const products = [
  /* ─────────────────────────────────────────────── 1. LUNARA ── */
  {
    id: 1,
    slug: "lunara",
    name: "Lunara",
    tagline: "Ayın Büyüsü",
    taglineEn: "Moon's Magic",
    price: 449.90,
    originalPrice: 539.90,
    description: "Okyanusun serinliği, mavi irisin gizemli zarafeti ve yumuşak müskün sarıp sarmaladığı dingin bir koku. Lunara, gecelerin aydınlık ruhunu tenine yansıtır.",
    descriptionEn: "The coolness of the ocean, the mysterious elegance of blue iris, and the soft embrace of musk. Lunara reflects the luminous spirit of nights onto your skin.",
    notes: { top: "Okyanus Kırağısı & Bergamot", middle: "Mavi İris & Yasemin", base: "Beyaz Müsk & Sandal Ağacı" },
    notesEn: { top: "Ocean Dew & Bergamot", middle: "Blue Iris & Jasmine", base: "White Musk & Sandalwood" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 42090",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "12s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.7,
    reviewCount: 54,
    ratingBreakdown: [
      { stars: 5, count: 38, pct: 70 },
      { stars: 4, count: 11, pct: 20 },
      { stars: 3, count: 4, pct: 8 },
      { stars: 2, count: 1, pct: 1 },
      { stars: 1, count: 0, pct: 0 },
    ],
    reviews: [
      {
        id: 1, name: "Selin K.", avatar: "S", rating: 5, date: "10 Mart 2026",
        title: "Çok ferah ve dinlendirici",
        body: "Lunara'yı ilk kullandığımda okyanusun taze kokusuyla büyülendim. Sabah duşunun ardından bir sprey yeterli, gün boyunca eşliğimde.",
        helpful: 14,
        images: ["/products/Secret_Romantıc_1_görsel_PNG.png"],
      },
      {
        id: 2, name: "Ayşe M.", avatar: "A", rating: 5, date: "5 Mart 2026",
        title: "Şişesi de çok şık",
        body: "Mavi rengiyle çok zarif bir görüntüsü var. Kokusu gerçekten taze ve hafif, kalıcılığı da beni şaşırttı. Kesinlikle tavsiye ederim.",
        helpful: 8,
      },
      {
        id: 3, name: "Zeynep T.", avatar: "Z", rating: 4, date: "28 Şubat 2026",
        title: "Güzel ama biraz pahalı",
        body: "Koku kalitesi iyi, hafif çiçeksi notalara çok uyuyor. Fiyata göre biraz yüksek ama kaliteyi görünce anlıyorsunuz.",
        helpful: 5,
      },
      {
        id: 4, name: "Merve D.", avatar: "M", rating: 5, date: "20 Şubat 2026",
        title: "Hediye olarak aldım, çok beğenildi",
        body: "Annem için doğum günü hediyesi olarak aldım. Kutuyu açtığında çok mutlu oldu, Lunara'nın kokusunu artık her gün kullanıyor.",
        helpful: 19,
        images: ["/products/Secret_Romantıc_2_beyaz.jpg.jpeg"],
      },
      {
        id: 5, name: "Nilüfer A.", avatar: "N", rating: 5, date: "15 Şubat 2026",
        title: "Vazgeçilmezim oldu",
        body: "Her sabah sürüyorum ve ferahlığı gün boyu hissediyorum. Okyanus notaları gerçekten huzur verici.",
        helpful: 22,
        images: ["/products/Seraphıne_1_görse_png.png"],
      },
    ],
    color: "#4db8e8",
    gradient: "linear-gradient(135deg, #4db8e8, #85d0f0, #c0e8f8)",
    volume: "250ml",
    badge: "Yeni",
    images: [
      "/products/Secret_Romantıc_1_görsel_PNG.png",
      "/products/Secret_Romantıc_1_görsel_PNG.png",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },

  /* ─────────────────────────────────────────── 2. VELVET SHIMMER ── */
  {
    id: 2,
    slug: "velvet-shimmer",
    name: "Velvet Shimmer",
    tagline: "Kadifemsi Parıltı",
    taglineEn: "Velvety Shimmer",
    price: 479.90,
    originalPrice: 574.90,
    description: "Mor menekşenin büyüleyici derinliği, kasisin tatlı ekşiliği ve nemli toprağın gizemli kokusu. Velvet Shimmer, sizi büyüleyen bir aura yaratır.",
    descriptionEn: "The captivating depth of violet, sweet tartness of blackcurrant, and mysterious scent of damp earth. Velvet Shimmer creates an enchanting aura around you.",
    notes: { top: "Siyah Frenk Üzümü & Bergamot", middle: "Menekşe & Lavanta", base: "Sandal Ağacı & Müsk" },
    notesEn: { top: "Blackcurrant & Bergamot", middle: "Violet & Lavender", base: "Sandalwood & Musk" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 60730",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "10s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.9,
    reviewCount: 87,
    ratingBreakdown: [
      { stars: 5, count: 72, pct: 83 },
      { stars: 4, count: 11, pct: 13 },
      { stars: 3, count: 3, pct: 3 },
      { stars: 2, count: 1, pct: 1 },
      { stars: 1, count: 0, pct: 0 },
    ],
    reviews: [
      {
        id: 1, name: "Büşra Y.", avatar: "B", rating: 5, date: "12 Mart 2026",
        title: "Harikaaaa!",
        body: "Velvet Shimmer'ı aldığımda rengi ve kokusu beni bütünüyle büyüledi. Menekşe notaları çok zarif, gün boyu üstümde kalıyor.",
        helpful: 31,
        images: ["/products/Secret_Romantıc_1_görsel_PNG.png"],
      },
      {
        id: 2, name: "Esra T.", avatar: "E", rating: 5, date: "8 Mart 2026",
        title: "Mor rengi çok şık",
        body: "Hem şişesi hem kokusu birbirini tamamlıyor. Lavanta ve menekşenin uyumu mükemmel. Tekrar tekrar alıyorum.",
        helpful: 18,
      },
      {
        id: 3, name: "Gizem K.", avatar: "G", rating: 4, date: "2 Mart 2026",
        title: "Çok iyi kalıcılık",
        body: "Kokusu saatlerce üstümde kalıyor. Sandal ağacı bazı biraz yoğun gelebilir ama zamanla çok güzel açılıyor.",
        helpful: 9,
      },
      {
        id: 4, name: "Damla Ö.", avatar: "D", rating: 5, date: "22 Şubat 2026",
        title: "En favori kodum artık",
        body: "Koleksiyonun en mistik kokusu bu. Akşam üstü kullandığımda komşularım bile sordu nereden?",
        helpful: 27,
        images: ["/products/Seraphıne_2.jpg.jpeg"],
      },
    ],
    color: "#9b5fc0",
    gradient: "linear-gradient(135deg, #9b5fc0, #c090e0, #e0c8f5)",
    volume: "250ml",
    badge: "Bestseller",
    images: [
      "/products/Secret_Romantıc_1_görsel_PNG.png",
      "/products/Secret_Romantıc_1_görsel_PNG.png",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },

  /* ─────────────────────────────────────────── 3. SECRET ROMANTIC ── */
  {
    id: 3,
    slug: "secret-romantic",
    name: "Secret Romantic",
    tagline: "Gizli Romantizm",
    taglineEn: "Secret Romance",
    price: 449.90,
    originalPrice: 539.90,
    description: "Pembe gülün büyüleyici yumuşaklığı, şeftalinin tatlı çekiciliği ve kırmızı müskün tutku dolu sıcaklığı. Secret Romantic, kalbinizdeki gizli aşkın kokusudur.",
    descriptionEn: "The enchanting softness of pink rose, sweet allure of peach, and the passionate warmth of red musk. Secret Romantic is the scent of the secret love in your heart.",
    notes: { top: "Pembe Gül & Şeftali", middle: "Frezya & Zambak", base: "Kırmızı Müsk & Vanilya" },
    notesEn: { top: "Pink Rose & Peach", middle: "Freesia & Lily", base: "Red Musk & Vanilla" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 16035",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "12s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.8,
    reviewCount: 128,
    ratingBreakdown: [
      { stars: 5, count: 98, pct: 77 },
      { stars: 4, count: 20, pct: 16 },
      { stars: 3, count: 7, pct: 5 },
      { stars: 2, count: 2, pct: 1 },
      { stars: 1, count: 1, pct: 1 },
    ],
    reviews: [
      {
        id: 1, name: "Selin K.", avatar: "S", rating: 5, date: "12 Mart 2026",
        title: "Harika bir koku!",
        body: "Secret Romantic gerçekten muhteşem. Kokusu sabahtan akşama kadar kalıcı, çevremdekiler çok beğendi. Kesinlikle tavsiye ederim.",
        helpful: 18,
        images: [
          "/products/WhatsApp Image 2026-03-06 at 15.59.25.jpeg",
          "/products/Secret_Romantıc_1_görsel_PNG.png",
        ],
      },
      {
        id: 2, name: "Ayşe M.", avatar: "A", rating: 5, date: "8 Mart 2026",
        title: "Beklentilerimin üzerinde",
        body: "Ambalajı çok şık ve kaliteli. Pembe gül ve şeftali uyumu gerçekten büyüleyici. Her gün kullanıyorum.",
        helpful: 12,
        images: ["/products/Seraphıne_1_görse_png.png"],
      },
      {
        id: 3, name: "Zeynep T.", avatar: "Z", rating: 4, date: "3 Mart 2026",
        title: "Güzel ama biraz pahalı",
        body: "Koku kalitesi gerçekten iyi, kalıcılığı da tatmin edici. Fiyatı biraz yüksek ama kalitesini düşününce değer.",
        helpful: 7,
      },
      {
        id: 4, name: "Merve D.", avatar: "M", rating: 5, date: "28 Şubat 2026",
        title: "Hediye olarak aldım, çok sevdiler",
        body: "Annem için doğum günü hediyesi aldım. Kutu açılışı bile çok özel hissettiriyor. Kokuyu da çok beğendi, teşekkürler Girlboss!",
        helpful: 21,
        images: [
          "/products/Secret_Romantıc_2_beyaz.jpg.jpeg",
          "/products/Seraphıne_2.jpg.jpeg",
        ],
      },
      {
        id: 5, name: "Nilüfer A.", avatar: "N", rating: 5, date: "20 Şubat 2026",
        title: "Vazgeçilmezim oldu",
        body: "Her sabah sürüyorum ve gün boyu eşliğimde. Kokusu çiçeksi ama aşırıya kaçmıyor, tam istediğim denge. Büyük boy satılsa kesin alırım.",
        helpful: 34,
        images: ["/products/Secret_Romantıc_1_görsel_PNG.png"],
      },
      {
        id: 6, name: "Gizem K.", avatar: "G", rating: 4, date: "15 Şubat 2026",
        title: "Kalıcılığı gerçekten harika",
        body: "Beden nemlendiricisi üstüne sürünce çok daha uzun sürüyor. Koku biraz ağır gelebilir ama zamanla yumuşuyor. Genel olarak çok memnunum.",
        helpful: 9,
      },
      {
        id: 7, name: "Büşra Y.", avatar: "B", rating: 3, date: "10 Şubat 2026",
        title: "Ortalama bir ürün",
        body: "Koku güzel ama kalıcılığı benim için yeterince uzun sürmüyor. Belki cilt tipime göre değişiyordur.",
        helpful: 3,
      },
      {
        id: 8, name: "Esra T.", avatar: "E", rating: 5, date: "5 Şubat 2026",
        title: "Mükemmel doğum günü hediyesi",
        body: "Arkadaşıma aldım, ambalajı çok şıktı. Kokuyu da çok sevdi ve hemen tekrar sipariş verdi. Girlboss kalitesi her zaman güzel.",
        helpful: 15,
      },
    ],
    color: "#d94070",
    gradient: "linear-gradient(135deg, #d94070, #f07090, #faaab8)",
    volume: "250ml",
    badge: "Bestseller",
    images: [
      "/products/Secret_Romantıc_1_görsel_PNG.png",
      "/products/Secret_Romantıc_2_beyaz.jpg.jpeg",
      "/products/WhatsApp Image 2026-03-06 at 15.59.25.jpeg",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },

  /* ───────────────────────────────────────────────── 4. VENERA ── */
  {
    id: 4,
    slug: "venera",
    name: "Venera",
    tagline: "Aşkın Tanrıçası",
    taglineEn: "Goddess of Love",
    price: 459.90,
    originalPrice: 549.90,
    description: "Ahududunun canlı enerjisi, şakayığın feminen zarafeti ve amber'in sıcak derinliği. Venera, Venüs'ün ilahi çekiciliğini size taşır.",
    descriptionEn: "The vibrant energy of raspberry, feminine elegance of peony, and warm depth of amber. Venera brings the divine allure of Venus to you.",
    notes: { top: "Ahududu & Pembe Biber", middle: "Şakayık & Manolya", base: "Amber & Sandal Ağacı" },
    notesEn: { top: "Raspberry & Pink Pepper", middle: "Peony & Magnolia", base: "Amber & Sandalwood" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 16035",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "10s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.6,
    reviewCount: 63,
    ratingBreakdown: [
      { stars: 5, count: 44, pct: 70 },
      { stars: 4, count: 13, pct: 21 },
      { stars: 3, count: 4, pct: 6 },
      { stars: 2, count: 2, pct: 2 },
      { stars: 1, count: 0, pct: 0 },
    ],
    reviews: [
      {
        id: 1, name: "Cansu B.", avatar: "C", rating: 5, date: "11 Mart 2026",
        title: "Tanrıçalar gibi kokuyorum",
        body: "Venera adı boşuna değil. Ahududu ve şakayık karışımı çok feminen, her giydiğimde çevremdekiler sorular soruyor.",
        helpful: 16,
        images: ["/products/Secret_Romantıc_1_görsel_PNG.png"],
      },
      {
        id: 2, name: "İrem S.", avatar: "İ", rating: 5, date: "6 Mart 2026",
        title: "Pembe amber kombinasyonu harika",
        body: "Amber bazı kokusu çok sıcak ve sarmalayıcı. Kış aylarında mükemmel. Şişesi de çok şık.",
        helpful: 11,
      },
      {
        id: 3, name: "Pınar K.", avatar: "P", rating: 4, date: "25 Şubat 2026",
        title: "Beklentimi karşıladı",
        body: "Güzel bir koku ama Secret Romantic kadar etkileyici bulmadım. Yine de iyi bir seçim.",
        helpful: 4,
      },
      {
        id: 4, name: "Dilan Y.", avatar: "D", rating: 5, date: "17 Şubat 2026",
        title: "Romantic ama daha güçlü",
        body: "Secret Romantic ile kardeş kokular ama Venera daha yoğun. İkisi arasında gidip geliyorum, ikisini de seviyorum!",
        helpful: 23,
        images: ["/products/Seraphıne_1_görse_png.png"],
      },
    ],
    color: "#b04898",
    gradient: "linear-gradient(135deg, #b04898, #d078c0, #f0b0e0)",
    volume: "250ml",
    badge: null,
    images: [
      "/products/Secret_Romantıc_1_görsel_PNG.png",
      "/products/Secret_Romantıc_1_görsel_PNG.png",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },

  /* ──────────────────────────────────────────── 5. ECLIPSE DESIRE ── */
  {
    id: 5,
    slug: "eclipse-desire",
    name: "Eclipse Desire",
    tagline: "Tutku Tutulması",
    taglineEn: "Eclipse of Desire",
    price: 469.90,
    originalPrice: 563.90,
    description: "Mandalina ve portakal çiçeğinin sıcak enerjisi, zencefilin yakıcı canlılığı ve vanilin tatlı kucaklaması. Eclipse Desire, içinizdeki tutkuyu ateşler.",
    descriptionEn: "Warm energy of tangerine and orange blossom, burning vibrancy of ginger, and sweet embrace of vanilla. Eclipse Desire ignites the passion within you.",
    notes: { top: "Mandalina & Portakal Çiçeği", middle: "Zencefil & Tropik Çiçek", base: "Amber & Vanilya" },
    notesEn: { top: "Tangerine & Orange Blossom", middle: "Ginger & Tropical Flower", base: "Amber & Vanilla" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 75130",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "10s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.7,
    reviewCount: 49,
    ratingBreakdown: [
      { stars: 5, count: 34, pct: 69 },
      { stars: 4, count: 11, pct: 23 },
      { stars: 3, count: 3, pct: 6 },
      { stars: 2, count: 1, pct: 2 },
      { stars: 1, count: 0, pct: 0 },
    ],
    reviews: [
      {
        id: 1, name: "Rüya A.", avatar: "R", rating: 5, date: "13 Mart 2026",
        title: "Turuncu hem rengi hem enerjisi harika",
        body: "Eclipse Desire güneşi şişeye sıkıştırmış gibi. Mandalina ve zencefil notalı bu koku bana çok enerji veriyor.",
        helpful: 17,
        images: ["/products/Secret_Romantıc_1_görsel_PNG.png"],
      },
      {
        id: 2, name: "Sibel M.", avatar: "S", rating: 5, date: "7 Mart 2026",
        title: "Baharlık en iyi seçim",
        body: "Sıcak havalarda turuncu çiçekli bir koku çok yakışıyor. Sabah sprey sonrası çok ferah hissettiriyor.",
        helpful: 13,
      },
      {
        id: 3, name: "Hande Ç.", avatar: "H", rating: 4, date: "27 Şubat 2026",
        title: "Tatlı baharatlı denge süper",
        body: "Zencefil ve vanilya birbirine çok yakışıyor. Biraz farklı bir koku arıyorsanız kesinlikle deneyin.",
        helpful: 6,
      },
      {
        id: 4, name: "Özge D.", avatar: "Ö", rating: 5, date: "18 Şubat 2026",
        title: "Koleksiyonun en sıradışı kokusu",
        body: "Tropik çiçek notaları farklı bir boyut katıyor. Arkadaşlarım çok sordu, beş kişiye hediye aldım!",
        helpful: 29,
        images: ["/products/Seraphıne_2.jpg.jpeg"],
      },
    ],
    color: "#e8703a",
    gradient: "linear-gradient(135deg, #e8703a, #f5a060, #fdd0a0)",
    volume: "250ml",
    badge: null,
    images: [
      "/products/Secret_Romantıc_1_görsel_PNG.png",
      "/products/Secret_Romantıc_1_görsel_PNG.png",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },

  /* ─────────────────────────────────────────────── 6. SERAPHINE ── */
  {
    id: 6,
    slug: "seraphine",
    name: "Seraphine",
    tagline: "Tanrısal Zarafet",
    taglineEn: "Divine Elegance",
    price: 479.90,
    originalPrice: 574.90,
    description: "Bergamotun berrak tazeliği, beyaz çayın saf zarafeti ve ipeksi müskün huzur veren dinginliği. Seraphine, temiz ve zamansız bir sofistikasyonun kokusudur.",
    descriptionEn: "The crystal freshness of bergamot, pure elegance of white tea, and the serene calm of silky musk. Seraphine is the scent of clean and timeless sophistication.",
    notes: { top: "Bergamot & Limon Çiçeği", middle: "Beyaz Çay & İris", base: "Beyaz Müsk & Sedir" },
    notesEn: { top: "Bergamot & Lemon Blossom", middle: "White Tea & Iris", base: "White Musk & Cedar" },
    ingredients: "AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, GLYCERIN, PROPYLENE GLYCOL, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, CI 75130, CI 42090",
    features: [
      { icon: "leaf", text: "%100 Vegan" },
      { icon: "clock", text: "12s Kalıcılık" },
      { icon: "shield", text: "Dermatolog Onaylı" },
    ],
    rating: 4.9,
    reviewCount: 71,
    ratingBreakdown: [
      { stars: 5, count: 60, pct: 85 },
      { stars: 4, count: 8, pct: 11 },
      { stars: 3, count: 2, pct: 3 },
      { stars: 2, count: 1, pct: 1 },
      { stars: 1, count: 0, pct: 0 },
    ],
    reviews: [
      {
        id: 1, name: "Lara T.", avatar: "L", rating: 5, date: "14 Mart 2026",
        title: "Minimalist ama çarpıcı",
        body: "Seraphine şeffaf şişesiyle bile koleksiyonun en zarif ürünü. Beyaz çay ve bergamot uyumu mükemmel, ofiste de kullanılabilir.",
        helpful: 24,
        images: ["/products/Seraphıne_1_görse_png.png"],
      },
      {
        id: 2, name: "Nur Ş.", avatar: "N", rating: 5, date: "9 Mart 2026",
        title: "Zamansız bir koku",
        body: "Seraphine herhangi bir ortama yakışıyor. Ne çok yoğun ne çok hafif, tam dengede. Favorim oldu.",
        helpful: 19,
        images: ["/products/Seraphıne_2.jpg.jpeg"],
      },
      {
        id: 3, name: "Ece B.", avatar: "E", rating: 4, date: "4 Mart 2026",
        title: "Şık ve sofistike",
        body: "Koku profili çok zarif. Sabah sürünce gün boyu hafif bir iz bırakıyor. Biraz daha yoğun olsa tam puan verirdim.",
        helpful: 8,
      },
      {
        id: 4, name: "Tuğçe A.", avatar: "T", rating: 5, date: "24 Şubat 2026",
        title: "Premium kalitede bir ürün",
        body: "Fiyatını görünce tereddüt ettim ama aldıktan sonra pişman olmadım. Müşkün ipeksi kalıcılığı gerçekten premium.",
        helpful: 32,
        images: [
          "/products/Seraphıne_1_görse_png.png",
          "/products/Seraphıne_2.jpg.jpeg",
        ],
      },
      {
        id: 5, name: "Meltem K.", avatar: "M", rating: 5, date: "16 Şubat 2026",
        title: "Koleksiyonun en iyisi bence",
        body: "Altı kokuyu da aldım, Seraphine uzun süredir favori. Sedir bazı kalıcılığı uzatıyor, lüks bir his.",
        helpful: 41,
        images: ["/products/Secret_Romantıc_2_beyaz.jpg.jpeg"],
      },
    ],
    color: "#c4a878",
    gradient: "linear-gradient(135deg, #c4a878, #ddc898, #f0e6c8)",
    volume: "250ml",
    badge: "Premium",
    images: [
      "/products/Seraphıne_1_görse_png.png",
      "/products/Seraphıne_2.jpg.jpeg",
    ],
    paymentMethods: {
      creditCard: { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] },
      cashOnDelivery: { enabled: true, fee: 15 },
    },
  },
];

export const brand = {
  name: "GIRLBOSS",
  tagline: "Kokunla Hükmet",
  taglineEn: "Rule With Your Scent",
  description: "Kendine güvenen, güçlü ve zarif kadınlar için tasarlanmış lüks body mist koleksiyonu.",
  descriptionEn: "A luxury body mist collection designed for confident, powerful, and elegant women.",
};
