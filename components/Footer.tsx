"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, X, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Socials */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black tracking-tighter">
                            GRAFY.SHOP
                        </Link>
                        <p className="text-gray-400 text-sm max-w-xs">
                            {t('footer_description')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors" aria-label="X">
                                <X className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors" aria-label="TikTok">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.23-2.74.24-.81.47-1.38 1.31-1.5 2.24-.03.41-.03.82.02 1.23.15 1.15.82 2.22 1.84 2.78.85.46 1.88.58 2.83.35 1.14-.3 2.1-1.13 2.58-2.17.28-.64.4-1.34.39-2.03.02-4.14.01-8.28.01-12.42z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-bold mb-6">{t('nav_categories')}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/shop" className="hover:text-white transition-colors">{t('nav_shop')}</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
                            <li><Link href="/categories" className="hover:text-white transition-colors">{t('nav_categories')}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-6">{t('footer_support')}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer_contact')}</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">{t('footer_shipping')}</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">{t('footer_faq')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-6">{t('footer_contact')}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4" />
                                <span>hello@grafy.shop</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
                    <p>© {new Date().getFullYear()} GRAFY.SHOP. {t('footer_rights')}</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t('footer_privacy')}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t('footer_terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
