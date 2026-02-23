"use client";

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_PRODUCTS } from '../../page';
import ProductGallery from '@/components/ProductGallery';
import { ShoppingCart, ArrowLeft, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function QuantitySelectionPage() {
    const { slug } = useParams();
    const { t } = useLanguage();

    const product = MOCK_PRODUCTS.find(p => p.slug === slug);

    // Initialize quantities for each size
    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        if (!product) return {};
        const initial: Record<string, number> = {};
        if (product.sizes.length > 0) {
            product.sizes.forEach(size => {
                initial[size] = 0;
            });
        } else {
            initial['default'] = product.minimumOrder;
        }
        return initial;
    });

    const totalQuantity = useMemo(() => {
        return Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
    }, [quantities]);

    const isMinOrderMet = totalQuantity >= (product?.minimumOrder || 0);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop" className="text-blue-600 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const handleQuantityChange = (size: string, value: string) => {
        const val = parseInt(value);
        if (isNaN(val) || val < 0) return;
        setQuantities(prev => ({
            ...prev,
            [size]: val
        }));
    };

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12">
            {/* Breadcrumbs / Back Button */}
            <Link
                href={`/shop/${product.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 group"
            >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                {t(product.nameKey)}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Side: Gallery */}
                <ProductGallery images={product.images} />

                {/* Right Side: Configuration */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            {product.categoryKey}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tighter uppercase italic">
                            {t(product.nameKey)}
                        </h1>
                        <p className="text-2xl font-black text-black">
                            ${product.price.toFixed(2)} / unit
                        </p>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-sm font-black uppercase tracking-widest text-black mb-4">
                            Step 2: {t('total_quantity')}
                        </h2>
                        <p className="text-xs text-gray-500 mb-6">
                            {t('select_sizes_desc').replace('{count}', product.minimumOrder.toString())}
                        </p>

                        {/* Size Inputs Grid - 3 per line */}
                        <div className="grid grid-cols-3 gap-3">
                            {product.sizes.length > 0 ? (
                                product.sizes.map((size) => (
                                    <div key={size} className="flex flex-col gap-1.5">
                                        <span className="font-black text-[10px] uppercase tracking-widest text-gray-400 ml-1">{size}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={quantities[size] || ''}
                                            onChange={(e) => handleQuantityChange(size, e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-black/5 rounded-xl font-bold text-center outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col gap-1.5">
                                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-400 ml-1">{t('quantity')}</span>
                                    <input
                                        type="number"
                                        min={product.minimumOrder}
                                        value={quantities['default']}
                                        onChange={(e) => handleQuantityChange('default', e.target.value)}
                                        className="w-full max-w-[200px] px-4 py-3 bg-gray-50 border border-black/5 rounded-xl font-bold text-center outline-none focus:border-black transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 border border-black/5 rounded-3xl p-8 mb-8">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{t('total_quantity')}</span>
                                <span className={`text-xl font-black ${isMinOrderMet ? 'text-green-600' : 'text-red-500'}`}>
                                    {totalQuantity}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-black/5">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{t('total_price')}</span>
                                <span className="text-xl font-black text-black">
                                    ${(totalQuantity * product.price).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {!isMinOrderMet && (
                                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg border border-red-100 italic">
                                    <AlertTriangle size={14} />
                                    {t('min_order_not_met').replace('{count}', product.minimumOrder.toString())}
                                </div>
                            )}
                            {isMinOrderMet && (
                                <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-4 py-2 rounded-lg border border-green-100 italic">
                                    <CheckCircle2 size={14} />
                                    Order requirement met
                                </div>
                            )}
                            <button
                                disabled={!isMinOrderMet}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl ${isMinOrderMet
                                    ? 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                {t('add_to_cart')}
                            </button>
                        </div>
                    </div>

                    {/* Benefits Box */}
                    <div className="flex items-start gap-4 p-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
                        <Info size={18} className="text-blue-500 mt-0.5" />
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-1">Bulk Order Benefits</h3>
                            <p className="text-[10px] text-blue-700/70 leading-relaxed font-bold">
                                All our products are customized using professional printing techniques. The minimum order ensures we can maintain the highest quality standards for your branding.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
