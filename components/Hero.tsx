"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full min-h-[600px] flex items-center overflow-hidden bg-black rounded-3xl mt-4 mb-20">
            {/* Background/Video Layer */}
            <div className="absolute inset-0 z-0">
                {/* Mockup as background/fallback */}
                <Image
                    src="/images/hero-mockup.png"
                    alt="Product showcase background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />

                {/* Video Overlay with screen blend mode for transparency */}
                {/* User can replace 'src' with their actual rotating products video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen overflow-hidden"
                    poster="/images/hero-mockup.png"
                >
                    <source src="/videos/hero-rotation.mp4" type="video/mp4" />
                </video>

                {/* Subtle radial gradients for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-8 md:px-16 flex flex-col gap-8">
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter text-center">
                        {t('hero_main_title').split('.').map((part, i, arr) => (
                            <span key={i} className="block">
                                {part}{i < arr.length - 1 ? '.' : ''}
                            </span>
                        ))}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-md font-medium leading-relaxed text-center">
                        {t('hero_main_subtitle')}
                    </p>
                </div>

                <div className="flex items-center gap-6 justify-center">
                    <Link
                        href="/shop"
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl shadow-white/10"
                    >
                        {t('hero_main_cta')}
                    </Link>
                </div>
            </div>

            {/* Subtle bottom fade to blend with next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent opacity-40 z-10" />
        </section>
    );
}
