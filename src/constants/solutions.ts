export type SolutionPillarMeta = {
  id: string;
  image: string;
  flip?: boolean;
};

export const solutionPillars: SolutionPillarMeta[] = [
  { id: "power", image: "/images/home/solution-1.png" },
  { id: "cooling", image: "/images/home/solution-2.png", flip: true },
  { id: "monitoring", image: "/images/home/solution-3.png" },
];

// Partner brand logos — proper names, not translated.
export const partnerBrands = [
  // { name: "Ramoco", image: "/partner/ramoco.webp" },
  { name: "Midea", image: "/partner/midea.png" },
  {
    name: "Yuchai",
    image: "/partner/yuchai.jpg",
    className: "p-2 scale-[1.15]",
  },
  { name: "Baudouin", image: "/partner/baudouin.webp" },
  { name: "Weichai", image: "/partner/weichai.webp" },
  { name: "Broad", image: "/partner/broad.webp" },
  { name: "Hisense", image: "/partner/hisense.webp" },
  {
    name: "Emerson",
    image: "/partner/emerson.png",
    className: "p-3 scale-[1.1]",
  },
  { name: "Endress+Hauser", image: "/partner/endress-hauser.webp" },
  { name: "KINGSAT", image: "/partner/kingsat.webp" },
  { name: "IHI", image: "/partner/ihi.webp" },
  { name: "Niigata", image: "/partner/niigata.webp" },
  { name: "Ramus", image: "/partner/ramus.webp" },
  { name: "Powerbrain", image: "/partner/powerbrain.webp" },
  { name: "+ more" },
];
