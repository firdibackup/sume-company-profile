import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export type NavChild = { label: string; href: string };

export type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
  /** Horizontal alignment of the dropdown panel relative to its trigger. */
  menuAlign?: "left" | "right";
};

export const navLinks: Record<Locale, NavLink[]> = {
  en: [
    { label: "Home", href: "/" },
    {
      label: "Solutions",
      href: "/solutions",
      children: [
        { label: "Power & Energy", href: "/solutions#power" },
        { label: "Precision Cooling", href: "/solutions#cooling" },
        { label: "Monitoring & Security", href: "/solutions#monitoring" },
        { label: "Integrated M&E", href: "/solutions#integrated" },
      ],
    },
    { label: "Data Center", href: "/data-center" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/our-project" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    // {
    //   label: "Contact",
    //   href: "/contact",
    //   menuAlign: "right",
    //   children: [
    //     { label: "Contact Us", href: "/contact" },
    //     { label: "Regional Presence", href: "/regional" },
    //   ],
    // },
  ],
  id: [
    { label: "Beranda", href: "/" },
    {
      label: "Solusi",
      href: "/solutions",
      children: [
        { label: "Kelistrikan & Energi", href: "/solutions#power" },
        { label: "Precision Cooling", href: "/solutions#cooling" },
        { label: "Monitoring & Keamanan", href: "/solutions#monitoring" },
        { label: "Integrated M&E", href: "/solutions#integrated" },
      ],
    },
    { label: "Data Center", href: "/data-center" },
    { label: "Tentang", href: "/about" },
    { label: "Proyek", href: "/our-project" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/contact" },
    // {
    //   label: "Kontak",
    //   href: "/contact",
    //   menuAlign: "right",
    //   children: [
    //     { label: "Hubungi Kami", href: "/contact" },
    //     { label: "Kehadiran Regional", href: "/regional" },
    //   ],
    // },
  ],
};

/** Canonical production URL — used for SEO metadata, sitemap, and robots. */
export const siteUrl = "https://www.sumeid.com";

export const company = {
  name: "PT. Solusi Utama Mekanikal Elektrikal",
  brand: "SUME Group",
  // shortName: "PT. SUME",
  tagline: "Modern Buildings Solution is Our Focus",
  description:
    "PT. Solusi Utama Mekanikal Elektrikal (SUME) provides integrated mechanical and electrical solutions with innovation, quality, and reliability.",
  address: "Jl. Cideng Timur No. 59, Central Jakarta",
  phone: "+62813-8880-1886",
  email: "projects@sumeid.com",
  whatsapp: "https://wa.me/6281388801886",
};

/* ============ Home (SUME Group enterprise redesign) ============ */

// Home hero — slide copy (label/title/subtitle) is CMS-managed under the `Hero`
// namespace; only the slide number and background image stay in code.
export const heroSlides = [
  {
    num: "01",
    image: "/images/home/hiro-1.png",
    labelKey: "slide1Label",
    titleKey: "slide1Title",
    subtitleKey: "slide1Subtitle",
  },
  {
    num: "02",
    image: "/images/home/hiro-2.png",
    labelKey: "slide2Label",
    titleKey: "slide2Title",
    subtitleKey: "slide2Subtitle",
  },
  {
    num: "03",
    image: "/images/home/hiro-5.png",
    labelKey: "slide3Label",
    titleKey: "slide3Title",
    subtitleKey: "slide3Subtitle",
  },
  {
    num: "04",
    image: "/images/home/city-building.png",
    labelKey: "slide4Label",
    titleKey: "slide4Title",
    subtitleKey: "slide4Subtitle",
  },
] as const;

// Trust bar — figures kept as placeholders pending verification before launch
// (spec §1.2). Value + label text is CMS-managed under `Home`; `placeholder`
// greys the unverified figure and `suffix` is appended after the value.
export const trustStats = [
  {
    valueKey: "stat1Value",
    labelKey: "stat1Label",
    suffix: "",
    placeholder: true,
  },
  {
    valueKey: "stat2Value",
    labelKey: "stat2Label",
    suffix: "+",
    placeholder: true,
  },
  {
    valueKey: "stat3Value",
    labelKey: "stat3Label",
    suffix: "",
    placeholder: false,
  },
  {
    valueKey: "stat4Value",
    labelKey: "stat4Label",
    suffix: "",
    placeholder: true,
  },
] as const;

// Solutions overview — title/description CMS-managed under `Home`; structural
// fields (num/anchor/image) stay in code. Shared by the home section + footer.
export const solutionsOverview = [
  {
    num: "01",
    anchor: "power",
    image: "/images/home/solution-1.png",
    titleKey: "solution1Title",
    descriptionKey: "solution1Description",
  },
  {
    num: "02",
    anchor: "cooling",
    image: "/images/home/solution-2.png",
    titleKey: "solution2Title",
    descriptionKey: "solution2Description",
  },
  {
    num: "03",
    anchor: "monitoring",
    image: "/images/home/solution-3.png",
    titleKey: "solution3Title",
    descriptionKey: "solution3Description",
  },
  {
    num: "04",
    anchor: "integrated",
    image: "/images/home/solution-4.png",
    titleKey: "solution4Title",
    descriptionKey: "solution4Description",
  },
] as const;

// Why SUME — title/description CMS-managed under `Home`; `placeholderPrefix` is
// an unverified figure rendered greyed before the description (item 1 only).
export const whySume = [
  {
    num: "01",
    placeholderPrefix: "185",
    titleKey: "why1Title",
    descriptionKey: "why1Description",
  },
  {
    num: "02",
    placeholderPrefix: "",
    titleKey: "why2Title",
    descriptionKey: "why2Description",
  },
  {
    num: "03",
    placeholderPrefix: "",
    titleKey: "why3Title",
    descriptionKey: "why3Description",
  },
  {
    num: "04",
    placeholderPrefix: "",
    titleKey: "why4Title",
    descriptionKey: "why4Description",
  },
] as const;

// Trusted-by marquee — real logos from trusted-logo directory (brand names, not translated)
export const trustedLogos = [
  { name: "ASDP", image: "/trusted-logo/asdp-logo.webp" },
  { name: "Asset 65", image: "/trusted-logo/asset-65.webp" },
  { name: "Astra", image: "/trusted-logo/astra.webp" },
  { name: "Badak LNG", image: "/trusted-logo/badak-lng.webp" },
  { name: "BBC", image: "/trusted-logo/bbc.webp" },
  { name: "Econnection Space", image: "/trusted-logo/econnection-space.webp" },
  { name: "Hisense", image: "/trusted-logo/hisense.webp" },
  { name: "Mega Utama", image: "/trusted-logo/mega-utama.webp" },
  { name: "Jowell", image: "/trusted-logo/jowell.webp" },
  { name: "Kompas Gramedia", image: "/trusted-logo/kompas-gramedia.webp" },
  { name: "Linvol", image: "/trusted-logo/linvol.webp" },
  { name: "PLN", image: "/trusted-logo/logo-pln.webp" },
  { name: "Mega Bekasi", image: "/trusted-logo/mega-bekasi.webp" },
  { name: "Midea", image: "/trusted-logo/midea.webp" },
  { name: "Pertamina", image: "/trusted-logo/pertamina.webp" },
  { name: "Remax", image: "/trusted-logo/remax.webp" },
  { name: "Santika", image: "/trusted-logo/santika.webp" },
  { name: "Vistra", image: "/trusted-logo/vistra.webp" },
  { name: "Megacity", image: "/trusted-logo/megacity.webp" },
  { name: "Wijaya Karya", image: "/trusted-logo/wijaya-karya.webp" },
  { name: "Yonex", image: "/trusted-logo/yonex.webp" },
];

export const footerOffices: Record<Locale, string[]> = {
  en: ["Indonesia (HQ)"],
  id: ["Indonesia (HQ)"],
};

type ContactItem = { icon: typeof MapPin; label: string; value: string };

// Contact section — heading/body are CMS-managed under `Home`; the contact rows
// stay in code (values sourced from `company`).
export const contactItems: Record<Locale, ContactItem[]> = {
  en: [
    { icon: MapPin, label: "Office", value: company.address },
    { icon: Phone, label: "Phone", value: company.phone },
    { icon: Mail, label: "Email", value: company.email },
  ],
  id: [
    { icon: MapPin, label: "Kantor", value: company.address },
    { icon: Phone, label: "Telepon", value: company.phone },
    { icon: Mail, label: "Email", value: company.email },
  ],
};

// FALSBACK CONTENT — to be removed before launch, pending verification of figures (spec §1.2)

export type Project = {
  title: string;
  category: string;
  location: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Central Business Plaza",
    category: "Commercial",
    location: "Jakarta",
    image: "/images/projects/project-1.png",
  },
  {
    title: "Techno Logistic Hub",
    category: "Industrial",
    location: "Bekasi",
    image: "/images/projects/project-2.png",
  },
  {
    title: "Santika Hospitality Upgrade",
    category: "Hospitality",
    location: "Bandung",
    image: "/images/projects/project-3.png",
  },
  {
    title: "Public Service Facility",
    category: "Government",
    location: "Central Jakarta",
  },
  {
    title: "Retail Experience Center",
    category: "Retail",
    location: "Tangerang",
  },
  {
    title: "Data Support Room",
    category: "Technology",
    location: "South Jakarta",
  },
];
