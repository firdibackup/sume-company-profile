import Image from "next/image";
import { useTranslations } from "next-intl";
import { partnerBrands } from "@/constants/solutions";

function brandInitials(name: string) {
  if (name === "+ more") return "…";
  return name
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

/** "Capabilities & Brands" logo grid — shared by the home and solutions pages. */
export function PartnerBrands() {
  const t = useTranslations("SolutionsPage");

  return (
    <section className="relative overflow-hidden bg-sume-navy py-26">
      <div className="sume-wrap">
        <h2 className="sume-eyebrow mb-4 block text-[#7fb4ff]">
          {t("brandsEyebrow")}
        </h2>
        <span className="max-w-[20ch] block font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          {t("brandsHeading")}
        </span>
        <p className="mb-13 mt-3.5 max-w-[48ch] text-[17px] leading-[1.55] text-white/[0.68]">
          {t("brandsBody")}
        </p>
  
        <div className="grid grid-cols-2 gap-px border border-white/[0.12] bg-white/[0.12] sm:grid-cols-3 lg:grid-cols-6">
          {partnerBrands.map((brand) => (
            <div
              key={brand.name}
              className="group relative flex aspect-[3/2] flex-col items-center justify-center gap-2.5 bg-white p-4 transition hover:bg-gray-50"
            >
              {brand.image ? (
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className={`object-contain mix-blend-multiply opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100 ${
                    "className" in brand && brand.className
                      ? brand.className
                      : "p-6"
                  }`}
                />
              ) : (
                <>
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[3px] border-[1.5px] border-dashed border-sume-navy/20 font-head text-[18px] font-semibold text-sume-navy/40 transition group-hover:border-sume-navy/40 group-hover:text-sume-navy/60">
                    {brandInitials(brand.name)}
                  </div>
                  <div className="text-center font-head text-[13px] font-medium tracking-[0.02em] text-sume-navy/70 transition group-hover:text-sume-navy">
                    {brand.name}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
