"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, CreditCard, MapPin } from 'lucide-react';

interface OrderItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
}

const MOCK_ORDER_DATA = {
    id: 'GS-8821',
    date: '2026-02-15',
    status: 'delivered' as const,
    items: [
        { id: '1', name: 'Classic Heavy Cotton T-Shirt', price: '24.50 €', quantity: 2, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
        { id: '2', name: 'Premium Pullover Hoodie', price: '75.50 €', quantity: 1, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80' }
    ],
    shipping_address: {
        name: 'John Doe',
        street: '123 Avenue des Champs-Élysées',
        city: 'Paris',
        zip: '75008',
        country: 'France'
    },
    payment: {
        method: 'Visa ending in 4242',
        subtotal: '124.50 €',
        shipping: '0.00 €',
        tax: '24.90 €',
        total: '149.40 €'
    }
};

export default function OrderDetailsPage() {
    const { t } = useLanguage();

    const getStatusStep = (status: string) => {
        const steps = ['processing', 'printing', 'shipped', 'delivered'];
        return steps.indexOf(status);
    };

    const currentStep = getStatusStep(MOCK_ORDER_DATA.status);

    const steps = [
        { id: 'processing', icon: <Clock size={16} /> },
        { id: 'printing', icon: <Package size={16} /> },
        { id: 'shipped', icon: <Truck size={16} /> },
        { id: 'delivered', icon: <CheckCircle size={16} /> }
    ];

    return (
        <main className="min-h-screen bg-gray-50/50 py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 font-black uppercase italic tracking-tighter text-gray-400 hover:text-black transition-colors mb-12"
                >
                    <ChevronLeft size={20} />
                    {t('order_back_to_list')}
                </Link>

                <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic mb-2">
                            {t('order_details_title')}
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                            {t('order_number')} {MOCK_ORDER_DATA.id} • {MOCK_ORDER_DATA.date}
                        </p>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className="bg-white rounded-[32px] border border-black/5 p-8 md:p-12 shadow-xl shadow-black/5 mb-12">
                    <div className="relative flex justify-between items-center">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 z-0 rounded-full" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black z-0 rounded-full transition-all duration-1000"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, idx) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${idx <= currentStep ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                                    {step.icon}
                                </div>
                                <span className={`absolute top-full mt-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${idx <= currentStep ? 'text-black' : 'text-gray-300'}`}>
                                    {t(`status_${step.id}`)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Items */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                            <Package size={16} />
                            {t('order_items_title')}
                        </h2>

                        <div className="space-y-4">
                            {MOCK_ORDER_DATA.items.map((item) => (
                                <div key={item.id} className="bg-white rounded-3xl border border-black/5 p-4 flex gap-6 items-center shadow-lg shadow-black/5 hover:border-black/10 transition-all">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-black text-sm mb-1">{item.name}</h4>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-black">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="bg-black rounded-[32px] p-8 text-white shadow-2xl shadow-black/20">
                            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6">Summary</h3>
                            <div className="space-y-4 text-sm font-bold">
                                <div className="flex justify-between text-white/60">
                                    <span>{t('order_summary_subtotal')}</span>
                                    <span>{MOCK_ORDER_DATA.payment.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>{t('order_summary_shipping')}</span>
                                    <span>{MOCK_ORDER_DATA.payment.shipping}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>{t('order_summary_tax')}</span>
                                    <span>{MOCK_ORDER_DATA.payment.tax}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between text-lg font-black uppercase italic">
                                    <span>Total</span>
                                    <span>{MOCK_ORDER_DATA.payment.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Sections */}
                        <div className="space-y-6 px-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <MapPin size={12} />
                                    {t('order_info_shipping_address')}
                                </h4>
                                <div className="text-xs font-bold text-gray-600 leading-relaxed">
                                    <p>{MOCK_ORDER_DATA.shipping_address.name}</p>
                                    <p>{MOCK_ORDER_DATA.shipping_address.street}</p>
                                    <p>{MOCK_ORDER_DATA.shipping_address.zip} {MOCK_ORDER_DATA.shipping_address.city}</p>
                                    <p>{MOCK_ORDER_DATA.shipping_address.country}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <CreditCard size={12} />
                                    {t('order_info_payment_method')}
                                </h4>
                                <p className="text-xs font-bold text-gray-600">
                                    {MOCK_ORDER_DATA.payment.method}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
