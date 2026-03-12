import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const FeaturedProducts = () => {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);

    const productSets = [
        [
            {
                id: 1,
                title: t('featured_prod_1_title'),
                description: t('featured_prod_1_desc'),
                price: t('featured_prod_1_price'),
                image: "/images/products/featured-sweatshirt.png",
                tag: null
            },
            {
                id: 2,
                title: t('featured_prod_2_title'),
                description: t('featured_prod_2_desc'),
                price: t('featured_prod_2_price'),
                image: "/images/products/featured-bag.png",
                tag: null
            },
            {
                id: 3,
                title: t('featured_prod_3_title'),
                description: t('featured_prod_3_desc'),
                price: t('featured_prod_3_price'),
                image: "/images/products/featured-drinkware.png",
                tag: "New"
            }
        ],
        [
            {
                id: 4,
                title: "Custom Ceramic Mug",
                description: "Durable ceramic with a smooth matte finish, perfect for your daily coffee.",
                price: "$15.00",
                image: "/images/categories/drinkware.png",
                tag: "Popular"
            },
            {
                id: 5,
                title: "Premium Fitted Tee",
                description: "100% organic cotton, tailored fit for a modern silhouette.",
                price: "$25.00",
                image: "/images/categories/t-shirts.png",
                tag: null
            },
            {
                id: 6,
                title: "Embroidered Beanie",
                description: "Soft knit material, classic cuffed style with custom embroidery.",
                price: "$20.00",
                image: "/images/categories/hats.png",
                tag: null
            }
        ],
        [
            {
                id: 7,
                title: "Structured Snapback",
                description: "Classic design with a flat brim and adjustable snap closure.",
                price: "$28.00",
                image: "/images/categories/hats.png",
                tag: null
            },
            {
                id: 8,
                title: "Eco-Canvas Backpack",
                description: "Sustainable materials with padded laptop sleeve and multiple pockets.",
                price: "$65.00",
                image: "/images/categories/bags.png",
                tag: "Eco"
            },
            {
                id: 9,
                title: "Insulated Tumblr",
                description: "Superior temperature retention with a splash-proof lid.",
                price: "$32.00",
                image: "/images/categories/drinkware.png",
                tag: null
            }
        ]
    ];

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % productSets.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + productSets.length) % productSets.length);
    };

    return (
        <section className="py-20 px-4 md:px-0 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">
                        {t('featured_title')}
                    </h2>
                    <div className="w-24 h-1 bg-black mx-auto rounded-full" />
                </div>

                <div className="relative group/section px-4 md:px-0">
                    {/* Clipping Wrapper */}
                    <div className="overflow-hidden rounded-[2rem]">
                        <div
                            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)]"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {productSets.map((set, setIndex) => (
                                <div key={setIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-shrink-0">
                                    {set.map((product, index) => (
                                        <div key={product.id} className="flex flex-col h-full bg-[#f5f5f7] rounded-[2rem] p-8 transition-transform duration-500 hover:scale-[1.02] cursor-pointer relative group">
                                            {/* Image Container */}
                                            <div className="flex-1 flex items-center justify-center min-h-[300px] mb-8">
                                                <div className="relative w-full h-full aspect-square">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-contain transform transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="text-center flex flex-col items-center">
                                                {product.tag && (
                                                    <span className="text-[#bf4800] text-[12px] font-bold mb-2 uppercase tracking-wide">
                                                        {product.tag}
                                                    </span>
                                                )}
                                                <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-tight max-w-[200px]">
                                                    {product.title}
                                                </h3>
                                                <p className="text-gray-500 text-[14px] mb-6 leading-normal max-w-[240px]">
                                                    {product.description}
                                                </p>
                                                <span className="text-[14px] font-semibold text-gray-900 mt-auto">
                                                    {product.price}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Positioned outside the clipping wrapper but inside max-w-7xl if possible, or allowing overflow */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-0 md:-left-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/section:opacity-100 transition-all duration-300 z-30 hover:bg-gray-50 hover:scale-110 active:scale-95 disabled:hidden"
                        aria-label="Previous Products"
                        disabled={activeIndex === 0}
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-0 md:-right-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/section:opacity-100 transition-all duration-300 z-30 hover:bg-gray-50 hover:scale-110 active:scale-95 disabled:hidden"
                        aria-label="Next Products"
                        disabled={activeIndex === productSets.length - 1}
                    >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-3 mt-12">
                        {productSets.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-gray-900 w-4' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
