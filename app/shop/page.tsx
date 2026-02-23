"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ProductGrid from '@/components/ProductGrid';
import { ChevronDown, SlidersHorizontal, Search, Check } from 'lucide-react';

export const MOCK_PRODUCTS = [
    {
        id: '1',
        slug: 'classic-heavy-cotton-tshirt',
        nameKey: 'prod_t_shirt',
        descriptionKey: 'prod_t_shirt_desc',
        price: 29.99,
        imageSrc: '/images/products/classic-tshirt.png',
        images: ['/images/products/classic-tshirt.png', '/images/categories/t-shirts.png'],
        categoryKey: 'T-Shirts',
        createdAt: '2024-01-01',
        minimumOrder: 10,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: '2',
        slug: 'premium-pullover-hoodie',
        nameKey: 'prod_hoodie',
        descriptionKey: 'prod_hoodie_desc',
        price: 59.99,
        imageSrc: '/images/products/premium-hoodie.png',
        images: ['/images/products/premium-hoodie.png', '/images/categories/sweatshirts.png'],
        categoryKey: 'Sweatshirts',
        createdAt: '2024-01-05',
        minimumOrder: 5,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: '3',
        slug: 'custom-ceramic-mug',
        nameKey: 'prod_mug',
        descriptionKey: 'prod_mug_desc',
        price: 14.99,
        imageSrc: '/images/products/ceramic-mug.png',
        images: ['/images/products/ceramic-mug.png', '/images/categories/drinkware.png'],
        categoryKey: 'Drinkware',
        createdAt: '2024-01-10',
        minimumOrder: 24,
        sizes: []
    },
    {
        id: '4',
        slug: 'eco-friendly-tote-bag',
        nameKey: 'prod_tote',
        descriptionKey: 'prod_tote_desc',
        price: 19.99,
        imageSrc: '/images/products/eco-tote.png',
        images: ['/images/products/eco-tote.png', '/images/categories/bags.png'],
        categoryKey: 'Bags',
        createdAt: '2024-02-01',
        minimumOrder: 50,
        sizes: ['One Size']
    },
    {
        id: '5',
        slug: 'stainless-steel-tumbler',
        nameKey: 'prod_tumbler',
        descriptionKey: 'prod_tumbler_desc',
        price: 34.99,
        imageSrc: '/images/products/stainless-tumbler.png',
        images: ['/images/products/stainless-tumbler.png', '/images/categories/drinkware.png'],
        categoryKey: 'Drinkware',
        createdAt: '2024-02-15',
        minimumOrder: 12,
        sizes: []
    },
    {
        id: '6',
        slug: 'vintage-tshirt',
        nameKey: 'prod_t_shirt',
        descriptionKey: 'prod_t_shirt_desc',
        price: 32.99,
        imageSrc: '/images/products/vintage-tshirt.png',
        images: ['/images/products/vintage-tshirt.png', '/images/categories/t-shirts.png'],
        categoryKey: 'T-Shirts',
        createdAt: '2024-02-20',
        minimumOrder: 10,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '7',
        slug: 'winter-hoodie',
        nameKey: 'prod_hoodie',
        descriptionKey: 'prod_hoodie_desc',
        price: 64.99,
        imageSrc: '/images/products/winter-hoodie.png',
        images: ['/images/products/winter-hoodie.png', '/images/categories/sweatshirts.png'],
        categoryKey: 'Sweatshirts',
        createdAt: '2024-02-22',
        minimumOrder: 5,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: '8',
        slug: 'lifestyle-tote',
        nameKey: 'prod_tote',
        descriptionKey: 'prod_tote_desc',
        price: 24.99,
        imageSrc: '/images/products/lifestyle-tote.png',
        images: ['/images/products/lifestyle-tote.png', '/images/categories/bags.png'],
        categoryKey: 'Bags',
        createdAt: '2024-02-23',
        minimumOrder: 50,
        sizes: ['One Size']
    },
];




const CATEGORIES = [
    { key: 'All', name: 'All Products', imageSrc: '/images/hero-mockup.png' },
    { key: 'T-Shirts', name: 'T-Shirts', imageSrc: '/images/categories/t-shirts.png' },
    { key: 'Sweatshirts', name: 'Sweatshirts', imageSrc: '/images/categories/sweatshirts.png' },
    { key: 'Hats', name: 'Hats', imageSrc: '/images/categories/hats.png' },
    { key: 'Bags', name: 'Bags', imageSrc: '/images/categories/bags.png' },
    { key: 'Drinkware', name: 'Drinkware', imageSrc: '/images/categories/drinkware.png' },
    { key: 'Workwear', name: 'Workwear', imageSrc: '/images/categories/workwear-uniforms.png' },
];

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
        <main className="max-w-7xl mx-auto px-4 py-16 md:px-8 lg:px-12">
            {/* Shop Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tighter uppercase italic">
                        {t('nav_shop')}
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        {t('hero_main_subtitle')}
                    </p>
                </div>

                {/* Search Bar - Shop Specific */}
                <div className="w-full md:w-auto flex flex-col gap-4">
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
                </div>
            </div>

            {/* Category Image Filters */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-4 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className="flex flex-col items-center gap-3 min-w-[100px] group transition-all"
                        >
                            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 ${selectedCategory === cat.key
                                ? 'border-black scale-110 shadow-xl shadow-black/10'
                                : 'border-transparent bg-gray-50 hover:border-black/10'
                                }`}>
                                <Image
                                    src={cat.imageSrc}
                                    alt={cat.name}
                                    fill
                                    unoptimized
                                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${selectedCategory === cat.key ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                                        }`}
                                />

                            </div>
                            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${selectedCategory === cat.key ? 'text-black' : 'text-gray-400 group-hover:text-black'
                                }`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters & Sorting Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 py-6 border-y border-black/5">
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
                    </button>

                    {/* Custom Dropdown */}
                    {isSortOpen && (
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
            </div>

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
