"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from '@/components/LocalizedLink';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const { t, locale } = useLanguage();
    const router = useRouter();
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFD]">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-black tracking-tight text-black mb-4 inline-block">
                        Grafy<span className="text-gray-400">Shop</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">
                        {isLogin ? (locale === 'fr' ? 'Bon retour !' : 'Welcome back!') : (locale === 'fr' ? 'Créer un compte' : 'Create an account')}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        {isLogin 
                            ? (locale === 'fr' ? 'Connectez-vous pour gérer vos designs.' : 'Sign in to manage your designs.')
                            : (locale === 'fr' ? 'Rejoignez-nous pour commencer à créer.' : 'Join us to start creating.')}
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                    {locale === 'fr' ? 'Mot de passe' : 'Password'}
                                </label>
                                {isLogin && (
                                    <Link href="/forgot-password" className="text-[10px] font-bold text-black hover:underline uppercase tracking-widest transition-all">
                                        {locale === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
                                    </Link>
                                )}
                            </div>
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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? (locale === 'fr' ? 'Se connecter' : 'Sign In') : (locale === 'fr' ? "S'inscrire" : 'Sign Up')}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {locale === 'fr' ? 'Ou continuez avec' : 'Or continue with'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-bold">Google</span>
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    {isLogin 
                        ? (locale === 'fr' ? "Vous n'avez pas de compte ?" : "Don't have an account?")
                        : (locale === 'fr' ? 'Vous avez déjà un compte ?' : 'Already have an account?')}
                    {' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-black font-bold hover:underline"
                    >
                        {isLogin ? (locale === 'fr' ? "S'inscrire" : 'Sign Up') : (locale === 'fr' ? 'Se connecter' : 'Sign In')}
                    </button>
                </p>
            </div>
        </div>
    );
}
