"use client";

import Link from '@/components/LocalizedLink';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Palette, ShieldCheck, Zap, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const PRODUCTS = [
    { src: '/images/grafy-bag.png', alt: 'Grafy Bag' },
    { src: '/images/grafy-bottle-green.png', alt: 'Grafy Bottle' },
    { src: '/images/grafy-shirt.png', alt: 'Grafy Shirt' },
    { src: '/images/grafy-note.png', alt: 'Grafy Notebook' },
    { src: '/images/grafy-t-shirt-blue.png', alt: 'Grafy T-Shirt' },
    { src: '/images/grafy-mug-blue.png', alt: 'Grafy Mug' },
    { src: '/images/grafy-usb-blue.png', alt: 'Grafy USB' },
];

export default function Hero() {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const features = [
        {
            icon: Palette,
            title: t('hero_feature_1_title'),
            desc: t('hero_feature_1_desc'),
            color: "text-indigo-600",
        },
        {
            icon: ShieldCheck,
            title: t('hero_feature_2_title'),
            desc: t('hero_feature_2_desc'),
            color: "text-emerald-600",
        },
        {
            icon: Zap,
            title: t('hero_feature_3_title'),
            desc: t('hero_feature_3_desc'),
            color: "text-amber-500",
        },
        // {
        //     icon: Leaf,
        //     title: t('hero_feature_4_title'),
        //     desc: t('hero_feature_4_desc')
        // }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full min-h-[700px] flex items-center overflow-hidden bg-white rounded-3xl md:mt-12 mb-20 lg:py-16">
            <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 items-center w-full py-12 md:py-12">
                {/* Left: Text Content */}
                <div className="space-y-2 text-left order-1 lg:order-1 lg:max-w-sm">
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl text-center md:text-left font-black leading-[1.05] tracking-tighter">
                            {t('hero_main_title').split('.').filter(p => p.trim()).map((part, i, arr) => {
                                const isCustomize = i === 1; // Middle word
                                return (
                                    <span
                                        key={i}
                                        className={`block ${isCustomize ? 'text-black' : 'text-white [-webkit-text-stroke:1px_black]'}`}
                                    >
                                        {part.trim()}.
                                    </span>
                                );
                            })}
                        </h1>
                        <p className="text-lg md:text-xl text-center md:text-left text-gray-500 font-medium leading-relaxed">
                            {t('hero_main_subtitle')}
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                        <Link
                            href="/shop"
                            className="group px-10 py-4.5 bg-black text-white font-bold rounded-full transition-all transform flex items-center gap-2"
                        >
                            {t('hero_main_cta')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Center: Mockup Animation */}
                <div className="relative z-10 order-2 lg:order-2 flex justify-center perspective-1000">
                    <div className="relative w-full aspect-[9/19.5] max-w-[320px] md:max-w-[340px]">
                        {/* Phone Frame */}
                        <Image
                            src="/images/phone-mockup.png"
                            alt="iPhone 15 Pro customization mockup"
                            fill
                            className="object-contain drop-shadow-2xl z-10"
                            priority
                        />

                        {/* Internal Screen UI */}
                        <div className="absolute inset-[5%] rounded-[2.5rem] overflow-hidden z-10 p-2 pt-6 flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex items-center justify-between pt-2">
                                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ChevronLeft className="w-4 h-4 text-black" />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                    {t('hero_mockup_customization')}
                                </span>
                                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-black" />
                                </button>
                            </div>

                            {/* Central Product Card Backdrop */}
                            <div className="flex-1 my-2 mx-1 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent" />
                            </div>

                            {/* Bottom Controls */}
                            <div className="mt-auto space-y-5 pb-6 px-1">
                                {/* Color Selection */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">
                                        {t('hero_mockup_color')}
                                    </p>
                                    <div className="flex justify-between gap-2">
                                        {['#000000', '#2563eb', '#f97316', '#ef4444', '#10b981'].map((color, i) => (
                                            <div
                                                key={color}
                                                className={`w-10 h-10 rounded-full border-2 ${i === 1 ? 'border-black' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">
                                        {t('hero_mockup_size')}
                                    </p>
                                    <div className="flex justify-between gap-2">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                                            <div
                                                key={size}
                                                className={`flex-1 aspect-square rounded-full flex items-center justify-center text-[12px] font-black border-2 transition-colors ${i === 1 ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-500'}`}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Animated Products */}
                        <div className="absolute inset-0 -translate-y-[5%] flex items-center justify-center z-30 pointer-events-none">
                            <div className="w-full h-full relative mb-12">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, scale: 0.1, y: 30 }}
                                        animate={{ opacity: 1, scale: 0.9, y: 0 }}
                                        exit={{
                                            opacity: [1, 1, 0],
                                            scale: [1, 2, 3],
                                            y: [0, -10, -30]
                                        }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Image
                                            src={PRODUCTS[currentIndex].src}
                                            alt={PRODUCTS[currentIndex].alt}
                                            width={400}
                                            height={400}
                                            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Feature Highlights */}
                <div className="order-3 space-y-16 lg:pl-12">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col md:flex-row-reverse md:items-start items-center gap-5 group hover:translate-x-1 transition-transform">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0`}>
                                <feature.icon className={`w-7 h-7 ${feature.color} transition-colors`} />
                            </div>
                            <div className="space-y-1 pt-1">
                                <h3 className="font-light text-black text-center md:text-right text-xl tracking-tight leading-none">{feature.title}</h3>
                                <p className="text-gray-500 text-sm font-medium text-center md:text-right leading-tight">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
