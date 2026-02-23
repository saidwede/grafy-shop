"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Mail, Lock, ChevronRight } from 'lucide-react';

export default function LoginPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen flex bg-white">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#F8F8F8] items-center justify-center overflow-hidden">
                <Image
                    src="/images/auth/login-hero.png"
                    alt="Join GrafyShop"
                    fill
                    className="object-cover transform hover:scale-[1.05] transition-transform duration-2000"
                />

                <div className="absolute inset-0 bg-black/5 z-10" />

                {/* Float Elements */}
                <div className="absolute bottom-12 left-12 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl animate-bounce-slow z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <Lock size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Access</p>
                            <p className="text-sm font-bold">Encrypted Connection</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 relative">
                {/* Back to Home */}
                <Link
                    href="/"
                    className="absolute top-8 left-6 md:left-12 lg:left-24 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    <ArrowLeft size={14} />
                    {t('nav_home')}
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4 leading-none">
                            {t('auth_login_title')}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {t('auth_login_subtitle')}
                        </p>
                    </div>

                    <div className="space-y-6">

                        {/* Traditional Form */}
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                    {t('auth_email')}
                                </label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        {t('auth_password')}
                                    </label>
                                    <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                                        {t('auth_forgot_password')}
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-800 transition-all active:scale-[0.98] mt-8 group">
                                {t('user_login')}
                                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        <div className="relative flex items-center justify-center">
                            <hr className="w-full border-black/5" />
                            <span className="absolute bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                {t('auth_or')}
                            </span>
                        </div>

                        {/* Google Login */}
                        <button className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-black/10 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm active:scale-[0.98]">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            {t('auth_google_login')}
                        </button>

                        <div className="pt-8 text-center">
                            <p className="text-sm font-medium text-gray-400">
                                {t('auth_no_account')}{' '}
                                <Link href="/register" className="text-black font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-4 pointer-events-auto">
                                    {t('user_signup')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
