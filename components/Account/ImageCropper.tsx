"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check, RotateCcw } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

interface Area {
    width: number;
    height: number;
    x: number;
    y: number;
}

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const handleCrop = async () => {
        if (!croppedAreaPixels) return;

        try {
            const img = await createImage(image);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // Set canvas size to the cropped area size
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // Draw the cropped image onto the canvas
            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            // Convert canvas to base64 string
            const base64Image = canvas.toDataURL('image/jpeg', 0.9);
            onCropComplete(base64Image);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-black uppercase tracking-tighter">Crop Your Profile Photo</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adjust and center your image</p>
                    </div>
                    <button 
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 min-h-[400px] bg-neutral-900 group">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteInternal}
                        cropShape="round"
                        showGrid={false}
                    />
                </div>

                {/* Controls */}
                <div className="p-8 bg-white space-y-8">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-6">
                        <ZoomOut size={18} className="text-gray-300" />
                        <div className="flex-1 relative h-2 bg-gray-100 rounded-full group cursor-pointer">
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => onZoomChange(Number(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
                                style={{ width: `${((zoom - 1) / 2) * 100}%` }}
                            />
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-lg transition-all"
                                style={{ left: `calc(${((zoom - 1) / 2) * 100}% - 8px)` }}
                            />
                        </div>
                        <ZoomIn size={18} className="text-gray-300" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setZoom(1);
                                setCrop({ x: 0, y: 0 });
                            }}
                            className="flex-1 py-4 bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-100 hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                        <button
                            onClick={handleCrop}
                            className="flex-2 py-4 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95"
                        >
                            <Check size={16} />
                            Confirm & Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
