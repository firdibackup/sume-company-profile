import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 flex-none stroke-sume-blue",
};

export type CapabilityTag = { label: string; green?: boolean };
export type PartnerLogo = {
  name: string;
  image: string;
  imageClassName?: string;
};

export type DataCenterCapability = {
  icon: ReactNode;
  need: string;
  capability: string;
  tags: CapabilityTag[];
  logos?: PartnerLogo[];
};

// Shared (non-translated) icons and partner logos, referenced from both locales.
const icons = {
  power: (
    <svg {...iconProps}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  cooling: (
    <svg {...iconProps}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  cost: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  visibility: (
    <svg {...iconProps}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  security: (
    <svg {...iconProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  delivery: (
    <svg {...iconProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const logos = {
  power: [
    { name: "Yuchai", image: "/partner/yuchai.jpg" },
    { name: "IHI", image: "/partner/ihi.webp" },
    { name: "NIIGATA", image: "/partner/niigata.webp" },
    { name: "Weichai", image: "/partner/weichai.webp" },
    { name: "Baudouin", image: "/partner/baudouin.webp" },
  ],
  cooling: [
    { name: "Midea", image: "/partner/midea.png" },
    {
      name: "Broad",
      image: "/partner/broad.webp",
      imageClassName: "max-h-[70px]",
    },
    { name: "Hisense", image: "/partner/hisense.webp" },
  ],
  cost: [
    { name: "Powerbrain", image: "/partner/powerbrain.webp" },
    { name: "Kong Cube", image: "/partner/kong cube.png" },
    { name: "Siemens", image: "/partner/siemens.png" },
  ],
  visibility: [
    { name: "Emerson", image: "/partner/emerson.png" },
    { name: "Endress+Hauser", image: "/partner/endress-hauser.webp" },
    { name: "Ramus", image: "/partner/ramus.webp" },
  ],
  security: [
    { name: "KINGSAT", image: "/partner/kingsat.webp" },
    { name: "Ramus", image: "/partner/ramus.webp" },
  ],
};

/** Data-center need → SUME capability mapping rows. */
export const dataCenterCapabilities: Record<Locale, DataCenterCapability[]> = {
  en: [
    {
      icon: icons.power,
      need: "Uninterrupted Backup Power",
      capability:
        "Standby gensets, fuel monitoring, engine maintenance — sized and serviced for 24/7 critical load.",
      tags: [{ label: "Power & Energy" }, { label: "Yuchai · IHI / Niigata" }],
      logos: logos.power,
    },
    {
      icon: icons.cooling,
      need: "High-Density Cooling",
      capability:
        "Precision HVAC, chiller plants, and efficiency optimization — engineered for continuous high-density thermal loads.",
      tags: [
        { label: "Precision Cooling" },
        { label: "Midea · Broad · Hisense" },
      ],
      logos: logos.cooling,
    },
    {
      icon: icons.cost,
      need: "Energy Cost Control and BMS",
      capability:
        "Cooling-as-a-Service (zero CAPEX, performance-guaranteed), solar PV, and chiller retrofits that measurably reduce operational spend.",
      tags: [
        { label: "Cooling-as-a-Service" },
        // { label: "Solar PV · 50+ MWp", green: true },
      ],
      logos: logos.cost,
    },
    {
      icon: icons.visibility,
      need: "Operational Visibility",
      capability:
        "Flow metering, fuel monitoring, and smart control — integrated into a centralized operational view.",
      tags: [
        { label: "Monitoring" },
        { label: "Emerson · Endress+Hauser · Ramus" },
      ],
      logos: logos.visibility,
    },
    {
      icon: icons.security,
      need: "Physical Security",
      capability:
        "CCTV and surveillance integration via Ramus and KINGSAT — protecting physical access to critical infrastructure.",
      tags: [{ label: "Monitoring & Security" }, { label: "KINGSAT · Ramus" }],
      logos: logos.security,
    },
    {
      icon: icons.delivery,
      need: "Single Accountable Delivery",
      capability:
        "Integrated M&E contracting — one partner across design, procurement, installation, commissioning, and maintenance.",
      tags: [{ label: "Integrated M&E" }],
    },
  ],
  id: [
    {
      icon: icons.power,
      need: "Backup Power Tanpa Henti",
      capability:
        "Genset standby, fuel monitoring, pemeliharaan mesin — disesuaikan dan dilayani untuk beban kritis 24/7.",
      tags: [
        { label: "Kelistrikan & Energi" },
        { label: "Yuchai · IHI / Niigata" },
      ],
      logos: logos.power,
    },
    {
      icon: icons.cooling,
      need: "Pendinginan Berdensitas Tinggi",
      capability:
        "HVAC presisi, chiller plant, dan optimisasi efisiensi — direkayasa untuk beban termal berdensitas tinggi secara terus-menerus.",
      tags: [
        { label: "Precision Cooling" },
        { label: "Midea · Broad · Hisense" },
      ],
      logos: logos.cooling,
    },
    {
      icon: icons.cost,
      need: "Pengendalian Biaya Energi dan BMS",
      capability:
        "Cooling-as-a-Service (tanpa CAPEX, bergaransi performa), solar PV, dan retrofit chiller yang menurunkan biaya operasional secara terukur.",
      tags: [
        { label: "Cooling-as-a-Service" },
        // { label: "Solar PV · 50+ MWp", green: true },
      ],
      logos: logos.cost,
    },
    {
      icon: icons.visibility,
      need: "Visibilitas Operasional",
      capability:
        "Flow metering, fuel monitoring, dan smart control — terintegrasi dalam tampilan operasional terpusat.",
      tags: [
        { label: "Monitoring" },
        { label: "Emerson · Endress+Hauser · Ramus" },
      ],
      logos: logos.visibility,
    },
    {
      icon: icons.security,
      need: "Keamanan Fisik",
      capability:
        "Integrasi CCTV dan surveillance melalui Ramus dan KINGSAT — melindungi akses fisik ke infrastruktur kritis.",
      tags: [{ label: "Monitoring & Keamanan" }, { label: "KINGSAT · Ramus" }],
      logos: logos.security,
    },
    {
      icon: icons.delivery,
      need: "Pengerjaan Satu Tanggung Jawab",
      capability:
        "Kontrak M&E terintegrasi — satu mitra untuk desain, pengadaan, instalasi, commissioning, dan pemeliharaan.",
      tags: [{ label: "M&E Terintegrasi" }],
    },
  ],
};

export type WhyItMattersItem = {
  num: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
};

export const whyItMatters: Record<Locale, WhyItMattersItem[]> = {
  en: [
    {
      num: "01",
      title: "Cooling is the Largest Operational Cost",
      body: "Cooling systems typically account for 40–60% of a data center's electricity. Every percentage point of efficiency improvement translates directly to operational spend.",
      stat: "40–60%",
      statLabel: "of facility electricity",
    },
    {
      num: "02",
      title: "Power Reliability is Non-Negotiable",
      body: "Backup power and fuel reliability underpin every uptime SLA. Engine maintenance, fuel monitoring, and genset sizing must be engineered — not assumed.",
      stat: "24/7",
      statLabel: "no tolerance for downtime",
    },
    {
      num: "03",
      title: "One Partner Reduces Coordination Risk",
      body: "A single accountable M&E partner eliminates the coordination gaps between specialist subcontractors — reducing risk across every critical system.",
      stat: "1",
      statLabel: "accountable partner",
    },
  ],
  id: [
    {
      num: "01",
      title: "Pendinginan Adalah Biaya Operasional Terbesar",
      body: "Sistem pendinginan umumnya menyumbang 40–60% listrik data center. Setiap satu poin persen peningkatan efisiensi langsung berdampak pada biaya operasional.",
      stat: "40–60%",
      statLabel: "dari listrik fasilitas",
    },
    {
      num: "02",
      title: "Keandalan Daya Tidak Bisa Ditawar",
      body: "Backup power dan keandalan bahan bakar menopang setiap SLA uptime. Pemeliharaan mesin, fuel monitoring, dan sizing genset harus direkayasa — bukan diasumsikan.",
      stat: "24/7",
      statLabel: "tanpa toleransi downtime",
    },
    {
      num: "03",
      title: "Satu Mitra Mengurangi Risiko Koordinasi",
      body: "Satu mitra M&E yang bertanggung jawab penuh menghilangkan celah koordinasi antar subkontraktor spesialis — mengurangi risiko di setiap sistem kritis.",
      stat: "1",
      statLabel: "mitra bertanggung jawab",
    },
  ],
};

export type DataCenterScopeItem = {
  num: string;
  title: string;
  body: string;
  anchor: string;
};

export const dataCenterScope: Record<Locale, DataCenterScopeItem[]> = {
  en: [
    {
      num: "01",
      title: "Power & Energy",
      body: "Standby generation, fuel monitoring, solar PV, and authorized engine maintenance.",
      anchor: "power",
    },
    {
      num: "02",
      title: "Precision Cooling",
      body: "Chiller plants, VRF, optimization, and Cooling-as-a-Service for high-density loads.",
      anchor: "cooling",
    },
    {
      num: "03",
      title: "Monitoring & Security",
      body: "Flow metering, fuel monitoring, CCTV, and smart control — integrated visibility.",
      anchor: "monitoring",
    },
    {
      num: "04",
      title: "Integrated M&E",
      body: "Design, procurement, installation, commissioning, and lifetime maintenance under one scope.",
      anchor: "integrated",
    },
  ],
  id: [
    {
      num: "01",
      title: "Kelistrikan & Energi",
      body: "Pembangkitan standby, fuel monitoring, solar PV, dan pemeliharaan mesin resmi.",
      anchor: "power",
    },
    {
      num: "02",
      title: "Precision Cooling",
      body: "Chiller plant, VRF, optimisasi, dan Cooling-as-a-Service untuk beban berdensitas tinggi.",
      anchor: "cooling",
    },
    {
      num: "03",
      title: "Monitoring & Keamanan",
      body: "Flow metering, fuel monitoring, CCTV, dan smart control — visibilitas terintegrasi.",
      anchor: "monitoring",
    },
    {
      num: "04",
      title: "M&E Terintegrasi",
      body: "Desain, pengadaan, instalasi, commissioning, dan pemeliharaan seumur pakai dalam satu lingkup.",
      anchor: "integrated",
    },
  ],
};
