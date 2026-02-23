"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Mock Favorites Data
const MOCK_FAVORITES = [
    { id: '1', slug: 'classic-heavy-cotton-tshirt', nameKey: 'prod_t_shirt', price: 29.99, imageSrc: '/images/products/classic-tshirt.png', category: 'T-Shirts' },
    { id: '3', slug: 'custom-ceramic-mug', nameKey: 'prod_mug', price: 14.99, imageSrc: '/images/products/ceramic-mug.png', category: 'Drinkware' },
    { id: '4', slug: 'eco-friendly-tote-bag', nameKey: 'prod_tote', price: 19.99, imageSrc: '/images/products/eco-tote.png', category: 'Bags' },
];

export default function FavoritesPage() {
    const { t } = useLanguage();
    const [favorites, setFavorites] = useState(MOCK_FAVORITES);

    if (favorites.length === 0) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-gray-300" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">{t('fav_empty')}</h1>
                <p className="text-gray-500 mb-8 max-w-xs text-center">{t('fav_description')}</p>
                <Link
                    href="/shop"
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
                >
                    <ArrowLeft size={16} />
                    {t('cart_continue_shopping')}
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
                        {t('fav_title')}
                    </h1>
                    <p className="text-gray-500 font-medium">
                        {favorites.length} {t('fav_count')}
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                >
                    <ShoppingBag size={14} />
                    {t('cart_continue_shopping')}
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {favorites.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        nameKey={product.nameKey}
                        price={product.price}
                        imageSrc={product.imageSrc}
                        category={product.category}
                    />
                ))}
            </div>
        </main>
    );
}
