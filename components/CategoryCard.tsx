import Image from 'next/image';

interface CategoryCardProps {
    title: string;
    imageSrc: string;
}

export default function CategoryCard({ title, imageSrc }: CategoryCardProps) {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            <div className="aspect-square bg-[#F5F5F7] rounded-xl overflow-hidden relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
    );
}
