// app/data/constants.ts

export const ANNOUNCEMENTS = [
  "ROHS|REACH|SVHC|CE COMPLIANT",
  "INDIA'S NEXT GEN MOBILE ACCESSORY BRAND",
  "5% EXTRA OFF ON PREPAID ORDERS|COD CHARGES RS 30 EXTRA UPTO RS 2000",
  "FREE DELIVERY FOR ORDERS OVER RS 1000| SHIPPING PARTNERS - BLUEDART, EKART, DELHIVERY"
];

export const DEVICE_MENU = [
  {
    category: "IPHONE",
    img: "/images/iphone-placeholder.png", 
    items: ["iPhone 15 Series", "iPhone 14 Series", "iPhone 13 Series", "iPhone 12 Series", "iPhone 11 Series", "iPhone SE 2022"],
  },
  {
    category: "SAMSUNG",
    img: "/images/samsung-placeholder.png",
    items: ["Galaxy S24 Ultra", "Galaxy S23 Series", "Galaxy S21 FE", "Z Fold Series", "Z Flip Series"],
  },
  {
    category: "ONEPLUS/NOTHING",
    img: "/images/oneplus-placeholder.png",
    items: ["Nothing Phone 2", "OnePlus 11", "OnePlus 11R", "OnePlus Nord Series"],
  },
  {
    category: "GOOGLE PIXEL",
    img: "/images/pixel-placeholder.png",
    items: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Series", "Pixel 6a"],
  },
];

export const CATEGORY_MENU = [
  {
    title: "FORT SERIES",
    img: "/images/fort-series.png",
    items: ["Galaxy S24 Series", "Galaxy S23 Series", "Apple iPhone 14"],
  },
  {
    title: "FUSION SERIES",
    img: "/images/fusion-series.png",
    items: ["Galaxy S24 Ultra", "Galaxy S23 Ultra", "iPhone 15 Pro Max"],
  },
  {
    title: "VOLT SERIES",
    img: "/images/volt-series.png", 
    items: ["GaN Chargers 65W", "Type-C Cables", "USB Cables"],
  },
  {
    title: "STRAPORA SERIES",
    img: "/images/strapora.png", 
    items: ["Apple Watch Ultra 2", "Samsung Watch 6", "Apple Watch Series 9"],
  },
  {
    title: "SHIELD SERIES",
    img: "/images/shield.png", 
    items: ["iPhone", "Google Pixel", "OnePlus", "Samsung"],
  },
];


