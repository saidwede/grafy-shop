"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Package, User, ChevronRight, Clock, CheckCircle, Truck, Box } from 'lucide-react';

interface Order {
    id: string;
    date: string;
    total: string;
    status: 'processing' | 'printing' | 'shipped' | 'delivered';
    items: number;
}

const MOCK_ORDERS: Order[] = [
    { id: 'GS-8821', date: '2026-02-15', total: '124.50 €', status: 'delivered', items: 3 },
    { id: 'GS-8942', date: '2026-02-20', total: '89.00 €', status: 'shipped', items: 2 },
    { id: 'GS-9015', date: '2026-02-22', total: '210.00 €', status: 'printing', items: 5 },
];

export default function AccountPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

    const getStatusStyles = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'printing': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'printing': return <Box size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50/50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic mb-4">
                        {t('account_title')}
                    </h1>
                    <p className="text-gray-500 font-bold">Welcome back! Manage your orders and profile settings below.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Package size={20} />
                                {t('account_orders')}
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                            >
                                <User size={20} />
                                {t('account_profile')}
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'orders' ? (
                            <div className="space-y-6">
                                {MOCK_ORDERS.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-xl shadow-black/5 group hover:border-black/10 transition-all"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_number')}
                                                </p>
                                                <h3 className="text-xl font-black text-black">{order.id}</h3>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_date')}
                                                </p>
                                                <p className="font-bold text-gray-700">{order.date}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_total')}
                                                </p>
                                                <p className="font-black text-black">{order.total}</p>
                                            </div>

                                            <div>
                                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {t(`status_${order.status}`)}
                                                </div>
                                            </div>

                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="flex items-center gap-2 font-black uppercase italic tracking-tighter text-black group-hover:translate-x-1 transition-transform"
                                            >
                                                {t('order_view_details')}
                                                <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] border border-black/5 p-12 text-center shadow-2xl shadow-black/5">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter mb-4">Profile Settings</h3>
                                <p className="text-gray-500 font-bold mb-8">Securely manage your personal information and preferences.</p>
                                <button className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase italic tracking-tighter cursor-not-allowed">
                                    Editing Restricted (Demo Mode)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
