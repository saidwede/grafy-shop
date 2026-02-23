"use client";

import ProductCard from './ProductCard';

interface Product {
    id: string;
    slug: string;
    nameKey: string;
    price: number;
    imageSrc: string;
    categoryKey: string;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    nameKey={product.nameKey}
                    price={product.price}
                    imageSrc={product.imageSrc}
                    category={product.categoryKey}
                />
            ))}
        </div>
    );
}
