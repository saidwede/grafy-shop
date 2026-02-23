"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

// Mock Cart Data
const MOCK_CART_ITEMS = [
    {
        id: '1',
        nameKey: 'prod_t_shirt',
        price: 29.99,
        quantity: 2,
        image: '/images/products/classic-tshirt.png',
        category: 'T-Shirts'
    },
    {
        id: '2',
        nameKey: 'prod_hoodie',
        price: 59.99,
        quantity: 1,
        image: '/images/products/premium-hoodie.png',
        category: 'Sweatshirts'
    }
];

export default function CartPage() {
    const { t } = useLanguage();
    const [items, setItems] = useState(MOCK_CART_ITEMS);

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping mock
    const tax = subtotal * 0.15; // 15% tax mock
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">{t('cart_empty')}</h1>
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
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-12">
                {t('cart_title')}
                <span className="text-gray-300 ml-4 font-normal not-italic text-2xl">({items.length} {t('cart_items')})</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-8">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 pb-8 border-b border-black/5 group">
                            <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-black/5">
                                <Image
                                    src={item.image}
                                    alt={t(item.nameKey)}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-black group-hover:underline decoration-2 underline-offset-4 pointer-events-none">
                                            {t(item.nameKey)}
                                        </h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                            title={t('cart_remove')}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                        {item.category}
                                    </p>

                                    <div className="flex items-center gap-4 bg-gray-50 w-fit p-1 rounded-xl border border-black/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-black"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-black"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-lg font-black">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={12} />
                        {t('cart_continue_shopping')}
                    </Link>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-3xl p-8 sticky top-32">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-8">
                            {t('cart_summary')}
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('cart_subtotal')}</span>
                                <span className="font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('cart_shipping')}</span>
                                <span className="font-bold text-green-600 tracking-widest uppercase text-[10px]">{t('cart_free')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('cart_tax')}</span>
                                <span className="font-bold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                                <span className="text-lg font-black uppercase tracking-tighter italic">{t('cart_total')}</span>
                                <span className="text-2xl font-black">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]">
                            {t('cart_checkout')}
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
