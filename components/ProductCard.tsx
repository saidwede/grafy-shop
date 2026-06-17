import Link from '@/components/LocalizedLink';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
    id: string;
    slug: string;
    nameKey: string;
    descriptionKey?: string;
    price: number;
    imageSrc: string;
    category: string;
}

export default function ProductCard({ slug, nameKey, descriptionKey, price, imageSrc, category }: ProductCardProps) {
    const { t } = useLanguage();

    return (
        <Link
            href={`/shop/${slug}`}
            className="flex flex-col h-full bg-[#f5f5f7] rounded-4xl p-8 transition-transform duration-500 hover:scale-[1.02] cursor-pointer relative group"
        >
            {/* Badge */}
            {category && (
                <div className="absolute top-6 left-6 z-10">
                    <span className="px-3 py-1.5 text-neutral-500 text-[10px] uppercase rounded-full">
                        {category}
                    </span>
                </div>
            )}

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center min-h-[300px] mb-8">
                <div className="relative w-full h-full aspect-square">
                    <Image
                        src={imageSrc}
                        alt={t(nameKey)}
                        fill
                        unoptimized
                        className="object-contain transform transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="text-center flex flex-col items-center">
                <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-tight max-w-[200px]">
                    {t(nameKey)}
                </h3>
                <p className="text-gray-500 text-[14px] mb-6 leading-normal line-clamp-2 max-w-[240px]">
                    {descriptionKey ? t(descriptionKey) : t('hero_subtitle').split('.')[0]}
                </p>
                <span className="text-[14px] font-semibold text-gray-900 mt-auto">
                    ${price.toFixed(2)}
                </span>
            </div>
        </Link>
    );
}
