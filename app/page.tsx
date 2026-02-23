"use client";

import CategoryCard from "../components/CategoryCard";
import PromoBanner from "../components/PromoBanner";
import Hero from "../components/Hero";
import Steps from "../components/Steps";
import NewArrivals from "../components/NewArrivals";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const CATEGORIES = [
    { title: t('cat_t_shirts'), image: "/images/categories/t-shirts.png" },
    { title: t('cat_sweatshirts'), image: "/images/categories/sweatshirts.png" },
    { title: t('cat_hats'), image: "/images/categories/hats.png" },
    { title: t('cat_jackets_vests'), image: "/images/categories/jackets-vests.png" },
    { title: t('cat_bags'), image: "/images/categories/bags.png" },
    { title: t('cat_drinkware'), image: "/images/categories/drinkware.png" },
    { title: t('cat_polos'), image: "/images/categories/polos-business-wear.png" },
    { title: t('cat_workwear'), image: "/images/categories/workwear-uniforms.png" },
    { title: t('cat_office'), image: "/images/categories/office-supplies.png" },
    { title: t('cat_tech'), image: "/images/categories/technology.png" },
    { title: t('cat_signage'), image: "/images/categories/trade-show-signage.png" },
    { title: t('cat_activewear'), image: "/images/categories/activewear.png" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12">
      <Hero />

      <div id="categories" className="text-center mb-12 scroll-mt-32">

        <h2 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tighter">
          {t('cat_section_title')}
        </h2>
        <div className="w-16 h-1 bg-black mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-20">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            imageSrc={category.image}
          />
        ))}
      </div>

      <Steps />

      <NewArrivals />

      <PromoBanner />
    </main>
  );
}
