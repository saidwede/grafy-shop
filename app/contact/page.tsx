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
            // Reset after some time if needed or handle navigation
        }, 1500);
    };

    return (
        <main className="max-w-7xl mx-auto px-4 py-16 md:px-8 lg:px-12">
            {/* Header Section */}
            <div className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter uppercase italic">
                    {t('contact_title')}
                </h1>
                <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
                    {t('contact_subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Left Side: Contact Info */}
                <div className="flex flex-col gap-12">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-black mb-6 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-black"></span>
                            {t('contact_info_title')}
                        </h2>
                        <p className="text-gray-500 mb-10 text-sm font-bold leading-relaxed">
                            {t('contact_info_desc')}
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-110">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                                    <p className="text-lg font-bold text-black">+1 (800) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-110">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Support</p>
                                    <p className="text-lg font-bold text-black font-mono">hello@grafyshop.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-110">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Our Studio</p>
                                    <p className="text-lg font-bold text-black">789 Creative Blvd, Design District<br />Paris, 75001 France</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust / Features Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-12 border-t border-black/5">
                        <div className="flex items-start gap-3">
                            <Clock size={18} className="text-black shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-black mb-1">Rapid Response</p>
                                <p className="text-[10px] text-gray-500 font-bold">Within 24 business hours</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Globe size={18} className="text-black shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-black mb-1">Global Shipping</p>
                                <p className="text-[10px] text-gray-500 font-bold">Serving 50+ countries</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="relative">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 -z-10" />

                    <div className="bg-white rounded-[40px] border border-black/5 p-8 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden group">
                        {/* Status Overlay */}
                        {formStatus === 'success' && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{t('contact_form_success')}</h3>
                                <button
                                    onClick={() => setFormStatus('idle')}
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t('contact_form_name')}</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Jane Doe"
                                        className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t('contact_form_email')}</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="jane@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t('contact_form_subject')}</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Project Inquiry"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all font-bold text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t('contact_form_message')}</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="How can we help you today?"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all font-bold text-sm resize-none"
                                />
                            </div>

                            <button
                                disabled={formStatus === 'sending'}
                                className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all transform hover:scale-[1.01] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                            >
                                <span className={`flex items-center gap-3 transition-transform duration-500 ${formStatus === 'sending' ? '-translate-y-20' : ''}`}>
                                    <MessageSquare size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                    {t('contact_form_send')}
                                </span>
                                {formStatus === 'sending' && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-in slide-in-from-bottom-20 duration-500">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