export const FOOTER_LINKS = {
  shop: [
    { name: "Shop by Device", href: "#" },
    { name: "Shop by Category", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
  ],
  support: [
    { name: "Track Your Order", href: "#" },
    { name: "Warranty & Returns", href: "/warranty" },
    { name: "Shipping Policy", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Partner With Us", href: "/partner" },
    { name: "Corporate Orders", href: "#" },
    { name: "Contact Us", href: "#" },
  ]
};

export const HERO_SLIDES = [
  // SLIDE 1: Premium Phone
  {
    id: 1,
    type: 'standard',
    title: "iPhone 15 Pro Max",
    subtitle: "Titanium design. A17 Pro chip. The most powerful iPhone ever.",
    // Use a dark placeholder image so white text pops
    img: "https://placehold.co/1920x800/1a1a1a/FFFFFF/png?text=iPhone+15+Pro+Max+Banner", 
  },
  // SLIDE 2: Premium Phone
  {
    id: 2,
    type: 'standard',
    title: "Samsung Galaxy S24 Ultra",
    subtitle: "Galaxy AI is here. Welcome to the era of mobile AI.",
    img: "https://placehold.co/1920x800/111827/FFFFFF/png?text=Samsung+S24+Ultra+Banner",
  },
  // SLIDE 3: Premium Phone
  {
    id: 3,
    type: 'standard',
    title: "OnePlus 12",
    subtitle: "Smooth beyond belief. Powered by Trinity Engine.",
    img: "https://placehold.co/1920x800/0047AB/FFFFFF/png?text=OnePlus+12+Banner",
  },
  // SLIDE 4: Accessories
  {
    id: 4,
    type: 'standard',
    title: "Premium MagSafe Accessories",
    subtitle: "Snap on a case, wallet, or charger. Effortless connection.",
    img: "https://placehold.co/1920x800/2CA089/FFFFFF/png?text=MagSafe+Accessories+Banner",
  },
  // SLIDE 5: The Original Text Layout Marker
  {
    id: 5,
    type: 'custom-text-layout',
    title: "", subtitle: "", img: "" // Data not needed here, structure defined in component
  },
];

export const PRODUCTS = [
  // --- MOBILES (First 10 items) ---
  { id: 1, name: "iPhone 15 Pro Max", brand: "apple", category: "mobiles", price: 159900, rating: 4.8, reviews: 340, image: "https://placehold.co/400x400/1a1a1a/FFFFFF/png?text=iPhone+15+Pro+Max", inStock: true },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "samsung", category: "mobiles", price: 129999, rating: 4.7, reviews: 210, image: "https://placehold.co/400x400/111827/FFFFFF/png?text=S24+Ultra", inStock: true },
  { id: 3, name: "OnePlus 12", brand: "oneplus", category: "mobiles", price: 69999, rating: 4.6, reviews: 150, image: "https://placehold.co/400x400/0047AB/FFFFFF/png?text=OnePlus+12", inStock: true },
  { id: 4, name: "Pixel 8 Pro", brand: "google", category: "mobiles", price: 99999, rating: 4.5, reviews: 89, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=Pixel+8+Pro", inStock: true },
  { id: 5, name: "iPhone 15", brand: "apple", category: "mobiles", price: 79900, rating: 4.8, reviews: 520, image: "https://placehold.co/400x400/1a1a1a/FFFFFF/png?text=iPhone+15", inStock: true },
  { id: 6, name: "Samsung Galaxy Z Flip 5", brand: "samsung", category: "mobiles", price: 99999, rating: 4.4, reviews: 120, image: "https://placehold.co/400x400/111827/FFFFFF/png?text=Z+Flip+5", inStock: true },
  { id: 7, name: "Nothing Phone (2)", brand: "nothing", category: "mobiles", price: 39999, rating: 4.3, reviews: 200, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=Nothing+Phone+2", inStock: true },
  { id: 8, name: "Xiaomi 14", brand: "xiaomi", category: "mobiles", price: 69999, rating: 4.5, reviews: 95, image: "https://placehold.co/400x400/FF6900/FFFFFF/png?text=Xiaomi+14", inStock: true },
  { id: 9, name: "iQOO 12", brand: "iqoo", category: "mobiles", price: 52999, rating: 4.6, reviews: 80, image: "https://placehold.co/400x400/000000/FFFFFF/png?text=iQOO+12", inStock: true },
  { id: 10, name: "Realme GT 5", brand: "realme", category: "mobiles", price: 34999, rating: 4.2, reviews: 60, image: "https://placehold.co/400x400/FFCC00/000000/png?text=Realme+GT+5", inStock: true },

  // --- ACCESSORIES ---
  { id: 11, name: "Ultra Slim Case for iPhone 15", brand: "apple", category: "cases", price: 499, rating: 4.5, reviews: 120, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=iPhone+Case", inStock: true },
  { id: 12, name: "Tempered Glass for Galaxy S24", brand: "samsung", category: "screen-guards", price: 299, rating: 4.2, reviews: 85, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=S24+Glass", inStock: true },
  { id: 13, name: "MagSafe Wallet - Midnight", brand: "apple", category: "accessories", price: 1299, rating: 4.8, reviews: 200, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=MagSafe+Wallet", inStock: true },
  { id: 14, name: "30W USB-C Fast Charger", brand: "all", category: "chargers", price: 999, rating: 4.9, reviews: 310, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=30W+Charger", inStock: true },
  { id: 15, name: "Galaxy Z Flip 5 Clear Case", brand: "samsung", category: "cases", price: 599, rating: 4.3, reviews: 60, image: "https://placehold.co/400x400/F5F5F7/111827/png?text=Flip+5+Case", inStock: true },
]; 