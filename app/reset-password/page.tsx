"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const { t, locale } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'verifying' | 'ready' | 'success' | 'error'>('verifying');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!oobCode) {
            setStatus('error');
            setError(locale === 'fr' ? 'Code de réinitialisation invalide ou manquant.' : 'Invalid or missing reset code.');
            return;
        }

        // Verify the reset code
        verifyPasswordResetCode(auth, oobCode)
            .then(() => setStatus('ready'))
            .catch((err: any) => {
                setStatus('error');
                setError(err.message);
            });
    }, [oobCode, locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(locale === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            if (oobCode) {
                await confirmPasswordReset(auth, oobCode, password);
                setStatus('success');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'verifying') {
        return (
            <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-black mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">
                    {locale === 'fr' ? 'Vérification du code...' : 'Verifying reset code...'}
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === 'fr' ? 'Erreur de réinitialisation' : 'Reset Error'}
                </h3>
                <p className="text-sm text-gray-500 mb-8 px-4">
                    {error}
                </p>
                <Link 
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 py-4 px-8 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
                >
                    {locale === 'fr' ? 'Réessayer' : 'Try Again'}
                </Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === 'fr' ? 'Mot de passe réinitialisé !' : 'Password Reset!'}
                </h3>
                <p className="text-sm text-gray-500 mb-8 px-4">
                    {locale === 'fr' 
                        ? "Votre mot de passe a été mis à jour avec succès." 
                        : "Your password has been successfully updated."}
                </p>
                <Link 
                    href="/login"
                    className="inline-flex items-center gap-2 py-4 px-8 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
                >
                    {locale === 'fr' ? 'Se connecter' : 'Log In'}
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium">
                    {error}
                </div>
            )}

            <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                    {locale === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                    {locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                        placeholder="••••••••"
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
                    locale === 'fr' ? 'Réinitialiser' : 'Reset Password'
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    const { locale } = useLanguage();
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFD]">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-black tracking-tight text-black mb-4 inline-block">
                        Grafy<span className="text-gray-400">Shop</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">
                        {locale === 'fr' ? 'Réinitialisation' : 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm px-4">
                        {locale === 'fr' 
                            ? "Choisissez un nouveau mot de passe sécurisé." 
                            : "Choose a new secure password for your account."}
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                    <Suspense fallback={<div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin text-black mx-auto" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
