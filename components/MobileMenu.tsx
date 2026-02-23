"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { X, Languages, ChevronRight, ShoppingCart, User, Heart } from 'lucide-react';
import Image from 'next/image';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { t, locale, setLocale } = useLanguage();

    const menuVariants = {
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const linkVariants = {
        closed: { opacity: 0, x: -20 },
        open: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.1 + i * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    const navLinks = [
        { href: "/", label: t('nav_home') },
        { href: "/shop", label: t('nav_shop') },
        { href: "/categories", label: t('nav_categories') },
        { href: "/about", label: t('nav_about') },
        { href: "/contact", label: t('footer_contact') },
    ];

    const quickActions = [
        { href: "/account", icon: <User size={20} />, label: t('user_login') },
        { href: "/favorites", icon: <Heart size={20} />, label: t('fav_title') },
        { href: "/cart", icon: <ShoppingCart size={20} />, label: t('cart_title') },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150] md:hidden"
                    />

                    {/* Menu Content */}
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[160] shadow-2xl flex flex-col md:hidden"
                    >
                        {/* Header within Menu */}
                        <div className="p-8 flex items-center border-b border-black/5">
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Grafy<span className="text-gray-500">Shop</span>
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-4 py-8 overflow-y-auto overflow-x-hidden">
                            <div className="space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        custom={i}
                                        variants={linkVariants}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-gray-50 transition-all group"
                                        >
                                            <span className="text-xl font-black uppercase italic tracking-tighter text-black">
                                                {link.label}
                                            </span>
                                            <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Divider with Category Style */}
                            <div className="mx-6 my-8 border-t border-black/5 pb-8 pt-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-6 px-4">
                                    Account & Orders
                                </span>
                                <div className="grid grid-cols-1 gap-2">
                                    {quickActions.map((action, i) => (
                                        <motion.div
                                            key={action.href}
                                            custom={navLinks.length + i}
                                            variants={linkVariants}
                                        >
                                            <Link
                                                href={action.href}
                                                onClick={onClose}
                                                className="flex items-center gap-4 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="p-2.5 bg-gray-50 rounded-lg text-black border border-black/5">
                                                    {action.icon}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{action.label}</span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        {/* Footer within Menu */}
                        <div className="p-8 border-t border-black/5 bg-gray-50/50">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                                className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-black/20 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Languages size={18} className="text-gray-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-black">
                                        {locale === 'en' ? 'Français' : 'English'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                        {locale === 'en' ? 'EN' : 'FR'}
                                    </span>
                                    <ChevronRight size={14} className="text-gray-300" />
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
