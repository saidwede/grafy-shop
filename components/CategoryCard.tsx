import Link from '@/components/LocalizedLink';
import Image from 'next/image';

interface CategoryCardProps {
    title: string;
    imageSrc: string;
    slug: string;
}

export default function CategoryCard({ title, imageSrc, slug }: CategoryCardProps) {
    return (
        <Link href={`/shop?category=${slug}`} className="flex flex-col gap-3 group cursor-pointer">
            <div className="aspect-square bg-[#f5f5f7] rounded-xl overflow-hidden relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 drop-shadow-xl"
                />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </Link>
    );
}
