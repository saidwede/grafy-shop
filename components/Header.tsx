"use client";

import Link from 'next/link';
import { ShoppingCart, User, Heart, Search, ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const { locale, setLocale, t } = useLanguage();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'fr' : 'en');
    };

    return (
        <header className="w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-32 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex-1">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                        Grafy<span className="text-gray-500">Shop</span>
                    </Link>
                </div>

                {/* Center: Menu & Language Switch */}
                <div className="hidden md:flex items-center gap-12">
                    <nav className="flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_home')}
                        </Link>
                        <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_shop')}
                        </Link>
                        <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            {t('nav_categories')}
                        </Link>
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
                    <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <Search size={20} />
                    </button>
                    <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <Heart size={20} />
                    </button>
                    <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <ShoppingCart size={20} />
                    </button>
                    <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
