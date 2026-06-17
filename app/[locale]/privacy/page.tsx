"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('privacy_section_1_title'),
            desc: t('privacy_section_1_desc')
        },
        {
            title: t('privacy_section_2_title'),
            desc: t('privacy_section_2_desc')
        },
        {
            title: t('privacy_section_3_title'),
            desc: t('privacy_section_3_desc')
        }
    ];

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 pt-42 pb-0 md:px-8 lg:px-12">
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
                        {t('privacy_title')}
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed mb-12">
                        {t('privacy_intro')}
                    </p>
                </div>
            </div>

            {/* Privacy Content List */}
            <div className="max-w-4xl mx-auto px-4 pb-24 md:px-8">
                <div className="border-t border-black/10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="border-b border-black/10 py-12 md:py-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                                {section.title}
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                {section.desc}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 pt-8 text-left">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
