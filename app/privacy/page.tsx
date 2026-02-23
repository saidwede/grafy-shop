"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export default function PrivacyPage() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('privacy_section_1_title'),
            desc: t('privacy_section_1_desc'),
            icon: <Eye size={24} />
        },
        {
            title: t('privacy_section_2_title'),
            desc: t('privacy_section_2_desc'),
            icon: <Lock size={24} />
        },
        {
            title: t('privacy_section_3_title'),
            desc: t('privacy_section_3_desc'),
            icon: <Shield size={24} />
        }
    ];

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 md:px-8">
            <div className="text-center mb-20">
                <div className="inline-flex p-4 bg-black text-white rounded-2xl mb-6 shadow-xl shadow-black/10">
                    <FileText size={32} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter uppercase italic">
                    {t('privacy_title')}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                    {t('privacy_intro')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="group p-8 md:p-12 bg-white rounded-[40px] border border-black/5 hover:border-black/10 transition-all shadow-2xl shadow-black/5 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-xl text-black group-hover:bg-black group-hover:text-white transition-colors">
                                {section.icon}
                            </div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">
                                {section.title}
                            </h2>
                        </div>
                        <p className="text-gray-500 font-bold leading-relaxed">
                            {section.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-20 pt-12 border-t border-black/5 text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last updated: February 2026</p>
            </div>
        </main>
    );
}
