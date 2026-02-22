"use client";

import React from 'react';
import { ShoppingBag, Palette, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Steps = () => {
    const { t } = useLanguage();

    const steps = [
        {
            icon: <ShoppingBag className="w-8 h-8 text-white" />,
            title: t('step_1_title'),
            description: t('step_1_desc'),
        },
        {
            icon: <Palette className="w-8 h-8 text-white" />,
            title: t('step_2_title'),
            description: t('step_2_desc'),
        },
        {
            icon: <Truck className="w-8 h-8 text-white" />,
            title: t('step_3_title'),
            description: t('step_3_desc'),
        },
    ];

    return (
        <section className="py-12 bg-black overflow-hidden relative rounded-3xl mb-20 border border-white/5">
            <div className="max-w-6xl mx-auto px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {t('steps_title')}
                    </h2>
                    <div className="w-24 h-1 bg-white mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-white/10 z-0" />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm hover:bg-white/5 transition-all duration-500 hover:border-white/30"
                        >
                            <div className="mb-8 relative">
                                {/* Icon Container - No more gradients */}
                                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-white/5 transition-transform duration-500 group-hover:scale-105 z-10 relative">
                                    {/* Invert the icon color for contrast */}
                                    {React.cloneElement(step.icon as React.ReactElement<any>, { className: "w-8 h-8 text-black" })}
                                </div>
                                {/* Step Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm shadow-lg border border-black/10 z-20">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 transition-colors duration-300">
                                {step.title}
                            </h3>
                            <p className="text-white/50 leading-relaxed text-balance">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Steps;
