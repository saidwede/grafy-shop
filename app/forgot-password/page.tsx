"use client";

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { t, locale } = useLanguage();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFD]">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-black tracking-tight text-black mb-4 inline-block">
                        Grafy<span className="text-gray-400">Shop</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">
                        {locale === 'fr' ? 'Mot de passe oublié' : 'Forgot Password'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm px-4">
                        {locale === 'fr' 
                            ? "Entrez votre email pour recevoir un lien de réinitialisation." 
                            : "Enter your email to receive a password reset link."}
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                    {isSuccess ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-500" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {locale === 'fr' ? 'Email envoyé !' : 'Email Sent!'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-8 px-4">
                                {locale === 'fr' 
                                    ? "Veuillez vérifier votre boîte de réception pour les instructions." 
                                    : "Please check your inbox for instructions to reset your password."}
                            </p>
                            <Link 
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-black hover:underline"
                            >
                                <ArrowLeft size={16} />
                                {locale === 'fr' ? 'Retour à la connexion' : 'Back to Login'}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    locale === 'fr' ? 'Envoyer le lien' : 'Send Reset Link'
                                )}
                            </button>

                            <div className="text-center pt-2">
                                <Link 
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    {locale === 'fr' ? 'Retour à la connexion' : 'Back to Login'}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
