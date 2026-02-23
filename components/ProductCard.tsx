import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
    id: string;
    slug: string;
    nameKey: string;
    price: number;
    imageSrc: string;
    category: string;
}

export default function ProductCard({ slug, nameKey, price, imageSrc, category }: ProductCardProps) {
    const { t } = useLanguage();

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
            {/* Image Container */}
            <Link href={`/shop/${slug}`} className="relative aspect-4/5 bg-[#F5F5F7] overflow-hidden">





                <Image
                    src={imageSrc}
                    alt={t(nameKey)}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />


                {/* Overlays */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <button className="p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-black hover:text-white transition-colors shadow-sm">
                        <Heart size={18} />
                    </button>
                    <button className="p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-black hover:text-white transition-colors shadow-sm">
                        <ShoppingCart size={18} />
                    </button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {category}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-black transition-colors">
                        {t(nameKey)}
                    </h3>
                    <span className="font-black text-lg text-black shrink-0">
                        ${price.toFixed(2)}
                    </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {t('hero_subtitle').split('.')[0]}.
                </p>

                <Link href={`/shop/${slug}`}>
                    <button className="w-full py-3 bg-gray-50 text-black text-xs font-bold rounded-xl border border-black/5 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                        {t('arrivals_cta')}
                    </button>
                </Link>
            </div>
        </div>
    );
}
