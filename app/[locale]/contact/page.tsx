"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
    const { t } = useLanguage();
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => {
            setFormStatus('success');
        }, 1500);
    };

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 pt-42 pb-0 md:px-8 lg:px-12">
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
                        {t('contact_title')}
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed mb-12">
                        {t('contact_subtitle')}
                    </p>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 pb-24 md:px-8 lg:px-12">
                <div className="border-t border-black/10 pt-16 md:pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                        {/* Left Side: Contact Info */}
                        <div className="flex flex-col gap-16">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
                                    {t('contact_info_title')}
                                </h2>
                                
                                <div className="space-y-12">
                                    <div className="flex items-start gap-8">
                                        <div className="pt-1">
                                            <Phone size={24} className="text-black" strokeWidth={1.5} />
                                        </div>
                                        <div className="border-b border-black/10 pb-8 flex-1">
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Call Us</p>
                                            <p className="text-xl md:text-2xl font-bold text-black">+1 (800) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-8">
                                        <div className="pt-1">
                                            <Mail size={24} className="text-black" strokeWidth={1.5} />
                                        </div>
                                        <div className="border-b border-black/10 pb-8 flex-1">
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Support</p>
                                            <p className="text-xl md:text-2xl font-bold text-black">hello@grafyshop.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-8">
                                        <div className="pt-1">
                                            <MapPin size={24} className="text-black" strokeWidth={1.5} />
                                        </div>
                                        <div className="border-b border-black/10 pb-8 flex-1">
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Our Studio</p>
                                            <p className="text-xl md:text-2xl font-bold text-black">789 Creative Blvd, Design District<br />Paris, 75001 France</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Features */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-4">
                                    <Clock size={24} className="text-black" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-bold text-black mb-1">Rapid Response</p>
                                        <p className="text-sm text-gray-500">Within 24 business hours</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Globe size={24} className="text-black" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-bold text-black mb-1">Global Shipping</p>
                                        <p className="text-sm text-gray-500">Serving 50+ countries</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="relative">
                            <div className="rounded-4xl text-left p-8 md:p-8 h-full">
                                {/* Status Overlay */}
                                {formStatus === 'success' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500 py-12">
                                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-8">
                                            <Send size={24} />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">{t('contact_form_success')}</h3>
                                        <button
                                            onClick={() => setFormStatus('idle')}
                                            className="text-sm font-bold text-gray-500 hover:text-black mt-4 underline underline-offset-4"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full justify-between">
                                        <div className="space-y-8">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Jane Doe"
                                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                                            />
                                            <input
                                                    required
                                                    type="email"
                                                    placeholder="jane@example.com"
                                                    className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                                            />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Project Inquiry"
                                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                                            />

                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="How can we help you today?"
                                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400 resize-none"
                                            />
                                        </div>

                                        <button
                                            disabled={formStatus === 'sending'}
                                            className="mt-12 w-full py-5 bg-black text-white hover:bg-gray-900 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {formStatus === 'sending' ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {t('contact_form_send')}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
