"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_PRODUCTS } from '@/constants/products';
import ProductGallery from '@/components/ProductGallery';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Palette } from 'lucide-react';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const { t } = useLanguage();

    const product = MOCK_PRODUCTS.find(p => p.slug === slug);

    const [quantity, setQuantity] = useState(product?.minimumOrder || 1);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop" className="text-blue-600 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (isNaN(val)) return;
        setQuantity(Math.max(product.minimumOrder, val));
    };

    return (
        <main className="max-w-7xl mx-auto px-4 pt-20 pb-32 md:px-8 lg:px-12 py-24 md:py-42">
            {/* Breadcrumbs / Back Button */}
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 group"
            >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                {t('nav_shop')}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Side: Gallery */}
                <ProductGallery images={product.images} />

                {/* Right Side: Details */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            {product.categoryKey}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
                            {t(product.nameKey)}
                        </h1>
                        <p className="text-2xl font-black text-black">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed max-w-none">
                        <p>{t(product.descriptionKey)}</p>
                    </div>

                    {/* Minimum Order Info */}
                    <div className="bg-gray-50 border border-black/5 rounded-2xl p-6 mb-8 flex items-start gap-4">
                        <div className="p-2 bg-black text-white rounded-lg">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-black mb-1">
                                {t('product_min_order').replace('{count}', product.minimumOrder.toString())}
                            </p>
                            <p className="text-xs text-gray-500">
                                This item requires a minimum quantity to process specialized printing.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 mb-10">
                        <Link href={`/shop/${product.slug}/quantity`}>
                            <button className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3">
                                <span className="relative">
                                    <Palette size={20} className="" />
                                </span>
                                {t('personalize_design')}
                            </button>
                        </Link>
                    </div>


                    {/* Features/Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/5 pt-10">
                        <div className="flex items-center gap-3">
                            <Truck size={18} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">{t('footer_shipping')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <RotateCcw size={18} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">{t('footer_faq')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-black/10 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:px-4 lg:px-8">
                     <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{t(product.nameKey)}</span>
                        <span className="text-xs font-semibold text-gray-500">${product.price.toFixed(2)}</span>
                     </div>
                     <Link href={`/shop/${product.slug}/quantity`} className="w-full sm:w-auto ml-auto">
                        <button className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-[15px] font-bold rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg">
                            {t('action_customize')}
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                     </Link>
                </div>
            </div>
        </main>
    );
}
