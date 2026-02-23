"use client";

import Link from 'next/link';
import { ShoppingCart, User, Heart, Search, ChevronDown, Languages, X as CloseIcon, ArrowRight } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';
import { motion } from 'framer-motion';
import MobileMenu from '@/components/MobileMenu';

const SEARCH_DATA = [
    // Categories
    { key: 'cat_t_shirts', type: 'category', image: '/images/categories/t-shirts.png', slug: 't-shirts' },
    { key: 'cat_sweatshirts', type: 'category', image: '/images/categories/sweatshirts.png', slug: 'sweatshirts' },
    { key: 'cat_hats', type: 'category', image: '/images/categories/hats.png', slug: 'hats' },
    { key: 'cat_jackets_vests', type: 'category', image: '/images/categories/jackets-vests.png', slug: 'jackets-vests' },
    { key: 'cat_bags', type: 'category', image: '/images/categories/bags.png', slug: 'bags' },
    { key: 'cat_drinkware', type: 'category', image: '/images/categories/drinkware.png', slug: 'drinkware' },
    { key: 'cat_polos', type: 'category', image: '/images/categories/polos-business-wear.png', slug: 'polos' },
    { key: 'cat_workwear', type: 'category', image: '/images/categories/workwear-uniforms.png', slug: 'workwear' },
    // Mock Products
    { key: 'prod_t_shirt', type: 'product', image: '/images/categories/t-shirts.png', slug: 'classic-t-shirt' },
    { key: 'prod_hoodie', type: 'product', image: '/images/categories/sweatshirts.png', slug: 'premium-hoodie' },
    { key: 'prod_mug', type: 'product', image: '/images/categories/drinkware.png', slug: 'custom-mug' },
    { key: 'prod_tote', type: 'product', image: '/images/categories/bags.png', slug: 'eco-tote' },
    { key: 'prod_tumbler', type: 'product', image: '/images/categories/drinkware.png', slug: 'branded-tumbler' },
];

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

