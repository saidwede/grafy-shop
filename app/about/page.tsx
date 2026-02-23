"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Target, Zap, Lightbulb } from 'lucide-react';

export default function AboutPage() {
    const { t } = useLanguage();

    const VALUES = [
        {
            icon: <Target className="text-black" size={32} />,
            title: t('about_value_1_title'),
            desc: t('about_value_1_desc')
        },
        {
            icon: <Zap className="text-black" size={32} />,
            title: t('about_value_2_title'),
            desc: t('about_value_2_desc')
        },
        {
            icon: <Lightbulb className="text-black" size={32} />,
            title: t('about_value_3_title'),
            desc: t('about_value_3_desc')
        }
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gray-50 border-b border-black/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter uppercase italic animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {t('about_hero_title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {t('about_hero_subtitle')}
                    </p>
                </div>
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/2 rounded-full blur-3xl -z-10" />
            </section>

            {/* Our Story Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-black mb-8 tracking-tighter uppercase italic">
                            {t('about_story_title')}
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>{t('about_story_p1')}</p>
                            <p>{t('about_story_p2')}</p>
                        </div>
                    </div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-black/5 group">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                        <div className="w-full h-full bg-[#F5F5F7] flex items-center justify-center p-12">
                            <div className="text-center">
                                <span className="text-8xl font-black text-black/5 uppercase tracking-tighter italic">GrafyShop</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tighter uppercase italic">
                            {t('about_values_title')}
                        </h2>
                        <div className="w-16 h-1 bg-black mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {VALUES.map((value, index) => (
                            <div
                                key={index}
                                className="p-10 rounded-3xl border border-black/5 hover:border-black/10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 group bg-gray-50/50"
                            >
                                <div className="mb-6 inline-flex p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500 border border-black/5">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-black mb-4">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
