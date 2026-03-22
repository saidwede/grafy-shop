"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 pt-42 pb-0 md:px-8 lg:px-12">
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
                        {t('nav_about')}
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        {t('about_page_subtitle')}
                    </p>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative w-full">
                <div className="py-8 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] gap-8 lg:gap-16">
                        <div className="flex flex-col justify-center items-start py-20 lg:py-16">
                            <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tighter leading-[1.05]">
                                {t('about_hero_title')}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
                                {t('about_hero_subtitle')}
                            </p>
                            <button className="bg-black text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                                {t('about_hero_cta')}
                            </button>
                        </div>
                        <div className="flex items-center justify-center py-8 lg:py-16">
                            {/* Right side image placeholder - using an existing promotional image */}
                            <img 
                                src="/images/promo-custom-merch.png" 
                                alt="About Hero" 
                                className="w-[80%] rounded-2xl max-w-[280px] md:max-w-[350px] lg:max-w-[400px] object-contain" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Promises Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 bg-white">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-black tracking-tight">
                        {t('about_promises_title')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 md:items-start">
                    {/* Col 1: Fidelity */}
                    <div className="flex flex-col">
                        <div className="relative aspect-square w-full rounded-[30px] overflow-hidden shadow-xl border border-black/5 bg-gray-100 mb-8">
                            <img src="/images/fidelity_design.png" alt="Fidelity to Design" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-black text-black uppercase tracking-tight mb-4 min-h-[3.5rem]">
                            {t('about_promises_1_title')}
                        </h3>
                        <p className="text-sm md:text-base text-black/80 font-medium leading-relaxed">
                            {t('about_promises_1_desc')}
                        </p>
                    </div>

                    {/* Col 2: Quality */}
                    <div className="flex flex-col">
                        <div className="relative aspect-square w-full rounded-[30px] overflow-hidden shadow-xl border border-black/5 bg-gray-100 mb-8">
                            <img src="/images/uncompromising_quality.png" alt="Uncompromising Quality" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-black text-black uppercase tracking-tight mb-4 min-h-[3.5rem]">
                            {t('about_promises_2_title')}
                        </h3>
                        <p className="text-sm md:text-base text-black/80 font-medium leading-relaxed">
                            {t('about_promises_2_desc')}
                        </p>
                    </div>

                    {/* Col 3: Speed */}
                    <div className="flex flex-col">
                        <div className="relative aspect-square w-full rounded-[30px] overflow-hidden shadow-xl border border-black/5 bg-gray-100 mb-8">
                            <img src="/images/lightning_speed.png" alt="Lightning Speed" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-black text-black uppercase tracking-tight mb-4 min-h-[3.5rem]">
                            {t('about_promises_3_title')}
                        </h3>
                        <p className="text-sm md:text-base text-black/80 font-medium leading-relaxed">
                            {t('about_promises_3_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Numbers Section */}
            <section className="py-24 bg-gray-50 border-t border-black/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 items-end">
                        
                        {/* Col 1 */}
                        <div className="flex flex-col justify-end h-full mt-10 lg:mt-0">
                            <h2 className="text-3xl lg:text-4xl font-black text-black mb-8 leading-tight tracking-tighter">
                                {t('about_numbers_title')}
                            </h2>
                            <div className="w-full h-px bg-black mb-6" />
                            <div className="text-5xl lg:text-6xl font-black text-black mb-3 tracking-tighter">{t('about_numbers_qty1')}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide h-10">{t('about_numbers_lbl1')}</div>
                        </div>

                        {/* Col 2 */}
                        <div className="flex flex-col justify-end h-full">
                            <div className="w-full h-px bg-black mb-6" />
                            <div className="text-5xl lg:text-6xl font-black text-black mb-3 tracking-tighter">{t('about_numbers_qty2')}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide h-10">{t('about_numbers_lbl2')}</div>
                        </div>

                        {/* Col 3 */}
                        <div className="flex flex-col justify-end h-full">
                            <div className="w-full h-px bg-black mb-6" />
                            <div className="text-5xl lg:text-6xl font-black text-black mb-3 tracking-tighter">{t('about_numbers_qty3')}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide h-10">{t('about_numbers_lbl3')}</div>
                        </div>

                        {/* Col 4 */}
                        <div className="flex flex-col justify-end h-full mt-16 md:mt-0 relative">
                            {/* Graphic placeholder */}
                            <div className="w-full flex justify-end mb-8 md:mb-12 relative">
                                <div className="bg-white rounded-full p-4 shadow-sm border border-gray-100 rotate-12">
                                    <Globe size={48} className="text-black" strokeWidth={1} />
                                    <div className="absolute -top-4 -left-2 bg-black text-white rounded-full p-2 -rotate-12 shadow-lg">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-black mb-6" />
                            <div className="text-5xl lg:text-6xl font-black text-black mb-3 tracking-tighter">{t('about_numbers_qty4')}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide h-10">{t('about_numbers_lbl4')}</div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Print Partners Section */}
            <section className="py-24 bg-white border-t border-black/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-black text-black tracking-tight">
                                {t('about_partners_title')}
                            </h2>
                            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                                <p>{t('about_partners_desc1')}</p>
                                <p>{t('about_partners_desc2')}</p>
                            </div>
                            <div className="pt-2">
                                <Link 
                                    href="/contact" 
                                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white hover:bg-black/90 rounded-full font-bold transition-all text-lg shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {t('about_partners_cta')}
                                </Link>
                            </div>
                        </div>
                        <div className="relative aspect-4/3 lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-gray-100">
                            <img 
                                src="/images/print_partner2.png" 
                                alt="Print Partner" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
