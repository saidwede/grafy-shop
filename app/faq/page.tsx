"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, HelpCircle, Package, Truck, CreditCard } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
    return (
        <div className="border-b border-black/5 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-8 flex items-center justify-between gap-6 text-left group"
            >
                <span className={`text-lg md:text-xl font-bold transition-all ${isOpen ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
                    {question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full border border-black/5 flex items-center justify-center transition-all ${isOpen ? 'bg-black text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:border-black/20'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                <p className="text-gray-500 leading-relaxed font-bold">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const categories = [
        {
            title: t('faq_q1_title'),
            icon: <HelpCircle size={20} />,
            items: [
                { q: t('faq_q1'), a: t('faq_a1') }
            ]
        },
        {
            title: t('faq_q2_title'),
            icon: <Truck size={20} />,
            items: [
                { q: t('faq_q2'), a: t('faq_a2') }
            ]
        },
        {
            title: t('faq_q3_title'),
            icon: <Package size={20} />,
            items: [
                { q: t('faq_q3'), a: t('faq_a3') }
            ]
        }
    ];

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 md:px-8">
            {/* Header Section */}
            <div className="text-center mb-20">
                <span className="inline-block px-4 py-1.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-black/5">
                    GrafyShop Support
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter uppercase italic">
                    {t('faq_title')}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                    {t('faq_subtitle')}
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-16">
                {categories.map((category, catIdx) => (
                    <div key={catIdx}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-black text-white rounded-lg">
                                {category.icon}
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-black">
                                {category.title}
                            </h2>
                        </div>

                        <div className="bg-white rounded-[32px] border border-black/5 px-8 md:px-12 shadow-xl shadow-black/5">
                            {category.items.map((item, itemIdx) => {
                                const globalIdx = catIdx * 10 + itemIdx; // Unique index
                                return (
                                    <FAQItem
                                        key={itemIdx}
                                        question={item.q}
                                        answer={item.a}
                                        isOpen={openIndex === globalIdx}
                                        onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Still have questions? */}
            <div className="mt-24 p-12 bg-gray-50 rounded-[40px] text-center border border-black/5 relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Still have questions?</h3>
                    <p className="text-gray-500 font-bold mb-8 max-w-md mx-auto">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <a
                        href="/contact"
                        className="inline-flex py-4 px-10 bg-black text-white rounded-2xl font-bold transition-all transform hover:scale-[1.05] shadow-xl"
                    >
                        Get in Touch
                    </a>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-50 transition-transform group-hover:scale-110" />
            </div>
        </main>
    );
}
