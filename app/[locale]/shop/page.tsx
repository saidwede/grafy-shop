"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ProductGrid from '@/components/ProductGrid';
import { ChevronDown, SlidersHorizontal, Search, Check } from 'lucide-react';

import { MOCK_PRODUCTS, CATEGORIES } from '@/constants/products';


const SORT_OPTIONS = [
    { label: 'Sort by: Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
];

export default function ShopPage() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAndSortedProducts = MOCK_PRODUCTS
        .filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.categoryKey === selectedCategory;
            const matchesSearch = t(product.nameKey).toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });

    return (
        <main className="max-w-7xl mx-auto px-4 py-24 lg:py-42 md:px-8 lg:px-12">
            {/* Shop Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-10">
                <div className="max-w-xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
                        {t('nav_shop')}
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        {t('hero_main_subtitle')}
                    </p>
                </div>

                {/* Search Bar - Shop Specific */}
                {/* <div className="w-full md:w-auto flex flex-col gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className="pl-12 pr-6 py-4 w-full md:w-80 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-black/20 focus:bg-white transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div> */}
            </div>

            {/* Category Image Filters */}
            <div className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className="flex flex-col items-center gap-2 shrink-0 snap-start transition-all"
                        >
                            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ${selectedCategory === cat.key
                                ? 'scale-105 shadow-xl shadow-black/10'
                                : 'bg-gray-100 '
                                }`}>
                                <Image
                                    src={cat.imageSrc}
                                    alt={cat.nameKey ? t(cat.nameKey) : cat.name}
                                    fill
                                    unoptimized
                                    className={`object-cover rounded-2xl transition-transform duration-500 hover:scale-110 ${selectedCategory === cat.key ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                                        }`}
                                />
                            </div>
                            <span className={`text-[10px] md:text-xs transition-colors w-24 text-center  ${selectedCategory === cat.key ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
                                }`}>
                                {cat.nameKey ? t(cat.nameKey) : cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters & Sorting Toolbar */}
            {/* <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 py-6 border-y border-black/5">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Filters
                    </span>
                </div>

                <div className="flex items-center gap-4 relative" ref={sortRef}>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`flex items-center gap-2 px-6 py-2.5 bg-white border rounded-xl text-xs font-bold transition-all ${isSortOpen ? 'border-black bg-gray-50' : 'border-black/5 hover:bg-gray-50'}`}
                    >
                        {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-black' : ''}`} />
                    </button> */}

            {/* Custom Dropdown */}
            {/* {isSortOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 space-y-1">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all ${sortBy === option.value
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                            }`}
                                    >
                                        {option.label}
                                        {sortBy === option.value && <Check size={14} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div> */}

            {/* Results Count */}
            <div className="mb-8">
                <p className="text-sm text-gray-400">
                    Showing <span className="text-black font-bold">{filteredAndSortedProducts.length}</span> products
                </p>
            </div>

            {/* Product Grid */}
            {filteredAndSortedProducts.length > 0 ? (
                <ProductGrid products={filteredAndSortedProducts} />
            ) : (
                <div className="py-32 text-center">
                    <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6">
                        <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('search_no_results')}</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </main>
    );
}
