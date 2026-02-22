"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const NewArrivals = () => {
    const { t } = useLanguage();

    return (
        <section className="relative w-full overflow-hidden rounded-3xl mb-20 flex flex-col lg:flex-row min-h-[500px] border border-black/5 bg-white">
            {/* Image Side (Left on Desktop) */}
            <div className="relative w-full lg:w-[60%] h-[400px] lg:h-auto bg-[#F5F5F7]">
                <Image
                    src="/images/new-arrivals-collage.png"
                    alt="New Arrivals Collage"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content Side (Right on Desktop) */}
            <div className="w-full lg:w-[40%] p-12 md:p-16 flex flex-col justify-center items-start bg-black text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                    {t('arrivals_title')}
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-sm">
                    {t('arrivals_desc')}
                </p>
                <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl shadow-white/5">
                    {t('arrivals_cta')}
                </button>
            </div>
        </section>
    );
};

export default NewArrivals;
