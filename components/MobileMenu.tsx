"use client";

import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { X, Languages, ChevronRight, User as UserIcon, LogOut, LayoutGrid } from 'lucide-react';

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
    const { user, logout } = useAuth();

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

                    {/* Auth Section */}
                    <div className="mt-8 px-6 pb-20">
                        {user ? (
                            <div className="space-y-6">
                                <Link 
                                    href="/account?tab=profile"
                                    className="flex items-center gap-4 p-5 bg-gray-50 rounded-[32px] border border-black/5 shadow-sm active:scale-[0.98] transition-all"
                                    onClick={onClose}
                                >
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 border border-black/5 overflow-hidden shadow-sm">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon size={24} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest shrink-0 mb-1">
                                            {user.displayName || (locale === 'fr' ? 'Mon Compte' : 'My Account')}
                                        </p>
                                        <p className="text-xs font-bold text-gray-400 truncate tracking-tight">{user.email}</p>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-1 gap-3">
                                    <Link
                                        href="/dashboard"
                                        className="w-full flex items-center justify-between px-6 py-4 bg-white border border-black/5 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98] group"
                                        onClick={onClose}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                                <LayoutGrid size={20} />
                                            </div>
                                            <span className="font-black uppercase tracking-tight text-sm text-black">
                                                {locale === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300" />
                                    </Link>

                                    <Link 
                                        href="/account?tab=orders"
                                        className="w-full flex items-center justify-between px-6 py-4 bg-white border border-black/5 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98] group"
                                        onClick={onClose}
                                    >  
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                                <ChevronRight size={20} className="rotate-90 hidden" />
                                                <UserIcon size={20} />
                                            </div>
                                            <span className="font-black uppercase tracking-tight text-sm text-black">
                                                {locale === 'fr' ? 'Mes Commandes' : 'My Orders'}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            onClose();
                                        }}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-colors"
                                    >
                                        {locale === 'fr' ? 'Déconnexion' : 'Log Out'}
                                        <LogOut size={18} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="w-full py-4 bg-black text-white text-center text-sm font-bold rounded-2xl hover:bg-gray-800 transition-colors"
                                >
                                    {t('user_login')}
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="w-full py-4 bg-white text-black text-center text-sm font-bold rounded-2xl border border-black/10 hover:bg-gray-50 transition-colors"
                                >
                                    {t('user_signup')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