export default function Header() {
    const { locale, setLocale, t } = useLanguage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'fr' : 'en');
    };

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountOpen(false);
            }
        };
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
                setIsAccountOpen(false);
                setIsCatDropdownOpen(false);
            }
        };

        if (isSearchOpen || isAccountOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isSearchOpen, isAccountOpen]);

    const filteredResults = SEARCH_DATA
        .map(item => ({
            ...item,
            title: t(item.key),
            typeLabel: t(item.type === 'category' ? 'search_type_category' : 'search_type_product')
        }))
        .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6);

    return (
        <header className="w-full bg-transparent relative z-100">
            <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto px-4 md:px-10 h-20 md:h-24">
                {/* Left: Mobile Burger & Logo Container */}
                <div className="flex-1 flex items-center gap-4">
                    {/* Burger Menu Button (Mobile Only) */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 -ml-2 group relative z-200"
                        >
                            <div className="flex flex-col gap-1.5 items-start">
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: 45, y: 8, width: 32 } : { rotate: 0, y: 0, width: 32 }}
                                    className="h-0.5 bg-black rounded-full"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 24 }}
                                    className="h-0.5 bg-black rounded-full"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: -45, y: -8, width: 32 } : { rotate: 0, y: 0, width: 16 }}
                                    className="h-0.5 bg-black rounded-full"
                                />
                            </div>
                        </button>
                    </div>

                    <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                        Grafy<span className="text-gray-500">Shop</span>
                    </Link>
                </div>

                {/* Mobile Menu Overlay */}
                <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

                {/* Center: Menu & Language Switch */}
                <div className="hidden md:flex items-center gap-12">
                    <nav className="flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_home')}
                        </Link>
                        <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_shop')}
                        </Link>

                        {/* Categories Dropdown Container */}
                        <div
                            className="relative py-4"
                            onMouseEnter={() => setIsCatDropdownOpen(true)}
                            onMouseLeave={() => setIsCatDropdownOpen(false)}
                        >
                            <Link
                                href="/categories"
                                className={`text-sm font-medium transition-colors flex items-center gap-1 ${isCatDropdownOpen ? 'text-black' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                {t('nav_categories')}
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                            </Link>

                            {/* Dropdown Menu */}
                            <div className={`w-[700px] absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 transition-all duration-300 ${isCatDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                                <div className="w-[700px] bg-white border border-black/10 rounded-3xl shadow-2xl p-8 overflow-hidden">
                                    <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                            {t('nav_categories')}
                                        </span>
                                        <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity">
                                            {t('hero_cta')}
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                                        {CATEGORIES.map((cat) => (
                                            <Link
                                                key={cat.key}
                                                href={`/shop?category=${cat.key}`}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group"
                                                onClick={() => setIsCatDropdownOpen(false)}
                                            >
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-black/5">
                                                    <Image
                                                        src={cat.image}
                                                        alt={t(cat.key)}
                                                        fill
                                                        unoptimized
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 group-hover:text-black transition-colors leading-tight">
                                                    {t(cat.key)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_about')}
                        </Link>
                    </nav>

                    {/* Compact Language Switch */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-wider group"
                    >
                        <Languages size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        {locale}
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                </div>


                {/* Right: Actions */}
                <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
                    {/* Search Group */}
                    <div className="relative flex items-center justify-end" ref={searchRef}>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 text-gray-700 hover:text-gray-900 transition-all rounded-full hover:bg-gray-50 ${isSearchOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
                        >
                            <Search size={20} />
                        </button>

                        {/* Search Bar Overlay - Full width on mobile, centered content */}
                        <div className={`fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 top-4 md:top-1/2 md:-translate-y-1/2 transition-all duration-300 flex items-center bg-white border border-black/10 rounded-full shadow-lg z-300 ${isSearchOpen ? 'translate-y-0 opacity-100 px-4 py-2 md:w-[400px]' : '-translate-y-4 opacity-0 pointer-events-none md:w-10'}`}>
                            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={t('search_placeholder')}
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 text-center md:text-left"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                className="ml-2 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            >
                                <CloseIcon size={16} className="text-gray-500" />
                            </button>

                            {/* Search Results Dropdown */}
                            {isSearchOpen && searchQuery && (
                                <div className="absolute top-full right-0 mt-3 w-full bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden z-310 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {filteredResults.length > 0 ? (
                                        <div className="py-2">
                                            {filteredResults.map((result) => (
                                                <Link
                                                    key={result.key}
                                                    href={result.type === 'category' ? `/categories/${result.slug}` : `/product/${result.slug}`}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-4 shrink-0 border border-black/5">
                                                        <Image
                                                            src={result.image}
                                                            alt={result.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors mb-0.5">
                                                            {result.typeLabel}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">
                                                            {result.title}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-gray-400 font-medium">{t('search_no_results')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Link href="/favorites" className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <Heart size={20} />
                    </Link>
                    <Link href="/cart" className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <ShoppingCart size={20} />
                    </Link>

                    {/* User Account Dropdown */}
                    <div className="relative" ref={accountRef}>
                        <button
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                            className={`p-2 text-gray-700 hover:text-gray-900 transition-all rounded-full hover:bg-gray-50 ${isAccountOpen ? 'bg-gray-100' : ''}`}
                        >
                            <User size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {isAccountOpen && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden z-110 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-6 text-center border-b border-black/5">
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">{t('user_welcome')}</h3>
                                    <p className="text-xs text-gray-500">{t('hero_main_subtitle').split('.')[0]}.</p>
                                </div>
                                <div className="p-3 flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        className="w-full py-2.5 bg-black text-white text-center text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
                                        onClick={() => setIsAccountOpen(false)}
                                    >
                                        {t('user_login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="w-full py-2.5 bg-white text-black text-center text-xs font-bold rounded-xl border border-black/10 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsAccountOpen(false)}
                                    >
                                        {t('user_signup')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
