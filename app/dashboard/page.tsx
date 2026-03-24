"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    LayoutGrid, 
    Loader2, 
    Package, 
    ChevronRight, 
    Clock, 
    AlertCircle,
    ShoppingBag,
    Search,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Creation {
    id: string;
    name: string;
    productName: string;
    thumbnail: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const { t, locale } = useLanguage();
    const router = useRouter();
    const [creations, setCreations] = useState<Creation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchCreations = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const tenantId = auth.tenantId || 'default';
            const creationsRef = collection(db, 'GrafyShop', tenantId, 'products');
            const q = query(
                creationsRef, 
                where('userId', '==', user.uid),
                orderBy('updatedAt', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const items: Creation[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    name: data.name || (locale === 'fr' ? 'Conception sans titre' : 'Untitled Design'),
                    productName: data.productName || 'Custom Product',
                    thumbnail: data.thumbnail || '',
                    updatedAt: data.updatedAt || new Date().toISOString()
                });
            });
            setCreations(items);
        } catch (err: any) {
            console.error("Error fetching creations:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchCreations();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce produit ?' : 'Are you sure you want to delete this product?')) return;
        
        try {
            const tenantId = auth.tenantId || 'default';
            await deleteDoc(doc(db, 'GrafyShop', tenantId, 'products', id));
            setCreations(creations.filter(c => c.id !== id));
        } catch (err: any) {
            console.error("Error deleting creation:", err);
            alert(err.message);
        }
    };

    const filteredCreations = creations.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || (!user && isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFDFD] py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
                            <LayoutGrid size={12} className="text-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black">
                                {locale === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
                            {locale === 'fr' ? 'Mes Créations' : 'My Creations'}
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-md">
                            {locale === 'fr' ? 'Gérez et éditez vos designs personnalisés. Créez quelque chose d\'unique.' : 'Manage and edit your custom designs. Create something unique.'}
                        </p>
                    </div>

                    <Link 
                        href="/dashboard/new"
                        className="group relative inline-flex items-center gap-4 bg-black text-white px-8 py-5 rounded-[24px] overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-2xl shadow-black/10"
                    >
                        <span className="relative z-10 font-black uppercase tracking-widest text-xs">
                            {locale === 'fr' ? 'Nouveau Design' : 'New Design'}
                        </span>
                        <Plus size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                        <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-12 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={locale === 'fr' ? 'Rechercher vos designs...' : 'Search your designs...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-black/5 rounded-[24px] pl-16 pr-8 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all shadow-sm"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Loading your workshop...</p>
                    </div>
                ) : creations.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-black/5 rounded-[48px] py-32 px-8 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                            <Package size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-3">
                            {locale === 'fr' ? 'Aucune création pour le moment' : 'No creations yet'}
                        </h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10 max-w-xs leading-relaxed">
                            {locale === 'fr' ? 'Commencez par créer votre premier produit personnalisé avec notre éditeur.' : 'Start by creating your first custom product with our editor.'}
                        </p>
                        <Link 
                            href="/dashboard/new"
                            className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all active:scale-95"
                        >
                            {locale === 'fr' ? 'Commencer la création' : 'Start Creating'}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCreations.map((creation) => (
                                <motion.div
                                    key={creation.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-square bg-[#F5F5F7] overflow-hidden">
                                        {creation.thumbnail ? (
                                            <img 
                                                src={creation.thumbnail} 
                                                alt={creation.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <ShoppingBag size={64} />
                                            </div>
                                        )}
                                        
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                            <Link 
                                                href={`/dashboard/edit/${creation.id}`}
                                                className="p-4 bg-white text-black rounded-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                                                title={locale === 'fr' ? 'Éditer' : 'Edit'}
                                            >
                                                <Edit2 size={20} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(creation.id)}
                                                className="p-4 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                                                title={locale === 'fr' ? 'Supprimer' : 'Delete'}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{creation.productName}</p>
                                            <h3 className="text-xl font-black text-black tracking-tight line-clamp-1">{creation.name}</h3>
                                        </div>
                                        
                                        <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(creation.updatedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <Link 
                                                href={`/dashboard/edit/${creation.id}`}
                                                className="text-black group-hover:translate-x-1 transition-transform"
                                            >
                                                <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}
