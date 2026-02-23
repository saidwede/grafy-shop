"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_PRODUCTS } from '../page';
import ProductGallery from '@/components/ProductGallery';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

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
        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12">
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
                        <h1 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tighter uppercase italic">
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
                                    <ShoppingCart size={20} className="opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-5 bg-white rotate-45 rounded-full" />
                                    </div>
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
        </main>
    );
}
