"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function PromoBanner() {
    const { locale, t } = useLanguage();

    return (
        <section className="relative w-full bg-[#F8F8F8] rounded-3xl overflow-hidden my-16 flex flex-col md:flex-row items-center min-h-[400px] border border-black/5">
            {/* Background Decorative Elements - Replaced with grayscale */}
            <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[500px] h-[500px] bg-black/2 rounded-full blur-3xl opacity-50" />
            <div className="absolute top-[60%] left-[80%] -translate-y-1/2 w-[300px] h-[300px] bg-black/3 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 flex-1 p-8 md:p-16 flex flex-col justify-center gap-6">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight block md:hidden">
                    {t('hero_title')}
                </h2>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight hidden md:block">
                    {locale === 'en' ? (
                        <>Bring Your Brand<br />To Every Surface</>
                    ) : (
                        <>Donnez vie à votre marque<br />sur tous supports</>
                    )}
                </h2>

                <p className="text-gray-500 text-lg max-w-md">
                    {t('hero_subtitle')}
                </p>
                <div>
                    <button className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        {t('hero_cta')}
                    </button>
                </div>
            </div>

            <div className="relative z-10 flex-1 w-full h-[300px] md:h-full min-h-[400px]">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full h-full transform md:translate-x-12 md:-translate-y-8">
                        <Image
                            src="/images/promo-custom-merch.png"
                            alt="Custom Branded Apparel"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
