"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PromoBanner() {
    const { locale, t } = useLanguage();

    return (
        <section className="w-full overflow-hidden my-16 flex flex-col md:flex-row items-center min-h-[400px]">
            <div className="z-10 flex-1 p-8 md:p-16 flex flex-col justify-center gap-6">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight block md:hidden">
                    {t('hero_title')}
                </h2>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight hidden md:block">
                    {locale === 'en' ? (
                        <>Bring Your Brand To Every Surface</>
                    ) : (
                        <>Donnez vie à votre marque sur tous supports</>
                    )}
                </h2>

                <p className="text-gray-500 text-lg max-w-md">
                    {t('hero_subtitle')}
                </p>
                <div>
                    <Link
                        href="/shop"
                        className="px-8 py-3 bg-black border border-gray-200 rounded-full text-white font-medium transition-colors inline-block"
                    >
                        {t('hero_cta')}
                    </Link>
                </div>
            </div>
            <div className="w-full h-full rounded-2xl flex-1 flex items-center justify-center">
                <img
                    src="/images/promo-custom-merch.png"
                    alt="Custom Branded Apparel"
                    className="object-cover rounded-2xl h-72 w-72"
                />
            </div>
        </section>
    );
}
