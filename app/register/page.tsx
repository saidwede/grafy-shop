"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, ChevronRight, User } from 'lucide-react';

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen flex bg-white">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#F8F8F8] items-center justify-center overflow-hidden">
                <Image
                    src="/images/auth/register-hero.png"
                    alt="Start Designing"
                    fill
                    className="object-cover transform hover:scale-[1.05] transition-transform duration-2000"
                />

                <div className="absolute inset-0 bg-black/5 z-10" />

                {/* Float Elements */}
                <div className="absolute top-12 right-12 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl animate-bounce-slow z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Creator Hub</p>
                            <p className="text-sm font-bold">Your Design Profile</p>
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
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter  mb-4 leading-none">
                            {t('auth_register_title')}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {t('auth_register_subtitle')}
                        </p>
                    </div>

                    <div className="space-y-6">

                        {/* Traditional Form */}
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                            />

                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full px-5 py-4 bg-white border border-gray-400 rounded-2xl outline-none focus:border-gray-600 transition-colors text-base text-gray-700 placeholder:text-gray-400"
                            />

                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-800 transition-all active:scale-[0.98] mt-8 group">
                                {t('user_signup')}
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
                                {t('auth_has_account')}{' '}
                                <Link href="/login" className="text-black font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-4 pointer-events-auto">
                                    {t('user_login')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
