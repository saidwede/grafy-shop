"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, Clock, ShieldCheck, Globe } from 'lucide-react';

export default function ShippingPage() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('shipping_section_1_title'),
            desc: t('shipping_section_1_desc'),
            icon: <Clock size={24} />
        },
        {
            title: t('shipping_section_2_title'),
            desc: t('shipping_section_2_desc'),
            icon: <Globe size={24} />
        },
        {
            title: t('shipping_section_3_title'),
            desc: t('shipping_section_3_desc'),
            icon: <ShieldCheck size={24} />
        }
    ];

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 md:px-8">
            <div className="text-center mb-20">
                <div className="inline-flex p-4 bg-black text-white rounded-2xl mb-6 shadow-xl shadow-black/10">
                    <Truck size={32} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter uppercase italic">
                    {t('shipping_title')}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                    {t('shipping_intro')}
                </p>
            </div>

            <div className="space-y-12">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-[32px] border border-black/5 p-8 md:p-12 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-gray-50 rounded-2xl text-black border border-black/5">
                            {section.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-black">
                                {section.title}
                            </h2>
                            <p className="text-gray-500 font-bold leading-relaxed">
                                {section.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-8 bg-blue-50 border border-blue-100 rounded-[32px] text-center">
                <p className="text-sm font-black uppercase tracking-widest text-blue-900 mb-2">Need priority shipping?</p>
                <p className="text-xs text-blue-700 font-bold mb-6">Contact our support team for expedited shipping options for large orders.</p>
                <a href="/contact" className="text-sm font-black uppercase tracking-widest text-black underline underline-offset-4 hover:opacity-70 transition-opacity">Contact Support</a>
            </div>
        </main>
    );
}
