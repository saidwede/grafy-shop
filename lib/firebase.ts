import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

import { ref, uploadString, getDownloadURL } from "firebase/storage";

// Configure Tenant ID
if (process.env.NEXT_PUBLIC_FIREBASE_TENANT_ID) {
    auth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_TENANT_ID;
}

/**
 * Traverses the design structure and offloads any Base64 images to Firebase Storage.
 * Returns an object with processed sides and gallery.
 */
export async function processDesignImages(
    sides: any[], 
    tenantId: string, 
    userId: string, 
    productId: string,
    imageGallery?: Record<string, string[]>,
    mainImage?: string | null
) {
    // Deep clone to avoid mutating the original state
    const processedSides = JSON.parse(JSON.stringify(sides));
    
    // 1. PROCESS SIDES & ELEMENTS
    for (let s = 0; s < processedSides.length; s++) {
        const side = processedSides[s];
        
        // ─── PROCESS COLOR MOCKUPS ───
        if (side.colors) {
            for (let c = 0; c < side.colors.length; c++) {
                const color = side.colors[c];
                if (color.imageSrc && color.imageSrc.startsWith('data:')) {
                    const imageId = `side-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const path = `GrafyShop/${tenantId}/products/${productId}/${imageId}.png`;
                    
                    const storageRef = ref(storage, path);
                    const uploadResult = await uploadString(storageRef, color.imageSrc, 'data_url');
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    
                    color.imageSrc = downloadURL;
                }
            }
        }

        // ─── PROCESS DESIGN ZONE ELEMENTS ───
        if (side.designZone && side.designZone.elements) {
            for (let e = 0; e < side.designZone.elements.length; e++) {
                const element = side.designZone.elements[e];
                if (element.type === 'image' && element.src && element.src.startsWith('data:')) {
                    const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const path = `GrafyShop/${tenantId}/products/${productId}/${imageId}.png`;
                    
                    const storageRef = ref(storage, path);
                    const uploadResult = await uploadString(storageRef, element.src, 'data_url');
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    
                    element.src = downloadURL;
                }
            }
        }
    }

    // 2. PROCESS IMAGE GALLERY (BY COLOR)
    const processedGallery: Record<string, string[]> = {};
    if (imageGallery) {
        for (const [colorId, images] of Object.entries(imageGallery)) {
            // Safety check for mainImage accidentally slipped in
            if (!Array.isArray(images)) continue;

            processedGallery[colorId] = [];
            for (let i = 0; i < images.length; i++) {
                const base64 = images[i];
                if (base64 && base64.startsWith('data:')) {
                    // Unique name for gallery items
                    // We also include the current second to force change
                    const imageId = `gal-${colorId}-${i}-${Math.floor(Date.now() / 1000)}`;
                    const path = `GrafyShop/${tenantId}/products/${productId}/${imageId}.png`;
                    
                    const storageRef = ref(storage, path);
                    const uploadResult = await uploadString(storageRef, base64, 'data_url');
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    processedGallery[colorId].push(downloadURL);
                } else if (base64) {
                    processedGallery[colorId].push(base64);
                }
            }
        }
    }

    // 3. PROCESS MAIN IMAGE OVERRIDE (If provided as Base64)
    let processedMainImage = null;
    if (mainImage) {
        if (mainImage.startsWith('data:')) {
            const path = `GrafyShop/${tenantId}/products/${productId}/custom_preview.png`;
            const storageRef = ref(storage, path);
            const uploadResult = await uploadString(storageRef, mainImage, 'data_url');
            processedMainImage = await getDownloadURL(uploadResult.ref);
        } else {
            processedMainImage = mainImage; // Already a URL
        }
    }
    
    return { processedSides, processedGallery, processedMainImage };
}

export { app, auth, db, storage };
