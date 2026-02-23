"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Scale, UserCheck, Palette, CreditCard } from 'lucide-react';

export default function TermsPage() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('terms_section_1_title'),
            desc: t('terms_section_1_desc'),
            icon: <UserCheck size={24} />
        },
        {
            title: t('terms_section_2_title'),
            desc: t('terms_section_2_desc'),
            icon: <Palette size={24} />
        },
        {
            title: t('terms_section_3_title'),
            desc: t('terms_section_3_desc'),
            icon: <CreditCard size={24} />
        }
    ];

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 md:px-8">
            <div className="text-center mb-20">
                <div className="inline-flex p-4 bg-black text-white rounded-2xl mb-6 shadow-xl shadow-black/10">
                    <Scale size={32} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter uppercase italic">
                    {t('terms_title')}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                    {t('terms_intro')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="p-8 bg-white rounded-[32px] border border-black/5 shadow-xl shadow-black/5 flex flex-col items-center text-center">
                        <div className="mb-6 p-4 bg-gray-50 rounded-2xl text-black">
                            {section.icon}
                        </div>
                        <h2 className="text-lg font-black uppercase italic tracking-tighter mb-4 text-black">
                            {section.title}
                        </h2>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">
                            {section.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-12 bg-gray-50 rounded-[40px] text-center border border-black/5">
                <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-xl mx-auto italic">
                    By using this site, you acknowledge that you have read and understood these terms. GrafyShop reserved the right to update these terms at any time.
                </p>
            </div>
        </main>
    );
}
