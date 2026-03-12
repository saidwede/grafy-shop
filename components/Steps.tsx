import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const Steps = () => {
    const { t } = useLanguage();

    const steps = [
        {
            image: "/images/steps/choose.png",
            title: t('step_1_title'),
            description: t('step_1_desc'),
        },
        {
            image: "/images/steps/add_design_2.png",
            title: t('step_2_title'),
            description: t('step_2_desc'),
        },
        {
            image: "/images/steps/shipping.png",
            title: t('step_3_title'),
            description: t('step_3_desc'),
        }
    ];

    return (
        <section className="overflow-hidden relative mb-20 px-4 md:px-0">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        {t('steps_title')}
                    </h2>
                    <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-500 shadow-2xl shadow-gray-200/40"
                        >
                            {/* Image Container */}
                            <div className="aspect-[3/5] relative w-full overflow-hidden bg-white">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Soft overlay for text contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-0 absolute bottom-0 left-0 w-full z-20">
                                <h3 className="text-[24px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-[16px] leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Steps;
