"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-[#F5F5F7] rounded-3xl overflow-hidden border border-black/5">
                <Image
                    src={images[selectedImage]}
                    alt="Product"
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === index
                            ? 'border-black scale-95 shadow-lg'
                            : 'border-transparent bg-gray-50 hover:border-black/10'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
