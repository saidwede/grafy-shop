"use client";

import GrafyEditor from '@/components/GrafyEditor';

export default function CustomizePage() {
    return (
        <div className="h-screen overflow-hidden lg:pt-24">
            <GrafyEditor editMode />
        </div>
    );
}
