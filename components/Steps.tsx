import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const Steps = () => {
    const { t } = useLanguage();

    const steps = [
        {
            image: "/images/steps/select-product.png",
            title: t('step_1_title'),
            description: t('step_1_desc'),
            gradient: "bg-linear-to-br from-indigo-500 to-blue-500"
        },
        {
            image: "/images/steps/add_design_2.png",
            title: t('step_2_title'),
            description: t('step_2_desc'),
            gradient: "bg-linear-to-br from-rose-500 to-orange-500"
        },
        {
            image: "/images/steps/shipping.png",
            title: t('step_3_title'),
            description: t('step_3_desc'),
            gradient: "bg-linear-to-br from-emerald-500 to-teal-500"
        }
    ];

    return (
        <section className="overflow-hidden relative mb-20 mt-32 px-4 md:px-0">
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
                            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-500 shadow-2xl shadow-gray-200/40"
                        >
                            {/* Image Container */}
                            <div className={`aspect-[3/5] relative w-full overflow-hidden ${step.gradient}`}>
                                {/* Step Number Label */}
                                <div className="absolute top-4 right-4 text-8xl font-black text-white/15 select-none z-0 leading-[0.8]">
                                    0{index + 1}
                                </div>

                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    width={400}
                                    height={400}
                                    className="object-contain transition-transform duration-700 absolute top-1/6 left-1/2 -translate-x-1/2 group-hover:scale-105 z-10"
                                />
                                {/* Soft overlay for text contrast */}
                                <div className={`absolute inset-0 bg-linear-to-t ${step.gradient.replace('bg-linear-to-br from-', 'from-').replace('to-', 'via-')} to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-10`} />
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-0 absolute bottom-0 left-0 w-full z-20">
                                <h3 className="text-[24px] font-bold text-white mb-2 tracking-tight leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-gray-100 text-[16px] leading-relaxed font-medium line-clamp-3 h-[78px]">
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
