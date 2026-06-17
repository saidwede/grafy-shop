"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import Link from '@/components/LocalizedLink';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
    return (
        <div className="border-b border-black/10">
            <button
                onClick={onClick}
                className="w-full py-6 md:py-8 flex items-center justify-between gap-6 text-left group"
            >
                <span className={`text-lg md:text-2xl font-bold transition-all ${isOpen ? 'text-black' : 'text-gray-800 group-hover:text-black'}`}>
                    {question}
                </span>
                <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : 'text-gray-400 group-hover:text-black'}`}>
                    <ChevronDown size={24} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        { q: t('faq_q1'), a: t('faq_a1') },
        { q: t('faq_q2'), a: t('faq_a2') },
        { q: t('faq_q3'), a: t('faq_a3') }
    ];

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 pt-42 pb-0 md:px-8 lg:px-12">
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
                        {t('faq_title')}
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed mb-12">
                        {t('faq_subtitle')}
                    </p>
                </div>
            </div>

            {/* FAQ List */}
            <div className="max-w-4xl mx-auto px-4 pb-24 md:px-8">
                <div className="border-t border-black/10">
                    {faqs.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.q}
                            answer={item.a}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>

            {/* Still have questions? */}
            <div className="max-w-4xl mx-auto px-4 pb-32 md:px-8">
                <div className="p-12 bg-gray-50 rounded-3xl text-center border border-black/5">
                    <h3 className="text-2xl font-bold text-black mb-4">{t('faq_still_questions_title')}</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('faq_still_questions_desc')}</p>
                    <Link
                        href="/contact"
                        className="inline-flex py-4 px-10 bg-black text-white rounded-full font-bold transition-all hover:bg-black/90 shadow-md hover:shadow-lg"
                    >
                        {t('faq_still_questions_cta')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
