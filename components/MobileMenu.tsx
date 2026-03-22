"use client";

import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { X, Languages, Home, ShoppingBag, Info, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { key: 'cat_t_shirts', image: '/images/categories/t-shirts.png', slug: 't-shirts' },
    { key: 'cat_sweatshirts', image: '/images/categories/sweatshirts.png', slug: 'sweatshirts' },
    { key: 'cat_hats', image: '/images/categories/hats.png', slug: 'hats' },
    { key: 'cat_jackets_vests', image: '/images/categories/jackets-vests.png', slug: 'jackets-vests' },
    { key: 'cat_bags', image: '/images/categories/bags.png', slug: 'bags' },
    { key: 'cat_drinkware', image: '/images/categories/drinkware.png', slug: 'drinkware' },
    { key: 'cat_polos', image: '/images/categories/polos-business-wear.png', slug: 'polos' },
    { key: 'cat_workwear', image: '/images/categories/workwear-uniforms.png', slug: 'workwear' },
    { key: 'cat_office', image: '/images/categories/office-supplies.png', slug: 'office' },
    { key: 'cat_tech', image: '/images/categories/technology.png', slug: 'tech' },
    { key: 'cat_signage', image: '/images/categories/trade-show-signage.png', slug: 'signage' },
    { key: 'cat_activewear', image: '/images/categories/activewear.png', slug: 'activewear' },
];

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { t, locale, setLocale } = useLanguage();

    const menuVariants: Variants = {
        closed: {
            x: "-100%",
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 40
            }
        }
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const linkVariants: Variants = {
        closed: { opacity: 0, x: -20 },
        open: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.1 + i * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as const
            }
        })
    };

    return (
        <div
            className={`fixed inset-0 w-screen h-screen bg-white z-160 flex flex-col md:hidden transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} pt-10`}
        >
            <div className="flex flex-col h-full">


                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Language Switch */}
                    <div className="px-6 py-4 inline-block absolute right-0 top-0">
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-wider group bg-gray-50 px-3 py-2 rounded-xl"
                        >
                            <Languages size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            {locale}
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                    </div>
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-12 items-center py-10 px-6">
                        {[
                            { name: t('nav_home'), href: '/' },
                            { name: t('nav_shop'), href: '/shop' },
                            { name: t('nav_about'), href: '/about' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className="text-2xl font-bold text-gray-900 text-center hover:text-gray-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Categories Horizontal Scroll */}
                    <div className="py-4 px-4">
                        <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar scroll-smooth snap-x">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.key}
                                    href={`/shop?category=${cat.key}`}
                                    onClick={onClose}
                                    className="flex flex-col items-center gap-2 shrink-0 snap-start"
                                >
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 transition-transform">
                                        <Image
                                            src={cat.image}
                                            alt={t(cat.key)}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-600 w-20 text-center leading-tight">
                                        {t(cat.key)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}
