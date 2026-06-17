"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Stage, Layer, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import EditText from './EditText';
import EditImage from './EditImage';
import EditSVG from './EditSVG';
import EditZone from './EditZone';
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/context/LanguageContext';
import {
    ArrowLeft,
    AlertTriangle,
    Undo2,
    Redo2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Tag,
    Plus,
    Minus,
    ShoppingCart,
    Type,
    Shapes,
    Maximize,
    X,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Italic,
    Underline,
    Upload,
    FlipHorizontal,
    RotateCcw,
    LayoutGrid,
    ImagePlus,
    Image as ImageIcon,
    Search,
    Heart,
    Info,
    Save,
    Share,
    CircleHelp,
    ShieldCheck,
    Copy,
    Trash2,
    Edit2,
    RefreshCw,
    ChevronUp,
    ChevronDown,
    AlignStartHorizontal,
    AlignEndHorizontal,
    AlignStartVertical,
    AlignEndVertical,
    AlignCenterVertical,
    AlignCenterHorizontal,
    FlipVertical,
    RotateCw,
    Settings,
    Loader2
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '@/constants/products';
import Image from 'next/image';

type Tool = 'select' | 'text' | 'image' | 'art' | 'shapes';

interface DesignArea {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ProductSide {
    id: string; // e.g. 'front', 'back'
    name: string;
    nameFr: string;
    designZone: DesignZone;
    colors: {
        id: string;
        name: string;
        hex: string;
        imageSrc: string;
    }[];
}

interface DesignZone {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    elements: any[];
}

// Legacy SIDES constant removed in favor of dynamic variation state

const COLORS = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
const FONT_FAMILIES = [
    'Inter',
    'Playfair Display',
    'Roboto Mono',
    'Montserrat',
    'Poppins',
    'Open Sans',
    'Lora',
    'Raleway',
    'Oswald',
    'Merriweather'
];

const FONT_WEIGHTS: Record<string, string[]> = {
    'Inter': ['400', '500', '600', '700', '800', '900'],
    'Playfair Display': ['400', '500', '600', '700', '800', '900'],
    'Roboto Mono': ['400', '500', '600', '700'],
    'Montserrat': ['300', '400', '500', '600', '700', '800', '900'],
    'Poppins': ['300', '400', '500', '600', '700', '800', '900'],
    'Open Sans': ['300', '400', '500', '600', '700', '800'],
    'Lora': ['400', '500', '600', '700'],
    'Raleway': ['300', '400', '500', '600', '700', '800', '900'],
    'Oswald': ['200', '300', '400', '500', '600', '700'],
    'Merriweather': ['300', '400', '700', '900'],
};

const WEIGHT_NAMES: Record<string, Record<string, string>> = {
    '100': { en: 'Thin', fr: 'Fin' },
    '200': { en: 'Extra Light', fr: 'Extra Léger' },
    '300': { en: 'Light', fr: 'Léger' },
    '400': { en: 'Regular', fr: 'Régulier' },
    '500': { en: 'Medium', fr: 'Medium' },
    '600': { en: 'Semi Bold', fr: 'Semi Bold' },
    '700': { en: 'Bold', fr: 'Gras' },
    '800': { en: 'Extra Bold', fr: 'Extra Gras' },
    '900': { en: 'Black', fr: 'Extra Noir' },
};
const SHAPES_LIST = [
    { label: 'Circle', path: "M 24, 24 m -20, 0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0" },
    { label: 'Square', path: "M 8,8 H 40 V 40 H 8 Z" },
    { label: 'Triangle', path: "M 24,8 L 40,40 L 8,40 Z" },
    { label: 'Star', path: "M 24,4 L 30,18 L 44,18 L 33,27 L 37,41 L 24,32 L 11,41 L 15,27 L 4,18 L 18,18 Z" },
    { label: 'Diamond', path: "M 24,8 L 40,24 L 24,40 L 8,24 Z" },
    { label: 'Heart', path: "M 24,12 C 24,12 24,4 12,4 C 4,4 4,16 4,16 C 4,24 24,38 24,38 C 24,38 44,24 44,16 C 44,16 44,4 36,4 C 24,4 24,12 24,12 Z" },
    { label: 'Hexagon', path: "M 24,4 L 41,14 V 34 L 24,44 L 7,34 V 14 Z" },
    { label: 'Octagon', path: "M 32,4 H 16 L 4,16 V 32 L 16,44 H 32 L 44,32 V 16 Z" }
];
const RECENT_IMAGES = [
    'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
];

const ADD_TOOLS: { id: Tool; icon: React.ReactElement; labelFr: string; labelEn: string }[] = [
    { id: 'image', icon: <ImagePlus size={26} strokeWidth={1.5} />, labelFr: 'Images', labelEn: 'Images' },
    { id: 'text', icon: <Type size={26} strokeWidth={1.5} />, labelFr: 'Texte', labelEn: 'Text' },
    { id: 'art', icon: <LayoutGrid size={26} strokeWidth={1.5} />, labelFr: 'Motifs', labelEn: 'Patterns' },
    { id: 'shapes', icon: <Shapes size={26} strokeWidth={1.5} />, labelFr: 'Formes', labelEn: 'Shapes' },
];

export default function GrafyEditor({
    editMode = false,
    initialData = undefined,
    onSave = undefined,
    isSaving = false
}: {
    editMode?: boolean;
    initialData?: any;
    onSave?: (data: any, thumbnail: string, mainImage?: string | null) => Promise<void>;
    isSaving?: boolean;
}) {
    const { t, locale } = useLanguage();
    const [showAddSheet, setShowAddSheet] = useState(false)    // ══════════════ PRODUCT STATE (NEW SIDE-CENTRIC MODEL) ══════════════
    const [sides, setSides] = useState<ProductSide[]>(initialData?.sides || [
        {
            id: 'front',
            name: 'Front',
            nameFr: 'Face',
            designZone: {
                id: 'design-zone',
                x: 150,
                y: 150,
                width: 200,
                height: 200,
                elements: []
            },
            colors: [
                { id: 'white', name: 'White', hex: '#FFFFFF', imageSrc: '' }
            ]
        }
    ]);
    const [activeColorId, setActiveColorId] = useState(sides[0].colors[0].id);
    const [activeSideId, setActiveSideId] = useState(sides[0].id);

    // Current active data
    const activeSide = sides.find(s => s.id === activeSideId) || sides[0];
    const activeColorImg = activeSide.colors.find(c => c.id === activeColorId) || activeSide.colors[0];

    // These states are kept for performance and compatibility with existing handlers
    const [elements, setElements] = useState<any[]>(activeSide.designZone.elements);
    const [designZone, setDesignZone] = useState<DesignArea>(activeSide.designZone);
    const [activeProduct, setActiveProduct] = useState(MOCK_PRODUCTS.find(p => p.slug === 'premium-pullover-hoodie') || MOCK_PRODUCTS[0]);
    const [productImg, productImgStatus] = useImage(activeColorImg?.imageSrc || '', 'anonymous');

    // ─── MANUAL DETAILS & CUSTOM PREVIEW ───
    const [productTitle, setProductTitle] = useState(initialData?.productName || '');
    const [productPrice, setProductPrice] = useState(initialData?.productPrice || '');
    const [mainImage, setMainImage] = useState<string | null>(null);
    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const [isSavingInEditor, setIsSavingInEditor] = useState(false);
    const [hideLimits, setHideLimits] = useState(false);
    const [isPreloading, setIsPreloading] = useState(true);
    const preloadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

    // ─── DESIGN FRAME DIMENSIONS ───
    const [frameWidth, setFrameWidth] = useState(initialData?.frameWidth || 1000);
    const [frameHeight, setFrameHeight] = useState(initialData?.frameHeight || 1000);

    // One-time preloading for ALL side/color variations
    useEffect(() => {
        let isMounted = true;

        const initPreload = async () => {
            setIsPreloading(true);
            const urls = sides.flatMap(s => s.colors.map(c => c.imageSrc)).filter(Boolean);
            const uniqueUrls = Array.from(new Set(urls));

            await Promise.all(uniqueUrls.map(url => {
                if (preloadedImagesRef.current[url]) return Promise.resolve();

                return new Promise((resolve) => {
                    const img = new window.Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        if (isMounted) preloadedImagesRef.current[url] = img;
                        resolve(null);
                    };
                    img.onerror = resolve;
                    img.src = url;
                });
            }));

            if (isMounted) {
                setIsPreloading(false);
            }
        };

        initPreload();
        return () => { isMounted = false; };
    }, [initialData?.id, sides.length]); // Re-run if product ID or side structure changes

    // Helper for per-save stability if needed (optional since cached)
    const preloadMockupImages = async () => {
        const urls = sides.flatMap(s => s.colors.map(c => c.imageSrc)).filter(Boolean);
        const uniqueUrls = Array.from(new Set(urls));

        await Promise.all(uniqueUrls.map(url => {
            return new Promise((resolve) => {
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.onload = resolve;
                img.onerror = resolve;
                img.src = url;
            });
        }));
    };

    // Sync active state back to the sides array
    useEffect(() => {
        setSides(prev => prev.map(s => {
            if (s.id === activeSideId) {
                return {
                    ...s,
                    designZone: {
                        ...s.designZone,
                        elements: elements,
                        x: designZone.x,
                        y: designZone.y,
                        width: designZone.width,
                        height: designZone.height
                    }
                };
            }
            return s;
        }));
    }, [elements, designZone, activeSideId]);

    // Handle switching color/side
    const handleSwitchSide = (sideId: string) => {
        setSelectedId(null);
        const nextSide = sides.find(s => s.id === sideId);
        if (nextSide) {
            setElements(nextSide.designZone.elements);
            setDesignZone(nextSide.designZone);
            setActiveSideId(sideId);
        }
    };

    const handleSwitchColor = (colorId: string) => {
        setSelectedId(null);
        setActiveColorId(colorId);
    };
    const [addTool, setAddTool] = useState<Tool | null>(null);
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(24);
    const [artTab, setArtTab] = useState<'stickers' | 'patterns'>('stickers');
    const [stageDimensions, setStageDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const addSideFileInputRef = useRef<HTMLInputElement>(null);
    const activeSideFileInputRef = useRef<HTMLInputElement>(null);
    const mainImageFileInputRef = useRef<HTMLInputElement>(null);

    // Konva Canvas state
    const [offZoneElementId, setOffZoneElementId] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [hasCenteredInitial, setHasCenteredInitial] = useState(false);
    const hasMovedRef = useRef<boolean>(false);

    // Undo/Redo history
    const [history, setHistory] = useState<{ sides: ProductSide[], activeSideId: string, activeColorId: string }[]>([]);
    const [future, setFuture] = useState<{ sides: ProductSide[], activeSideId: string, activeColorId: string }[]>([]);
    const isUndoingRef = useRef(false);

    const saveToHistory = useCallback(() => {
        if (isUndoingRef.current) return;
        setHistory(prev => [...prev.slice(-49), {
            sides: JSON.parse(JSON.stringify(sides)),
            activeSideId,
            activeColorId
        }]);
        setFuture([]);
    }, [sides, activeSideId, activeColorId]);

    const undo = useCallback(() => {
        if (history.length === 0) return;

        isUndoingRef.current = true;
        const snapshot = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setFuture(prev => [{
            sides: JSON.parse(JSON.stringify(sides)),
            activeSideId,
            activeColorId
        }, ...prev]);

        // RESTORE STATE
        setSides(snapshot.sides);
        setActiveSideId(snapshot.activeSideId);
        setActiveColorId(snapshot.activeColorId);

        const activeInSnap = snapshot.sides.find(s => s.id === snapshot.activeSideId) || snapshot.sides[0];
        setElements(activeInSnap.designZone.elements);
        setDesignZone(activeInSnap.designZone);

        setTimeout(() => { isUndoingRef.current = false; }, 10);
    }, [history, sides, activeSideId, activeColorId]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        isUndoingRef.current = true;
        const snapshot = future[0];
        setFuture(prev => prev.slice(1));
        setHistory(prev => [...prev, {
            sides: JSON.parse(JSON.stringify(sides)),
            activeSideId,
            activeColorId
        }]);

        // RESTORE STATE
        setSides(snapshot.sides);
        setActiveSideId(snapshot.activeSideId);
        setActiveColorId(snapshot.activeColorId);

        const activeInSnap = snapshot.sides.find(s => s.id === snapshot.activeSideId) || snapshot.sides[0];
        setElements(activeInSnap.designZone.elements);
        setDesignZone(activeInSnap.designZone);

        setTimeout(() => { isUndoingRef.current = false; }, 10);
    }, [future, sides, activeSideId, activeColorId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // Product selection sheet state
    const [showProductSheet, setShowProductSheet] = useState(false);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [selectedProductCategory, setSelectedProductCategory] = useState('All');

    // More and Details sheets state
    const [showMoreSheet, setShowMoreSheet] = useState(false);
    const [showDetailsSheet, setShowDetailsSheet] = useState(false);
    const [showProductSettingsSheet, setShowProductSettingsSheet] = useState(false);
    const [productColor, setProductColor] = useState(COLORS[1]); // Default to second color (usually white)
    const [showColorSheet, setShowColorSheet] = useState(false);
    const [showAllRecent, setShowAllRecent] = useState(false);

    // Add color modal state
    const [showAddColorModal, setShowAddColorModal] = useState(false);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    // Edit color modal state
    const [showEditColorModal, setShowEditColorModal] = useState(false);
    const [editingColorId, setEditingColorId] = useState<string | null>(null);
    const [editColorName, setEditColorName] = useState('');
    const [editColorHex, setEditColorHex] = useState('#000000');

    // Add side modal state
    const [showAddSideModal, setShowAddSideModal] = useState(false);
    const [newSideName, setNewSideName] = useState('');
    const [newSideNameFr, setNewSideNameFr] = useState('');
    const [newSideImageSrc, setNewSideImageSrc] = useState('');

    // Edit side modal state
    const [showEditSideModal, setShowEditSideModal] = useState(false);
    const [editingSideId, setEditingSideId] = useState<string | null>(null);
    const [editSideName, setEditSideName] = useState('');
    const [editSideNameFr, setEditSideNameFr] = useState('');
    const [newSizeInput, setNewSizeInput] = useState('');


    // Desktop tool state
    const [desktopActiveTool, setDesktopActiveTool] = useState<Tool | null>(null);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (desktopActiveTool) {
            const timer = setTimeout(() => setContentVisible(true), 300);
            return () => clearTimeout(timer);
        } else {
            setContentVisible(false);
        }
    }, [desktopActiveTool]);

    // Previous side ID to guard synchronization
    const prevSideIdRef = useRef(activeSideId);

    // Initial centering of the design zone (FRAME-RELATIVE)
    useEffect(() => {
        // Only center if it's a NEW product (no initialSides)
        const isNewProduct = !initialData?.sides && !initialData?.colors;
        if (!hasCenteredInitial && isNewProduct) {
            setDesignZone(prev => ({
                ...prev,
                x: (frameWidth - prev.width) / 2,
                y: (frameHeight - prev.height) / 2
            }));
            setHasCenteredInitial(true);
        } else if (!hasCenteredInitial && !isNewProduct) {
            // For existing products, just mark as "centered" so we don't accidentally center later
            setHasCenteredInitial(true);
        }
    }, [frameWidth, frameHeight, hasCenteredInitial, initialData, designZone.width, designZone.height]);

    // synchronization: keep 'sides' array updated with local design state
    useEffect(() => {
        if (!activeSideId) return;

        // GUARD: If side just switched, don't sync back to 'sides' yet
        // because elements/designZone might still be from the previous side
        if (prevSideIdRef.current !== activeSideId) {
            prevSideIdRef.current = activeSideId;
            return;
        }

        setSides(prevSides => prevSides.map(side => {
            if (side.id === activeSideId) {
                return {
                    ...side,
                    designZone: {
                        ...designZone,
                        elements: elements
                    }
                };
            }
            return side;
        }));
    }, [elements, designZone, activeSideId]);

    // Dynamic stage sizing
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setStageDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // ══════════════ INITIAL DATA LOADING (NEW MODEL) ══════════════
    useEffect(() => {
        if (initialData && initialData.sides) {
            setSides(initialData.sides);
            if (initialData.activeColorId) setActiveColorId(initialData.activeColorId);
            if (initialData.activeSideId) setActiveSideId(initialData.activeSideId);

            // ─── LOAD MANUAL DETAILS ───
            if (initialData.productName) setProductTitle(initialData.productName);
            if (initialData.productPrice) setProductPrice(initialData.productPrice.toString());
            if (initialData.mainImage) setMainImage(initialData.mainImage);
            else if (initialData.thumbnail) setMainImage(initialData.thumbnail); // Fallback for old previews

            if (initialData.frameWidth) setFrameWidth(initialData.frameWidth);
            if (initialData.frameHeight) setFrameHeight(initialData.frameHeight);

            // Set elements/designZone for the active side
            const activeS = initialData.sides.find((s: any) => s.id === (initialData.activeSideId || initialData.sides[0].id));
            if (activeS) {
                setElements(activeS.designZone.elements || []);
                setDesignZone(activeS.designZone);
            }
        } else if (initialData && initialData.colors) {
            // ... (rest of backward compatibility for colors)
            // Still check for top-level metadata even in legacy items
            if (initialData.productName) setProductTitle(initialData.productName);
            if (initialData.productPrice) setProductPrice(initialData.productPrice.toString());
            if (initialData.thumbnail) setMainImage(initialData.thumbnail);

            const transformedSides: ProductSide[] = [];
            // ... (rest of the mapping logic)
            const sideIds = ['front', 'back']; // Common side IDs

            sideIds.forEach(sideId => {
                const colorsForSide: { id: string, name: string, hex: string, imageSrc: string }[] = [];
                let designZoneForSide: DesignZone | null = null;

                initialData.colors.forEach((c: any) => {
                    const side = c.sides.find((s: any) => s.id === sideId);
                    if (side) {
                        colorsForSide.push({
                            id: c.id,
                            name: c.name || c.id,
                            hex: c.hex || '#FFFFFF',
                            imageSrc: side.imageSrc
                        });
                        if (!designZoneForSide) {
                            designZoneForSide = {
                                ...side.designZone,
                                elements: side.elements || []
                            };
                        }
                    }
                });

                if (designZoneForSide) {
                    transformedSides.push({
                        id: sideId,
                        name: sideId.charAt(0).toUpperCase() + sideId.slice(1),
                        nameFr: sideId === 'front' ? 'Face' : 'Dos',
                        designZone: designZoneForSide,
                        colors: colorsForSide
                    });
                }
            });

            if (transformedSides.length > 0) {
                setSides(transformedSides);
                if (initialData.activeColorId) setActiveColorId(initialData.activeColorId);
                if (initialData.activeSideId) setActiveSideId(initialData.activeSideId);

                const activeS = transformedSides.find(s => s.id === initialData.activeSideId) || transformedSides[0];
                setElements(activeS.designZone.elements);
                setDesignZone(activeS.designZone);
            }
        }
    }, [initialData]);

    const handleSave = async () => {
        if (!onSave || !stageRef.current) return;

        setIsSavingInEditor(true);
        try {
            const gallery: Record<string, string[]> = {};
            const originalColorId = activeColorId;
            const originalSideId = activeSideId;

            // 2. Prep for clean snapshots
            setHideLimits(true);
            setSelectedId(null); // Remove selection boxes
            await new Promise(resolve => setTimeout(resolve, 150)); // Wait for render

            // ─── GENERATE FULL GALLERY (Color Matrix) ───
            const colorIds = sides[0].colors.map(c => c.id);
            for (const colorId of colorIds) {
                gallery[colorId] = [];
                handleSwitchColor(colorId);
                await new Promise(resolve => setTimeout(resolve, 100));

                for (const side of sides) {
                    handleSwitchSide(side.id);
                    // Force a small wait for the design elements to re-render on the new side
                    await new Promise(resolve => setTimeout(resolve, 100));

                    const sideScreenshot = stageRef.current.toDataURL({
                        pixelRatio: 2,
                        mimeType: 'image/png'
                    });
                    gallery[colorId].push(sideScreenshot);
                }
            }

            // Restore original view and UI limits
            handleSwitchColor(originalColorId);
            handleSwitchSide(originalSideId);
            setHideLimits(false);

            // Final Logic: 
            // 1. The 2nd argument (thumbnail) is ALWAYS the fresh design snapshot.
            // 2. The 3rd argument is the mainImage (Base64 or URL).
            const canvasPreview = gallery[colorIds[0]][0];

            const saveData = {
                sides,
                activeColorId,
                activeSideId,
                productName: productTitle || 'Untitled Product',
                productPrice: productPrice || '0.00',
                imageGallery: gallery,
                frameWidth,
                frameHeight
            };

            if (onSave) {
                await onSave(saveData, canvasPreview, mainImage);
            }
        } finally {
            setIsSavingInEditor(false);
            setHideLimits(false);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const changeImageInputRef = useRef<HTMLInputElement>(null);
    const stageRef = useRef<any>(null);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [showElementColorPicker, setShowElementColorPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showWeightPicker, setShowWeightPicker] = useState(false);
    const [showPositionPicker, setShowPositionPicker] = useState(false);
    const fontPickerRef = useRef<HTMLDivElement>(null);
    const weightPickerRef = useRef<HTMLDivElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const positionPickerRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const customColorInputRef = useRef<HTMLInputElement>(null);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

    const updatePickerPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current && toolbarRef.current) {
            const triggerRect = ref.current.getBoundingClientRect();
            const toolbarRect = toolbarRef.current.getBoundingClientRect();
            // Positioning the picker at the horizontal center of the ENTIRE toolbar
            setPickerPosition({
                top: triggerRect.bottom + window.scrollY,
                left: toolbarRect.left + toolbarRect.width / 2 + window.scrollX
            });
        }
    };

    // Close dropdowns when clicking outside or scrolling
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const isDropdownPortal = (target as HTMLElement).closest('[data-dropdown-portal="true"]');

            if (isDropdownPortal) return;

            if (fontPickerRef.current && !fontPickerRef.current.contains(target)) {
                setShowFontPicker(false);
            }
            if (weightPickerRef.current && !weightPickerRef.current.contains(target)) {
                setShowWeightPicker(false);
            }
            if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
                setShowElementColorPicker(false);
            }
            if (positionPickerRef.current && !positionPickerRef.current.contains(target)) {
                setShowPositionPicker(false);
            }
        }

        const handleScroll = (event: Event) => {
            const target = event.target as Node;
            if ((target as HTMLElement).closest?.('[data-dropdown-portal="true"]')) return;

            setShowFontPicker(false);
            setShowWeightPicker(false);
            setShowElementColorPicker(false);
            setShowPositionPicker(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const handleAddText = () => {
        saveToHistory();
        const id = `text-${Date.now()}`;
        setElements([...elements, {
            id,
            type: 'text',
            text: 'New Text',
            x: designZone.width / 2,
            y: designZone.height / 2,
            fontSize: 24,
            fill: selectedColor,
            fontFamily: selectedFont,
            fontWeight: '400',
        }]);
        setSelectedId(id);
    };

    const handleAddImage = (src: string) => {
        saveToHistory();
        const id = `image-${Date.now()}`;
        setElements([...elements, {
            id,
            type: 'image',
            src,
            x: designZone.width / 2,
            y: designZone.height / 2,
            scaleX: 1,
            scaleY: 1,
        }]);
        setSelectedId(id);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result as string;
                handleAddImage(src);
                closeAdd();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSVG = (data: string) => {
        saveToHistory();
        const id = `svg-${Date.now()}`;
        setElements([...elements, {
            id,
            type: 'svg',
            data,
            x: designZone.width / 2,
            y: designZone.height / 2,
            fill: selectedColor,
            scaleX: 1,
            scaleY: 1,
        }]);
        setSelectedId(id);
    };

    const handleSelect = (id: string | null) => {
        if (hasMovedRef.current) return;
        setSelectedId(id);
    };

    const handleElementChange = (id: string, newProps: any) => {
        saveToHistory();
        setElements(elements.map(el => el.id === id ? newProps : el));

        // Check if element is off-zone
        setTimeout(() => {
            if (!stageRef.current) return;
            const node = stageRef.current.findOne('#' + id);
            if (!node) return;
            const parent = node.getParent();
            if (!parent) return;

            const box = node.getClientRect({ relativeTo: parent });
            const isOff = (
                box.x + box.width < 0 ||
                box.x > designZone.width ||
                box.y + box.height < 0 ||
                box.y > designZone.height
            );

            if (isOff) {
                setOffZoneElementId(id);
            } else if (offZoneElementId === id) {
                setOffZoneElementId(null);
            }
        }, 0);
    };

    const updateSelected = (updates: any) => {
        if (!selectedId) return;
        handleElementChange(selectedId, { ...elements.find(e => e.id === selectedId), ...updates });
    };

    const handleQuickPosition = (position: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => {
        if (!selectedId || !stageRef.current || selectedId === designZone.id) return;

        const stage = stageRef.current;
        const node = stage.findOne('#' + selectedId);
        if (!node) return;
        const parent = node.getParent();
        if (!parent) return;

        const box = node.getClientRect({ relativeTo: parent });
        const stageWidth = designZone.width;
        const stageHeight = designZone.height;

        let newX = node.x();
        let newY = node.y();

        const nodeX = node.x();
        const nodeY = node.y();

        switch (position) {
            case 'left':
                newX = nodeX - box.x;
                break;
            case 'right':
                newX = nodeX + (stageWidth - (box.x + box.width));
                break;
            case 'top':
                newY = nodeY - box.y;
                break;
            case 'bottom':
                newY = nodeY + (stageHeight - (box.y + box.height));
                break;
            case 'center-h':
                newX = nodeX + (stageWidth / 2 - (box.x + box.width / 2));
                break;
            case 'center-v':
                newY = nodeY + (stageHeight / 2 - (box.y + box.height / 2));
                break;
        }

        updateSelected({ x: newX, y: newY });
    };

    const handleFlip = (direction: 'horizontal' | 'vertical') => {
        const element = elements.find(el => el.id === selectedId);
        if (!element || (element.type !== 'image' && element.type !== 'svg')) return;

        const updates: any = {};
        if (direction === 'horizontal') {
            updates.scaleX = (element.scaleX || 1) * -1;
        } else {
            updates.scaleY = (element.scaleY || 1) * -1;
        }

        updateSelected(updates);
    };

    const handleToggleStyle = (styleToToggle: 'bold' | 'italic') => {
        if (!selectedId) return;
        const el = elements.find(e => e.id === selectedId);
        if (!el || el.type !== 'text') return;
        const currentStyle = el.fontStyle || 'normal';
        const hasStyle = currentStyle.includes(styleToToggle);
        let newStyle = currentStyle;
        if (hasStyle) {
            newStyle = currentStyle.replace(styleToToggle, '').replace(/\s+/g, ' ').trim() || 'normal';
        } else {
            newStyle = currentStyle === 'normal' ? styleToToggle : currentStyle + ' ' + styleToToggle;
        }
        updateSelected({ fontStyle: newStyle });
    };

    const handleCycleAlign = () => {
        if (!selectedId) return;
        const el = elements.find(e => e.id === selectedId);
        if (!el || el.type !== 'text') return;
        const aligns = ['left', 'center', 'right'];
        const current = el.align || 'left';
        const nextIndex = (aligns.indexOf(current) + 1) % aligns.length;
        updateSelected({ align: aligns[nextIndex] });
    };

    const handleToggleUnderline = () => {
        if (!selectedId) return;
        const el = elements.find(e => e.id === selectedId);
        if (!el || el.type !== 'text') return;
        const current = el.textDecoration || '';
        updateSelected({ textDecoration: current === 'underline' ? '' : 'underline' });
    };

    const handleMoveLayer = (direction: 'up' | 'down') => {
        if (!selectedId) return;
        const index = elements.findIndex(el => el.id === selectedId);
        if (index === -1) return;

        const newElements = [...elements];
        if (direction === 'up' && index < newElements.length - 1) {
            const temp = newElements[index];
            newElements[index] = newElements[index + 1];
            newElements[index + 1] = temp;
            setElements(newElements);
        } else if (direction === 'down' && index > 0) {
            const temp = newElements[index];
            newElements[index] = newElements[index - 1];
            newElements[index - 1] = temp;
            setElements(newElements);
        }
    };

    const handleDuplicate = () => {
        if (!selectedId) return;
        saveToHistory();
        const el = elements.find(el => el.id === selectedId);
        if (!el) return;

        const newId = `${el.type}-${Date.now()}`;
        const newEl = {
            ...el,
            id: newId,
            x: el.x + 20,
            y: el.y + 20,
        };
        setElements([...elements, newEl]);
        setSelectedId(newId);
    };

    const handleDelete = () => {
        if (!selectedId) return;
        saveToHistory();
        setElements(elements.filter(el => el.id !== selectedId));
        setSelectedId(null);
    };

    const handleChangeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedId) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result as string;
                handleElementChange(selectedId, { ...elements.find(el => el.id === selectedId), src });
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleStageClick = (e: any) => {
        if (hasMovedRef.current) return;

        const clickedOnEmpty =
            e.target === e.target.getStage() ||
            e.target.name() === 'product-mockup' ||
            e.target.name() === 'frame-group';

        if (clickedOnEmpty) {
            setSelectedId(null);
        }
    };

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const oldScale = stageScale;
        const pointer = e.target.getStage().getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stagePos.x) / oldScale,
            y: (pointer.y - stagePos.y) / oldScale,
        };

        let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        newScale = Math.max(1, Math.min(newScale, 6));

        const newX = pointer.x - mousePointTo.x * newScale;
        const newY = pointer.y - mousePointTo.y * newScale;

        const PAN_MARGIN = Math.min(stageDimensions.width / 2, 100 * (stageScale - 1));
        const minX = Math.min(0, stageDimensions.width - stageDimensions.width * newScale) - PAN_MARGIN;
        const maxX = Math.max(0, stageDimensions.width - stageDimensions.width * newScale) + PAN_MARGIN;
        const minY = Math.min(0, stageDimensions.height - stageDimensions.height * newScale) - PAN_MARGIN;
        const maxY = Math.max(0, stageDimensions.height - stageDimensions.height * newScale) + PAN_MARGIN;

        setStageScale(newScale);
        setStagePos({
            x: Math.max(minX, Math.min(newX, maxX)),
            y: Math.max(minY, Math.min(newY, maxY)),
        });
    };

    // Pinch-to-zoom and pan for mobile
    const lastDist = useRef(0);
    const lastCenter = useRef<{ x: number, y: number } | null>(null);

    const handleTouchMove = (e: any) => {
        if (e.evt.cancelable) e.evt.preventDefault();

        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        // For single touch, if we are touching a draggable element or transformer, let Konva handle it
        if (!touch2 && e.target !== e.target.getStage()) {
            let node = e.target;
            let isInteractive = false;
            while (node && node !== e.target.getStage()) {
                if (node.draggable() || node.className === 'Transformer' || node.getParent()?.className === 'Transformer') {
                    isInteractive = true;
                    break;
                }
                node = node.getParent();
            }
            if (isInteractive) return;
        }

        if (touch1 && touch2) {
            // Stop any Konva drag if user is using two fingers to zoom
            let node = e.target;
            while (node && typeof node.isDragging === 'function' && node !== e.target.getStage()) {
                if (node.isDragging()) {
                    node.stopDrag();
                }
                node = node.getParent();
            }
            // Pinch to zoom
            const dist = Math.sqrt(
                Math.pow(touch1.clientX - touch2.clientX, 2) +
                Math.pow(touch1.clientY - touch2.clientY, 2)
            );
            const center = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2,
            };

            if (!lastDist.current) {
                lastDist.current = dist;
                lastCenter.current = center;
                return;
            }

            const scaleBy = dist / lastDist.current;
            let newScale = stageScale * scaleBy;
            newScale = Math.max(1, Math.min(newScale, 6));

            // Pan while zooming (optional but smoother)
            const dx = center.x - (lastCenter.current?.x || center.x);
            const dy = center.y - (lastCenter.current?.y || center.y);

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3 || Math.abs(scaleBy - 1) > 0.05) {
                hasMovedRef.current = true;
            }

            const newStagePosX = stagePos.x + dx;
            const newStagePosY = stagePos.y + dy;

            const pointTo = {
                x: (center.x - newStagePosX) / stageScale,
                y: (center.y - newStagePosY) / stageScale,
            };

            const PAN_MARGIN = Math.min(stageDimensions.width / 2, 100 * (stageScale - 1));
            const minX = Math.min(0, stageDimensions.width - stageDimensions.width * newScale) - PAN_MARGIN;
            const maxX = Math.max(0, stageDimensions.width - stageDimensions.width * newScale) + PAN_MARGIN;
            const minY = Math.min(0, stageDimensions.height - stageDimensions.height * newScale) - PAN_MARGIN;
            const maxY = Math.max(0, stageDimensions.height - stageDimensions.height * newScale) + PAN_MARGIN;

            setStageScale(newScale);
            setStagePos({
                x: Math.max(minX, Math.min(center.x - pointTo.x * newScale, maxX)),
                y: Math.max(minY, Math.min(center.y - pointTo.y * newScale, maxY)),
            });

            lastDist.current = dist;
            lastCenter.current = center;
        } else if (touch1) {
            // Single touch pan
            if (!lastCenter.current) {
                lastCenter.current = { x: touch1.clientX, y: touch1.clientY };
                return;
            }
            const dx = touch1.clientX - lastCenter.current.x;
            const dy = touch1.clientY - lastCenter.current.y;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMovedRef.current = true;
            }

            const PAN_MARGIN = Math.min(stageDimensions.width / 2, 100 * (stageScale - 1));
            const minX = Math.min(0, stageDimensions.width - stageDimensions.width * stageScale) - PAN_MARGIN;
            const maxX = Math.max(0, stageDimensions.width - stageDimensions.width * stageScale) + PAN_MARGIN;
            const minY = Math.min(0, stageDimensions.height - stageDimensions.height * stageScale) - PAN_MARGIN;
            const maxY = Math.max(0, stageDimensions.height - stageDimensions.height * stageScale) + PAN_MARGIN;

            setStagePos({
                x: Math.max(minX, Math.min(stagePos.x + dx, maxX)),
                y: Math.max(minY, Math.min(stagePos.y + dy, maxY)),
            });
            lastCenter.current = { x: touch1.clientX, y: touch1.clientY };
        }
    };

    const handleTouchEnd = () => {
        lastDist.current = 0;
        lastCenter.current = null;
        setTimeout(() => {
            hasMovedRef.current = false;
        }, 100);
    };

    // Removed redundant activeSide declaration as it is now defined above with the variation state
    const sideLabel = locale === 'fr' ? activeSide.nameFr : activeSide.name;

    const prevSide = () => {
        const currentIndex = sides.findIndex(s => s.id === activeSideId);
        const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
        handleSwitchSide(sides[prevIndex].id);
    };

    const nextSide = () => {
        const currentIndex = sides.findIndex(s => s.id === activeSideId);
        const nextIndex = (currentIndex + 1) % sides.length;
        handleSwitchSide(sides[nextIndex].id);
    };

    const openAddTool = (tool: Tool) => {
        handleSelect(null);
        setEditingTextId(null);
        if (tool === 'text') {
            handleAddText();
            setShowAddSheet(false);
            return;
        }
        setAddTool(tool);
    }
    const closeAdd = () => { setShowAddSheet(false); setAddTool(null); }

    // ─── Properties content ─────────────────────────────────────────────────
    const ToolContent = ({ tool }: { tool: Tool | null }) => (
        <>
            {tool === 'text' && (
                <div className="p-6 text-center text-gray-500 italic">
                    {t('editor_text_modal_deprecated') || 'Text is now added directly to the canvas.'}
                </div>
            )}
            {tool === 'image' && (
                <div className="p-6 space-y-6">
                    {!showAllRecent ? (
                        <>
                            <label className="block w-full cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl py-10 flex flex-col items-center gap-3 hover:border-black transition-colors bg-gray-50/50">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100"><Upload size={22} className="text-gray-600" /></div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-gray-900">{t('editor_upload_image')}</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG up to 20MB</p>
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                            </label>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{locale === 'fr' ? 'Images Récentes' : 'Recent Images'}</h3>
                                    <button onClick={() => setShowAllRecent(true)} className="text-xs font-bold text-black hover:underline">{locale === 'fr' ? 'Tout voir' : 'See all'}</button>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {RECENT_IMAGES.map((img, i) => (
                                        <button key={i}
                                            onClick={() => { handleAddImage(img); closeAdd(); }}
                                            className="shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-100 hover:border-black transition-all bg-white group">
                                            <img src={img} alt={`Recent ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="shrink-0 w-24 h-24 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-all">
                                        <Plus size={20} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400">Plus</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowAllRecent(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <h3 className="text-sm font-bold text-gray-900">{locale === 'fr' ? 'Mes Images' : 'My Images'}</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-black hover:bg-gray-50 transition-all">
                                    <Plus size={20} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase text-center leading-tight">Add<br />Image</span>
                                </button>
                                {RECENT_IMAGES.map((img, i) => (
                                    <button key={i}
                                        onClick={() => { handleAddImage(img); setShowAllRecent(false); closeAdd(); }}
                                        className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:border-black transition-all bg-white group">
                                        <img src={img} alt={`Recent ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {tool === 'art' && (
                <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                        {(['stickers', 'patterns'] as const).map(tab => (
                            <button key={tab} onClick={() => setArtTab(tab)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${artTab === tab ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                {tab === 'stickers' ? t('editor_art_stickers') : t('editor_art_patterns')}
                            </button>
                        ))}
                    </div>
                    {artTab === 'stickers' ? (
                        <div className="flex items-center justify-center py-10 text-gray-400 text-sm font-medium">
                            {locale === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {['Stripes', 'Dots', 'Grid', 'Waves', 'Diamonds', 'Zigzag'].map(p => (
                                <button key={p} className="aspect-square rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors">{p}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {tool === 'shapes' && (
                <div className="p-6 space-y-5 overflow-y-auto no-scrollbar max-h-[70vh]">
                    <div className="grid grid-cols-4 gap-3">
                        {SHAPES_LIST.map(shape => (
                            <button
                                key={shape.label}
                                onClick={() => {
                                    handleAddSVG(shape.path);
                                    closeAdd();
                                }}
                                className="aspect-square rounded-2xl bg-gray-50 hover:bg-black group flex items-center justify-center transition-all"
                                title={shape.label}
                            >
                                <svg viewBox="0 0 48 48" width={32} height={32} fill="currentColor" className="text-black group-hover:text-white">
                                    <path d={shape.path} />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="h-full flex flex-col lg:flex-row bg-[#F5F5F7] overflow-hidden lg:pt-0 pt-18 md:pt-24 relative">
            {/* DESKTOP LEFT SIDEBAR */}
            <aside className="hidden lg:flex pt-8 flex-col w-[76px] bg-white border-r border-gray-100 items-center justify-start gap-10 shrink-0 z-50">
                {/* Group 1: Product */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => setShowProductSheet(true)}
                        className="w-12 h-14 flex flex-col items-center justify-center rounded-2xl text-gray-700 hover:bg-gray-100 hover:text-black transition-all hover:scale-105 active:scale-95 gap-1"
                        title={locale === 'fr' ? 'Changer de produit' : 'Change product'}
                    >
                        <Tag size={22} strokeWidth={1.5} />
                        <span className="text-[10px] ">
                            {locale === 'fr' ? 'Produit' : 'Product'}
                        </span>
                    </button>
                </div>
                {/* Group 2: Tools */}
                <div className="flex flex-col items-center gap-3">
                    {ADD_TOOLS.map(tool => (
                        <button key={tool.id} onClick={() => {
                            handleSelect(null);
                            setEditingTextId(null);
                            if (tool.id === 'text') {
                                handleAddText();
                            } else {
                                setDesktopActiveTool(tool.id);
                            }
                        }}
                            title={locale === 'fr' ? tool.labelFr : tool.labelEn}
                            className={`w-12 h-16 rounded-2xl flex flex-col items-center justify-center transition-all text-gray-700 hover:bg-gray-100/50 hover:text-black hover:scale-105 active:scale-95 group`}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${desktopActiveTool === tool.id ? 'bg-black text-white shadow-lg' : 'group-hover:bg-gray-200/50'}`}>
                                {React.cloneElement(tool.icon as React.ReactElement<{ size: number }>, { size: 22 })}
                            </div>
                            <span className="text-[10px] truncate w-full px-0.5 text-center mt-1">
                                {locale === 'fr' ? tool.labelFr : tool.labelEn}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Group 3: History */}
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={undo}
                        disabled={history.length === 0}
                        title={locale === 'fr' ? 'Annuler' : 'Undo'}
                        className={`w-12 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${history.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-black hover:scale-105 active:scale-95 group'}`}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:bg-gray-200/50`}>
                            <Undo2 size={22} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-center mt-1">
                            {locale === 'fr' ? 'Annuler' : 'Undo'}
                        </span>
                    </button>
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        title={locale === 'fr' ? 'Rétablir' : 'Redo'}
                        className={`w-12 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${future.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-black hover:scale-105 active:scale-95 group'}`}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:bg-gray-200/50`}>
                            <Redo2 size={22} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-center mt-1">
                            {locale === 'fr' ? 'Rétablir' : 'Redo'}
                        </span>
                    </button>
                </div>
            </aside>

            {/* DESKTOP TOOL CONTENT PANEL (Floating) */}
            <aside className={`hidden lg:flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 absolute left-[76px] top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden z-40 ${desktopActiveTool ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-8 pointer-events-none'}`}>
                <div className="w-80 flex flex-col h-full py-2">
                    <div className="px-6 pb-6 flex items-center justify-between shrink-0">
                        <span className="text-md font-medium text-gray-900">
                            {(() => {
                                const tool = ADD_TOOLS.find(t => t.id === desktopActiveTool);
                                return locale === 'fr' ? (tool?.labelFr || 'Propriétés') : (tool?.labelEn || 'Properties');
                            })()}
                        </span>
                        <button
                            onClick={() => setDesktopActiveTool(null)}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl text-black hover:text-black hover:bg-gray-100 transition-all active:scale-95"
                            title={locale === 'fr' ? 'Fermer' : 'Close'}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className={`flex-1 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <ToolContent tool={desktopActiveTool} />
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* ══════════════════════ TOP BAR ══════════════════════ */}
                <header className="h-16 flex items-center pt-1 justify-between px-4 shrink-0 z-40 relative border-b border-gray-100 transition-all">
                    <div className="w-10 lg:hidden" /> {/* Left spacer for mobile symmetry since color picker is absolute centered */}
                    {(!selectedId || selectedId === designZone.id) ? (
                        <>
                            {/* Color picker pill (Centered) */}
                            <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowColorSheet(true)}
                                        className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-white/80 text-sm font-medium"
                                    >
                                        <div className='inline-block p-px border border-neutral-400 rounded-full'>
                                            <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: activeColorImg.hex }} />
                                        </div>
                                        <span className="text-gray-700">{locale === 'fr' ? activeColorImg.name : activeColorImg.name}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* More / Order CTA (Right side) */}
                            <div className="lg:hidden flex items-center gap-2">
                                {onSave && (
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="h-10 px-4 bg-black text-white rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={16} className="animate-spin text-gray-400" />
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                                            {locale === 'fr' ? 'Enregistrer' : 'Save'}
                                        </span>
                                    </button>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMoreSheet(true)}
                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 text-gray-600"
                                    >
                                        <MoreHorizontal size={20} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex justify-end ml-4 min-w-0 relative">
                            <div ref={toolbarRef} className="flex items-center bg-white rounded-full shadow-lg border border-gray-100 px-3 py-1.5 animate-in fade-in right-slide-in duration-200 overflow-x-auto no-scrollbar max-w-full z-20">
                                {(() => {
                                    const selectedElement = elements.find(el => el.id === selectedId);
                                    if (!selectedElement) return null;
                                    return (
                                        <>

                                            {(selectedElement.type === 'text' || selectedElement.type === 'svg') && (
                                                <div className="relative shrink-0" ref={colorPickerRef}>
                                                    <button
                                                        onClick={() => { updatePickerPosition(colorPickerRef); setShowElementColorPicker(!showElementColorPicker); }}
                                                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center p-0.5 transition-transform hover:scale-105"
                                                        title={locale === 'fr' ? 'Couleur' : 'Color'}
                                                    >
                                                        <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: selectedElement.fill }} />
                                                    </button>
                                                    {showElementColorPicker && createPortal(
                                                        <div className="fixed bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 z-100 w-[220px] animate-in fade-in zoom-in-95 duration-200"
                                                            style={{ top: `${pickerPosition.top + 8}px`, left: `${pickerPosition.left}px`, transform: 'translateX(-50%)' }}
                                                            data-dropdown-portal="true"
                                                        >
                                                            <div className="px-1 py-0.5 mb-3">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{locale === 'fr' ? 'Couleur de l\'élément' : 'Element Color'}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-4">
                                                                {/* Radial Rainbow Custom Selector */}
                                                                <div className="relative group/custom">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); customColorInputRef.current?.click(); }}
                                                                        className="w-full h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm relative overflow-hidden group border border-gray-100"
                                                                        style={{
                                                                            background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                                                                        }}
                                                                    >
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors">
                                                                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-2 transform transition-transform group-hover:scale-105">
                                                                                <Plus size={12} className="text-gray-800" />
                                                                                <span className="text-[9px] font-bold text-gray-800 uppercase tracking-tight">{locale === 'fr' ? 'Personnalisé' : 'Custom'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                    <input
                                                                        ref={customColorInputRef}
                                                                        type="color"
                                                                        value={selectedElement.fill}
                                                                        onChange={(e) => { updateSelected({ fill: e.target.value }); setShowElementColorPicker(false); }}
                                                                        className="sr-only"
                                                                    />
                                                                </div>

                                                                {/* Palette Swatches */}
                                                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                                                    {COLORS.map(c => (
                                                                        <button
                                                                            key={c}
                                                                            onClick={() => { updateSelected({ fill: c }); setShowElementColorPicker(false); }}
                                                                            className="aspect-square w-8 h-8 shrink-0 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 shadow-sm"
                                                                            style={{
                                                                                backgroundColor: c,
                                                                                borderColor: selectedElement.fill.toLowerCase() === c.toLowerCase() ? '#000' : c === '#ffffff' ? '#f3f4f6' : c,
                                                                                transform: selectedElement.fill.toLowerCase() === c.toLowerCase() ? 'scale(1.1)' : 'scale(1)'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>,
                                                        document.body
                                                    )}
                                                </div>
                                            )}
                                            {selectedElement.type === 'text' && (
                                                <>
                                                    <div className="w-px h-6 bg-gray-200 mx-2 shrink-0" />
                                                    {/* Size */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button onClick={() => updateSelected({ fontSize: Math.max(8, (selectedElement.fontSize || 24) - 2) })} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors"><Minus size={14} /></button>
                                                        <span className="text-sm font-bold w-8 text-center shrink-0">{Math.round(selectedElement.fontSize || 24)}</span>
                                                        <button onClick={() => updateSelected({ fontSize: Math.min(120, (selectedElement.fontSize || 24) + 2) })} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors"><Plus size={14} /></button>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-200 mx-2 shrink-0" />
                                                    {/* Font */}
                                                    <div className="relative flex items-center shrink-0" ref={fontPickerRef}>
                                                        <button
                                                            onClick={() => { updatePickerPosition(fontPickerRef); setShowFontPicker(!showFontPicker); }}
                                                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full transition-colors min-w-[120px] justify-between"
                                                        >
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <Type size={14} className="text-gray-400 shrink-0" />
                                                                <span className="text-sm font-bold truncate text-gray-800" style={{ fontFamily: selectedElement.fontFamily }}>
                                                                    {selectedElement.fontFamily}
                                                                </span>
                                                            </div>
                                                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showFontPicker ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {showFontPicker && createPortal(
                                                            <div className="fixed bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 z-100 w-52 animate-in fade-in zoom-in-95 duration-200"
                                                                style={{ top: `${pickerPosition.top + 8}px`, left: `${pickerPosition.left}px`, transform: 'translateX(-50%)' }}
                                                                data-dropdown-portal="true"
                                                            >
                                                                <div className="px-3 py-1.5 mb-1">
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{locale === 'fr' ? 'Polices' : 'Fonts'}</span>
                                                                </div>
                                                                <div className="max-h-64 overflow-y-auto no-scrollbar">
                                                                    {FONT_FAMILIES.map(f => (
                                                                        <button
                                                                            key={f}
                                                                            onClick={() => {
                                                                                const availableWeights = FONT_WEIGHTS[f] || ['400'];
                                                                                const currentWeight = String(selectedElement.fontWeight || '400');
                                                                                const newWeight = availableWeights.includes(currentWeight) ? currentWeight : availableWeights[0];
                                                                                updateSelected({ fontFamily: f, fontWeight: newWeight });
                                                                                setShowFontPicker(false);
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between transition-colors ${selectedElement.fontFamily === f ? 'text-black bg-gray-50/50' : 'text-gray-600'}`}
                                                                        >
                                                                            <span style={{ fontFamily: f }} className="text-[15px]">
                                                                                {f}
                                                                            </span>
                                                                            {selectedElement.fontFamily === f && (
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>,
                                                            document.body
                                                        )}
                                                    </div>

                                                    <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

                                                    {/* Weight */}
                                                    <div className="relative flex items-center shrink-0" ref={weightPickerRef}>
                                                        <button
                                                            onClick={() => { updatePickerPosition(weightPickerRef); setShowWeightPicker(!showWeightPicker); }}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-gray-100 rounded-full transition-colors min-w-[70px] justify-between"
                                                        >
                                                            <span className="text-sm font-bold text-gray-800">
                                                                {WEIGHT_NAMES[selectedElement.fontWeight || '400']?.[locale] || (selectedElement.fontWeight || '400')}
                                                            </span>
                                                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showWeightPicker ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {showWeightPicker && createPortal(
                                                            <div className="fixed bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 z-100 w-32 animate-in fade-in zoom-in-95 duration-200"
                                                                style={{ top: `${pickerPosition.top + 8}px`, left: `${pickerPosition.left}px`, transform: 'translateX(-50%)' }}
                                                                data-dropdown-portal="true"
                                                            >
                                                                <div className="px-3 py-1.5 mb-1">
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{locale === 'fr' ? 'Poids' : 'Weight'}</span>
                                                                </div>
                                                                <div className="max-h-48 overflow-y-auto no-scrollbar">
                                                                    {(FONT_WEIGHTS[selectedElement.fontFamily] || ['400']).map(w => (
                                                                        <button
                                                                            key={w}
                                                                            onClick={() => { updateSelected({ fontWeight: w }); setShowWeightPicker(false); }}
                                                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between transition-colors ${String(selectedElement.fontWeight || '400') === w ? 'text-black bg-gray-50/50' : 'text-gray-600'}`}
                                                                        >
                                                                            <span style={{ fontFamily: selectedElement.fontFamily, fontWeight: w }} className="text-sm">
                                                                                {WEIGHT_NAMES[w]?.[locale] || w}
                                                                            </span>
                                                                            {String(selectedElement.fontWeight || '400') === w && (
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>,
                                                            document.body
                                                        )}
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-200 mx-2 shrink-0" />
                                                    {/* Formatting */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button onClick={() => handleToggleStyle('italic')} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${selectedElement.fontStyle?.includes('italic') ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                                                            <Italic size={14} />
                                                        </button>
                                                        <button onClick={handleToggleUnderline} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${selectedElement.textDecoration === 'underline' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                                                            <Underline size={14} />
                                                        </button>
                                                        <button onClick={handleCycleAlign} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                                                            {selectedElement.align === 'center' ? <AlignCenter size={14} /> : selectedElement.align === 'right' ? <AlignRight size={14} /> : <AlignLeft size={14} />}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            {(selectedElement.type === 'image' || selectedElement.type === 'svg') && (
                                                <>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button
                                                            onClick={() => handleFlip('horizontal')}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-all"
                                                            title={locale === 'fr' ? 'Retourner horizontalement' : 'Flip horizontal'}
                                                        >
                                                            <FlipHorizontal size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFlip('vertical')}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-all"
                                                            title={locale === 'fr' ? 'Retourner verticalement' : 'Flip vertical'}
                                                        >
                                                            <FlipVertical size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
                                                </>
                                            )}

                                            {/* Rotation */}
                                            <div className="flex items-center gap-1 shrink-0 px-1" title={locale === 'fr' ? 'Rotation' : 'Rotation'}>
                                                <button onClick={() => updateSelected({ rotation: (selectedElement.rotation || 0) - 15 })} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors"><RotateCcw size={14} /></button>
                                                <div className="flex items-center">
                                                    <input
                                                        type="number"
                                                        className="text-sm font-bold w-8 text-center bg-transparent outline-none p-0 appearance-none m-0"
                                                        style={{ MozAppearance: 'textfield' }} // hide spin buttons
                                                        value={Math.round(selectedElement.rotation || 0)}
                                                        onChange={(e) => updateSelected({ rotation: Number(e.target.value) || 0 })}
                                                    />
                                                    <span className="text-sm font-bold text-gray-800 -ml-1">°</span>
                                                </div>
                                                <button onClick={() => updateSelected({ rotation: (selectedElement.rotation || 0) + 15 })} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors"><RotateCw size={14} /></button>
                                            </div>

                                            <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
                                            <div className="relative shrink-0" ref={positionPickerRef}>
                                                <button
                                                    onClick={() => { updatePickerPosition(positionPickerRef); setShowPositionPicker(!showPositionPicker); }}
                                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-105"
                                                    title={locale === 'fr' ? 'Position' : 'Position'}
                                                >
                                                    <Maximize size={16} className="text-gray-600" />
                                                </button>
                                                {showPositionPicker && createPortal(
                                                    <div className="fixed bg-white rounded-2xl shadow-2xl p-2 border border-gray-100 z-100 w-40 animate-in fade-in zoom-in-95 duration-200"
                                                        style={{ top: `${pickerPosition.top + 8}px`, left: `${pickerPosition.left}px`, transform: 'translateX(-50%)' }}
                                                        data-dropdown-portal="true"
                                                    >
                                                        {[
                                                            { id: 'left', label: locale === 'fr' ? 'Gauche' : 'Left', icon: <AlignStartVertical size={14} /> },
                                                            { id: 'center-h', label: locale === 'fr' ? 'Centre H' : 'Center H', icon: <AlignCenterVertical size={14} /> },
                                                            { id: 'right', label: locale === 'fr' ? 'Droite' : 'Right', icon: <AlignEndVertical size={14} /> },
                                                            { id: 'top', label: locale === 'fr' ? 'Haut' : 'Top', icon: <AlignStartHorizontal size={14} /> },
                                                            { id: 'center-v', label: locale === 'fr' ? 'Centre V' : 'Center V', icon: <AlignCenterHorizontal size={14} /> },
                                                            { id: 'bottom', label: locale === 'fr' ? 'Bas' : 'Bottom', icon: <AlignEndHorizontal size={14} /> },
                                                        ].map(pos => (
                                                            <button
                                                                key={pos.id}
                                                                onClick={() => { handleQuickPosition(pos.id as any); setShowPositionPicker(false); }}
                                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition-colors flex items-center gap-2.5"
                                                            >
                                                                <span className="text-gray-400 group-hover:text-black">
                                                                    {pos.icon}
                                                                </span>
                                                                {pos.label}
                                                            </button>
                                                        ))}
                                                    </div>,
                                                    document.body
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </header>

                {/* ── Canvas ── */}
                <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Product image takes most of the space */}
                    <div className="flex-1 w-full flex items-center justify-center p-4 lg:p-8">
                        <div className="relative w-full max-w-md lg:max-w-lg h-full flex items-center justify-center">
                            {/* Floating Side Switch (Desktop) - Outside touch-none container */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-row gap-4 z-50">
                                {sides.map((side) => {
                                    const sideColorImg = side.colors.find(c => c.id === activeColorId) || side.colors[0];
                                    const isActive = side.id === activeSideId;
                                    return (
                                        <button
                                            key={side.id}
                                            onClick={() => handleSwitchSide(side.id)}
                                            className={`group relative flex flex-col items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'scale-110 ' : 'hover:scale-105'}`}
                                        >
                                            <div className={`w-16 h-16 rounded-xl overflow-hidden border transition-colors duration-300 flex items-center justify-center bg-[#F9F9FB] ${isActive ? 'border-black/20' : 'border-transparent group-hover:border-black/5'}`}>
                                                <img
                                                    src={sideColorImg.imageSrc}
                                                    alt={side.name}
                                                    className={`w-full h-full object-contain p-2 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                                                />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                    {side.name}
                                                </span>
                                                {isActive && (
                                                    <div className="w-1 h-1 bg-black rounded-full mt-1 animate-in zoom-in duration-300" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Product */}
                            <div ref={containerRef} className="relative w-full h-full touch-none flex items-center justify-center">
                                <Stage
                                    width={stageDimensions.width}
                                    height={stageDimensions.height}
                                    ref={stageRef}
                                    onMouseDown={handleStageClick}
                                    onTouchStart={handleStageClick}
                                    onWheel={handleWheel}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <Layer>
                                        <Group
                                            scaleX={stageScale}
                                            scaleY={stageScale}
                                            x={stagePos.x}
                                            y={stagePos.y}
                                        >
                                            {(() => {
                                                const fitScale = Math.min(
                                                    stageDimensions.width / frameWidth,
                                                    stageDimensions.height / frameHeight
                                                );

                                                return (
                                                    <Group
                                                        name="frame-group"
                                                        x={stageDimensions.width / 2}
                                                        y={stageDimensions.height / 2}
                                                        scaleX={fitScale}
                                                        scaleY={fitScale}
                                                        offsetX={frameWidth / 2}
                                                        offsetY={frameHeight / 2}
                                                        clipX={0}
                                                        clipY={0}
                                                        clipWidth={frameWidth}
                                                        clipHeight={frameHeight}
                                                    >
                                                        {/* Product Background - Fills the Design Frame while maintaining aspect ratio */}
                                                        {productImg && (() => {
                                                            const imgRatio = productImg.width / productImg.height;
                                                            const frameRatio = frameWidth / frameHeight;

                                                            let drawW, drawH;
                                                            if (imgRatio > frameRatio) {
                                                                drawW = frameWidth;
                                                                drawH = frameWidth / imgRatio;
                                                            } else {
                                                                drawH = frameHeight;
                                                                drawW = frameHeight * imgRatio;
                                                            }

                                                            return (
                                                                <KonvaImage
                                                                    name="product-mockup"
                                                                    image={productImg}
                                                                    x={(frameWidth - drawW) / 2}
                                                                    y={(frameHeight - drawH) / 2}
                                                                    width={drawW}
                                                                    height={drawH}
                                                                    listening={true}
                                                                />
                                                            );
                                                        })()}

                                                        <EditZone
                                                            zoneProps={designZone}
                                                            isSelected={selectedId === designZone.id}
                                                            selectedId={selectedId}
                                                            onSelect={() => handleSelect(designZone.id)}
                                                            onChange={(newProps) => {
                                                                saveToHistory();
                                                                setDesignZone(newProps);
                                                            }}
                                                            hideLimits={hideLimits}
                                                            mockupWidth={frameWidth}
                                                            mockupHeight={frameHeight}
                                                        >
                                                            {elements.map((el) => {
                                                                if (el.type === 'text') {
                                                                    return <EditText key={el.id} shapeProps={el} isSelected={el.id === selectedId}
                                                                        onSelect={() => handleSelect(el.id)}
                                                                        onChange={(newProps: any) => handleElementChange(el.id, newProps)}
                                                                        isEditingExternally={editingTextId === el.id}
                                                                        onEditEnd={() => setEditingTextId(null)} />;
                                                                }
                                                                if (el.type === 'image') {
                                                                    return <EditImage key={el.id} shapeProps={el} isSelected={el.id === selectedId}
                                                                        onSelect={() => handleSelect(el.id)}
                                                                        onChange={(newProps: any) => handleElementChange(el.id, newProps)} />;
                                                                }
                                                                if (el.type === 'svg') {
                                                                    return <EditSVG key={el.id} shapeProps={el} isSelected={el.id === selectedId}
                                                                        onSelect={() => handleSelect(el.id)}
                                                                        onChange={(newProps: any) => handleElementChange(el.id, newProps)} />;
                                                                }
                                                                return null;
                                                            })}
                                                        </EditZone>
                                                    </Group>
                                                )
                                            })()}
                                        </Group>
                                    </Layer>
                                </Stage>
                            </div>
                        </div>
                    </div>

                    {/* Side navigation */}
                    <div className="flex justify-center lg:hidden items-center gap-4 pb-8 relative w-full">
                        <button className="lg:hidden absolute left-4 w-10 h-10 shadow-lg flex items-center justify-center rounded-full hover:bg-black/10 transition-colors bg-white">
                            <Settings size={22} strokeWidth={1.5} />
                        </button>
                        <button onClick={prevSide} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors">
                            <ChevronLeft size={22} strokeWidth={1.5} />
                        </button>
                        <div className="flex items-center gap-1.5 flex-col">
                            {/* Dots */}
                            <div className="flex items-center gap-1.5">
                                {sides.map((side) => (
                                    <button
                                        key={side.id}
                                        onClick={() => handleSwitchSide(side.id)}
                                        className={`rounded-full transition-all ${side.id === activeSideId ? 'w-3 h-3 bg-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{sideLabel}</span>
                        </div>
                        <button onClick={nextSide} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors">
                            <ChevronRight size={22} strokeWidth={1.5} />
                        </button>

                    </div>

                    {/* Floating Toolbar */}
                    {selectedId && selectedId !== designZone.id && (
                        <div className="absolute bottom-4 lg:bottom-32 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl border border-gray-200 px-4 py-2 flex items-center gap-1.5 animate-in slide-in-from-bottom-4 duration-200 z-30">
                            {elements.find(el => el.id === selectedId)?.type === 'text' && (
                                <button onClick={() => setEditingTextId(selectedId)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors" title={locale === 'fr' ? 'Éditer le texte' : 'Edit text'}>
                                    <Edit2 size={18} strokeWidth={1.5} />
                                </button>
                            )}
                            {elements.find(el => el.id === selectedId)?.type === 'image' && (
                                <button onClick={() => changeImageInputRef.current?.click()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors" title={locale === 'fr' ? 'Changer l\'image' : 'Change image'}>
                                    <ImageIcon size={18} strokeWidth={1.5} />
                                    <input type="file" ref={changeImageInputRef} className="hidden" accept="image/*" onChange={handleChangeImageUpload} />
                                </button>
                            )}
                            {(elements.find(el => el.id === selectedId)?.type === 'text' || elements.find(el => el.id === selectedId)?.type === 'image') && (
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                            )}
                            <button onClick={() => handleMoveLayer('up')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors" title={locale === 'fr' ? 'Avancer' : 'Bring forward'}>
                                <ChevronUp size={20} strokeWidth={1.5} />
                            </button>
                            <button onClick={() => handleMoveLayer('down')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors" title={locale === 'fr' ? 'Reculer' : 'Send backward'}>
                                <ChevronDown size={20} strokeWidth={1.5} />
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-1" />
                            <button onClick={handleDuplicate} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors" title={locale === 'fr' ? 'Dupliquer' : 'Duplicate'}>
                                <Copy size={18} strokeWidth={1.5} />
                            </button>
                            <button onClick={handleDelete} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-red-600 transition-colors" title={locale === 'fr' ? 'Supprimer' : 'Delete'}>
                                <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* ══════════════════════ RIGHT SIDEBAR (Product Details) ══════════════════════ */}
            <aside className="hidden lg:flex flex-col w-[340px] bg-white border-l border-gray-100 shrink-0 z-40 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Header: Name & Price */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {(() => {
                                    const cat = CATEGORIES.find(c => c.key === activeProduct.categoryKey);
                                    return cat ? t(cat.nameKey) : activeProduct.categoryKey;
                                })()}
                            </span>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">
                                {t(activeProduct.nameKey)}
                            </h1>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-black">{activeProduct.price} €</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{locale === 'fr' ? 'HT / unité' : 'excl. VAT / unit'}</span>
                        </div>
                    </div>

                    {/* Color Switcher */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                {locale === 'fr' ? 'Couleurs' : 'Colors'}
                            </h3>
                            <span className="text-[11px] font-bold text-gray-400">
                                {activeColorImg.name}
                            </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth p-1">
                            {sides[0].colors.map((color) => {
                                const isActive = color.id === activeColorId;
                                return (
                                    <button
                                        key={color.id}
                                        onClick={() => setActiveColorId(color.id)}
                                        className={`group relative shrink-0 w-16 h-16 rounded-xl border-2 transition-all duration-300 ${isActive ? 'border-black scale-105 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                        title={color.name}
                                    >
                                        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                                            <img src={color.imageSrc} alt={color.name} className="w-full h-full object-contain" />
                                        </div>
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border-2 border-white">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Details section */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        {/* Minimum Order */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <ShoppingCart size={18} className="text-black" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{locale === 'fr' ? 'Commande Min.' : 'Min. Order'}</span>
                                    <span className="text-sm font-black text-gray-900">{activeProduct.minimumOrder} {locale === 'fr' ? 'pièces' : 'units'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                {locale === 'fr' ? 'Tailles disponibles' : 'Available Sizes'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {activeProduct.sizes.map(size => (
                                    <span key={size} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 uppercase">
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                {locale === 'fr' ? 'Détails du produit' : 'Product Details'}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                {t(activeProduct.descriptionKey)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-auto p-8 border-t border-gray-100 bg-white sticky bottom-0">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSaving ? locale === 'fr' ? 'Enregistrement...' : 'Saving...' : locale === 'fr' ? 'Continuer' : 'Continue'}
                    </button>
                </div>
            </aside>

            {/* ══════════════════════ MOBILE BOTTOM ══════════════════════ */}
            <div className="lg:hidden shrink-0 z-20">

                {/* ── Floating options card (above bottom bar) ── */}
                {showAddSheet && !addTool && (
                    <>
                        {/* Backdrop to close when clicking outside */}
                        <div className="fixed inset-0 z-30" onClick={() => setShowAddSheet(false)} />
                        <div className="fixed bottom-[85px] left-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-200">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 px-2 py-3">
                                <div className="flex items-center justify-around">
                                    {ADD_TOOLS.map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => openAddTool(tool.id)}
                                            className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-100 transition-colors active:scale-95">
                                            <span className="text-gray-800">{tool.icon}</span>
                                            <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                                                {locale === 'fr' ? tool.labelFr : tool.labelEn}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Bottom bar ── */}
                <nav className="bg-white border-t pb-4 border-gray-100">
                    <div className="flex items-stretch">
                        {/* Products */}
                        <button
                            onClick={() => setShowProductSheet(true)}
                            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 hover:bg-gray-50 transition-colors border-r border-gray-100">
                            <Tag size={22} strokeWidth={1.5} />
                            <span className="text-[11px] font-semibold text-gray-700">{locale === 'fr' ? 'Produits' : 'Products'}</span>
                        </button>

                        {/* Add — toggles the row above */}
                        <button
                            onClick={() => { setShowAddSheet(v => !v); setAddTool(null); handleSelect(null); setEditingTextId(null); }}
                            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 transition-colors border-r border-gray-100 ${showAddSheet && !addTool ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}>
                            <Plus size={22} strokeWidth={1.5} />
                            <span className="text-[11px] font-semibold text-gray-700">{locale === 'fr' ? 'Ajouter' : 'Add'}</span>
                        </button>

                        {/* Add to Cart */}
                        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 hover:bg-gray-50 transition-colors relative">
                            <div className="absolute inset-1 rounded-xl" style={{
                                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6) border-box',
                                border: '2px solid transparent',
                            }} />
                            <ShoppingCart size={22} strokeWidth={1.5} className="relative z-10 text-red-500" />
                            <span className="text-[11px] font-semibold text-gray-700 relative z-10">
                                {editMode
                                    ? (locale === 'fr' ? 'Enregistrer le design' : 'Save design')
                                    : (locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart')}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* ══════════════════════ MOBILE TOOL DETAIL SHEET ══════════════════════ */}
            {showAddSheet && addTool && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeAdd} />
                    <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[75vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 font-bold text-base">
                                {ADD_TOOLS.find(t => t.id === addTool)?.icon}
                                <span>{locale === 'fr' ? ADD_TOOLS.find(t => t.id === addTool)?.labelFr : ADD_TOOLS.find(t => t.id === addTool)?.labelEn}</span>
                            </div>
                            <button onClick={() => setAddTool(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <ToolContent tool={addTool} />
                        </div>
                    </div>
                </div>
            )}
            {/* ══════════════════════ PRODUCT SELECTION SHEET ══════════════════════ */}
            {showProductSheet && (
                <div className="fixed inset-0 z-60 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductSheet(false)} />
                    <div className="relative bg-white rounded-t-[32px] h-[75vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
                        {/* Handle */}
                        <div className="flex justify-center p-3 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Search and Title */}
                        <div className="px-6 pb-4 shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{locale === 'fr' ? 'Choisir un produit' : 'Select Product'}</h2>
                                <button
                                    onClick={() => setShowProductSheet(false)}
                                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('search_placeholder')}
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#F5F5F7] border-none rounded-2xl outline-none text-sm font-medium"
                                    value={productSearchQuery}
                                    onChange={(e) => setProductSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Horizontal Categories */}
                        <div className="px-6 pb-4 overflow-x-auto no-scrollbar shrink-0">
                            <div className="flex gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setSelectedProductCategory(cat.key)}
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedProductCategory === cat.key
                                            ? 'bg-black text-white'
                                            : 'bg-[#F5F5F7] text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat.nameKey ? t(cat.nameKey) : cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1 overflow-y-auto px-6 pb-10">
                            <div className="grid grid-cols-2 gap-4">
                                {MOCK_PRODUCTS
                                    .filter(p => {
                                        const matchesCategory = selectedProductCategory === 'All' || p.categoryKey === selectedProductCategory;
                                        const matchesSearch = t(p.nameKey).toLowerCase().includes(productSearchQuery.toLowerCase());
                                        return matchesCategory && matchesSearch;
                                    })
                                    .map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                setActiveProduct(product);
                                                setShowProductSheet(false);
                                            }}
                                            className="bg-[#F5F5F7] rounded-3xl p-4 flex flex-col items-center text-center transition-all active:scale-[0.98] group"
                                        >
                                            <div className="aspect-square w-full relative mb-3 rounded-2xl overflow-hidden p-2">
                                                <Image
                                                    src={product.imageSrc}
                                                    alt={t(product.nameKey)}
                                                    fill
                                                    unoptimized
                                                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="text-[13px] font-bold text-gray-900 mb-1 leading-tight line-clamp-2">
                                                {t(product.nameKey)}
                                            </h3>
                                            <span className="text-[12px] font-semibold text-blue-600">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ COLOR SHEET ══════════════════════ */}
            {showColorSheet && (
                <div className="fixed inset-0 z-60 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowColorSheet(false)} />
                    <div className="relative bg-white rounded-t-[32px] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 max-h-[75vh]">
                        {/* Handle */}
                        <div className="flex justify-center p-3 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Title and Close */}
                        <div className="px-6 pb-2 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{locale === 'fr' ? 'Choisir la couleur' : 'Choose Color'}</h2>
                            <button onClick={() => setShowColorSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Color Items Grid */}
                        <div className="px-6 py-4 flex-1 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                {sides[0].colors.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => {
                                            handleSwitchColor(color.id);
                                            setShowColorSheet(false);
                                        }}
                                        className={`group flex flex-col items-center gap-1 p-1 rounded-2xl border transition-all ${activeColorId === color.id ? 'border-black bg-gray-50' : 'border-transparent hover:border-gray-300 bg-white'}`}
                                    >
                                        <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-[#F5F5F7]">
                                            {color.imageSrc && <Image
                                                src={color.imageSrc}
                                                alt={color.name}
                                                fill
                                                unoptimized
                                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            />}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-800">{color.name}</span>
                                        </div>
                                    </button>
                                ))}
                                {/* Product Settings Access */}
                                <button
                                    onClick={() => {
                                        setShowColorSheet(false);
                                        setShowProductSettingsSheet(true);
                                    }}
                                    className="group flex flex-col items-center gap-1 p-1 rounded-2xl border border-dashed border-gray-300 transition-all hover:border-black hover:bg-gray-50 bg-white"
                                >
                                    <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center group-hover:bg-[#F5F5F7] transition-colors">
                                        <Settings size={24} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-colors" />
                                    </div>
                                    <div className="flex items-center justify-center h-4">
                                        <span className="text-xs font-medium text-gray-500 group-hover:text-black transition-colors">{locale === 'fr' ? 'Paramètres' : 'Settings'}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ MORE MENU SHEET ══════════════════════ */}
            {showMoreSheet && (
                <div className="fixed inset-0 z-60 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMoreSheet(false)} />
                    <div className="relative bg-white rounded-t-[32px] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 max-h-[75vh]">
                        {/* Handle */}
                        <div className="flex justify-center p-3 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Title and Close */}
                        <div className="px-6 pb-2 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{locale === 'fr' ? 'Options' : 'More'}</h2>
                            <button onClick={() => setShowMoreSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Actions List */}
                        <div className="px-4 py-2 space-y-1">
                            {[
                                { id: 'settings', icon: <Settings size={20} />, label: locale === 'fr' ? 'Paramètres du produit' : 'Product Settings' },
                                { id: 'details', icon: <Info size={20} />, label: locale === 'fr' ? 'Détails du produit' : 'Product Details' },
                                { id: 'help', icon: <CircleHelp size={20} />, label: locale === 'fr' ? 'Aide & Support' : 'Help & Support' },
                            ].map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        if (action.id === 'details') setShowDetailsSheet(true);
                                        if (action.id === 'settings') setShowProductSettingsSheet(true);
                                        setShowMoreSheet(false);
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-1 rounded-2xl hover:bg-gray-50 transition-colors active:scale-[0.98]"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600">
                                        {action.icon}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 rounded-2xl font-bold text-gray-800 active:scale-[0.98] transition-transform">
                                <Heart size={20} />
                                {locale === 'fr' ? 'Enregistrer' : 'Save'}
                            </button>
                            <button className="flex-2 flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold active:scale-[0.98] transition-transform">
                                <ShoppingCart size={20} />
                                {editMode
                                    ? (locale === 'fr' ? 'Enregistrer le design' : 'Save design')
                                    : (locale === 'fr' ? 'Panier' : 'Add to Cart')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ PRODUCT DETAILS SHEET ══════════════════════ */}
            {showDetailsSheet && (
                <div className="fixed inset-0 z-60 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-t-[32px] h-[75vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
                        {/* Handle */}
                        <div className="flex justify-center p-3 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Title & Close */}
                        <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 leading-none">
                                {locale === 'fr' ? 'Détails du produit' : 'Product details'}
                            </h2>
                            <button onClick={() => setShowDetailsSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
                            {/* Category Selector (Now inside scrollable) */}
                            <div className="pb-8 overflow-x-auto no-scrollbar">
                                <div className="flex gap-3">
                                    {CATEGORIES.filter(cat => cat.key !== 'All').map((cat) => (
                                        <button
                                            key={cat.key}
                                            onClick={() => setActiveProduct(prev => ({ ...prev, categoryKey: cat.key }))}
                                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeProduct.categoryKey === cat.key
                                                ? 'bg-black text-white'
                                                : 'bg-[#F5F5F7] text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat.nameKey ? t(cat.nameKey) : cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Image Upload/Preview */}
                            <div className="mb-10">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                                    {locale === 'fr' ? 'Image Principale (Aperçu Custom)' : 'Main Image (Custom Preview)'}
                                </label>
                                <div
                                    onClick={() => mainImageInputRef.current?.click()}
                                    className="aspect-video w-full relative bg-[#F5F5F7] border border-gray-100 rounded-[32px] overflow-hidden p-6 flex items-center justify-center cursor-pointer group hover:bg-gray-100 transition-all hover:border-blue-200"
                                >
                                    {mainImage ? (
                                        <>
                                            <Image
                                                src={mainImage}
                                                alt="Main Preview"
                                                fill
                                                unoptimized
                                                className="object-contain p-4"
                                            />
                                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-blue-600">
                                                    <Upload size={28} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={48} className="mb-3 opacity-20" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black uppercase tracking-widest mb-1">{locale === 'fr' ? 'Ajouter un aperçu' : 'Add custom preview'}</span>
                                                <span className="text-[10px] font-bold opacity-60 uppercase">{locale === 'fr' ? 'Optionnel (Remplace l\'aperçu auto)' : 'Optional (Overrides auto preview)'}</span>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={mainImageInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    if (event.target?.result) {
                                                        setMainImage(event.target?.result as string);
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {mainImage && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMainImage(null);
                                            }}
                                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 ml-1">
                                    {locale === 'fr' ? 'Nom du Produit' : 'Product Name'}
                                </label>
                                <input
                                    type="text"
                                    value={productTitle}
                                    onChange={(e) => setProductTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-gray-300"
                                    placeholder={locale === 'fr' ? 'Entrez le nom du produit' : 'Enter product name'}
                                />
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5 ml-1">{locale === 'fr' ? 'Prix ($)' : 'Price ($)'}</label>
                                        <input
                                            type="text"
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5 ml-1">{locale === 'fr' ? 'Min. Commande' : 'Min. Order'}</label>
                                        <div className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-400 cursor-not-allowed">
                                            {activeProduct.minimumOrder || 1}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                                        {locale === 'fr' ? 'Tailles disponibles' : 'Available Sizes'}
                                    </label>

                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newSizeInput}
                                            onChange={(e) => setNewSizeInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && newSizeInput.trim()) {
                                                    setActiveProduct(prev => ({
                                                        ...prev,
                                                        sizes: [...new Set([...prev.sizes, newSizeInput.trim()])]
                                                    }));
                                                    setNewSizeInput('');
                                                }
                                            }}
                                            className="flex-1 bg-gray-100/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-gray-400"
                                            placeholder={locale === 'fr' ? 'Ex: XL, 42...' : 'Ex: XL, 42...'}
                                        />
                                        <button
                                            onClick={() => {
                                                if (newSizeInput.trim()) {
                                                    setActiveProduct(prev => ({
                                                        ...prev,
                                                        sizes: [...new Set([...prev.sizes, newSizeInput.trim()])]
                                                    }));
                                                    setNewSizeInput('');
                                                }
                                            }}
                                            className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                                        >
                                            {locale === 'fr' ? 'Ajouter' : 'Add'}
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {activeProduct.sizes.length > 0 ? activeProduct.sizes.map(size => (
                                            <div key={size} className="group flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-gray-400 transition-all">
                                                {size}
                                                <button
                                                    onClick={() => {
                                                        setActiveProduct(prev => ({
                                                            ...prev,
                                                            sizes: prev.sizes.filter(s => s !== size)
                                                        }));
                                                    }}
                                                    className="ml-2 w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-gray-400 italic py-2 ml-1">
                                                {locale === 'fr' ? 'Aucune taille configurée' : 'No sizes configured yet'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                                        {locale === 'fr' ? 'Description' : 'Description'}
                                    </label>
                                    <textarea
                                        value={activeProduct.descriptionKey ? (t(activeProduct.descriptionKey) === activeProduct.descriptionKey ? activeProduct.descriptionKey : t(activeProduct.descriptionKey)) : ''}
                                        onChange={(e) => setActiveProduct(prev => ({ ...prev, descriptionKey: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all leading-relaxed resize-none"
                                        placeholder={locale === 'fr' ? 'Entrez la description du produit...' : 'Enter product description...'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ══════════════════════ PRODUCT SETTINGS SHEET ══════════════════════ */}
            {showProductSettingsSheet && (
                <div className="fixed inset-0 z-60 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductSettingsSheet(false)} />
                    <div className="relative bg-white rounded-t-[32px] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 max-h-[75vh]">
                        {/* Handle */}
                        <div className="flex justify-center p-3 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Title */}
                        <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-xl font-bold">{locale === 'fr' ? 'Paramètres du produit' : 'Product Settings'}</h2>
                            <button onClick={() => setShowProductSettingsSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
                            {/* COLORS SECTION */}
                            <section>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-xs font-bold text-gray-400">{locale === 'fr' ? 'Couleurs / Déclinaisons' : 'Colors / Variations'}</h3>
                                    <button
                                        onClick={() => setShowAddColorModal(true)}
                                        className="text-xs font-bold text-blue-600 flex items-center p-2 rounded-full bg-blue-50"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pt-1">
                                    {sides[0].colors.map(color => (
                                        <div
                                            key={color.id}
                                            onClick={() => handleSwitchColor(color.id)}
                                            className="relative flex flex-col items-center text-center gap-2 rounded-2xl shrink-0 transition-all cursor-pointer group"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingColorId(color.id);
                                                    setEditColorName(color.name);
                                                    setEditColorHex(color.hex);
                                                    setShowEditColorModal(true);
                                                }}
                                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 z-10 transition-colors"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <div className={`p-0.5 rounded-full ${color.id === activeColorId ? 'bg-black' : 'group-hover:border-gray-300'}`}>
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-200 shrink-0" style={{ backgroundColor: color.hex }} />
                                            </div>
                                            <div className="min-w-0 w-full">
                                                <p className={`text-xs text-gray-800 truncate mb-1 ${color.id === activeColorId ? 'font-black' : ''}`}>{color.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SIDES SECTION */}
                            <section>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-bold text-gray-400">{locale === 'fr' ? 'Faces / Zones' : 'Sides / Zones'}</h3>
                                    <button
                                        onClick={() => {
                                            setNewSideName('');
                                            setNewSideNameFr('');
                                            setNewSideImageSrc('');
                                            setShowAddSideModal(true);
                                        }}
                                        className="text-xs font-bold text-blue-600 flex items-center p-2 rounded-full bg-blue-50"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                    {sides.map(side => (
                                        <div
                                            key={side.id}
                                            onClick={() => handleSwitchSide(side.id)}
                                            className={`relative flex flex-col items-center text-center rounded-2xl border overflow-hidden shrink-0 transition-all bg-white cursor-pointer group/side ${activeSideId === side.id ? 'border-black ' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSideId(side.id);
                                                    setEditSideName(side.name);
                                                    setEditSideNameFr(side.nameFr);
                                                    setShowEditSideModal(true);
                                                }}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white z-10 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <div className="w-24 h-24 relative bg-gray-50 border-b border-gray-100 flex items-center justify-center p-2 group-hover/side:opacity-90 shadow-inner">
                                                {side.colors.find(c => c.id === activeColorId)?.imageSrc ? (
                                                    <img src={side.colors.find(c => c.id === activeColorId)?.imageSrc} className="w-full h-full object-contain transition-transform" alt="" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-300">
                                                        <Upload size={24} className="mb-2" />
                                                        <span className="text-[10px] uppercase font-bold tracking-wider">{locale === 'fr' ? 'Aucune Image' : 'No Image'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-full py-1 bg-white">
                                                <span className="font-bold text-gray-900 text-xs block">{locale === 'fr' ? side.nameFr : side.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* ACTIVE SIDE IMAGE UPLOAD */}
                            <section className="mt-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <label className="text-xs font-bold text-gray-400 block">
                                        {locale === 'fr' ? `Image pour : ${activeSide.nameFr}` : `Image for: ${activeSide.name}`}
                                    </label>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                                        <div className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: activeColorImg.hex }} />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{activeColorImg.name}</span>
                                    </div>
                                </div>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer overflow-hidden relative group">
                                    {activeColorImg.imageSrc ? (
                                        <>
                                            <img src={activeColorImg.imageSrc} className="w-full h-full object-contain p-4" alt="side preview" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="text-white" size={24} />
                                                    <span className="text-white text-xs font-bold">{locale === 'fr' ? 'Changer l\'image' : 'Change Image'}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors px-6 text-center">
                                            <div className="w-12 h-12 flex items-center justify-center">
                                                <Upload size={24} />
                                            </div>
                                            <span className="text-xs font-bold mb-1">{locale === 'fr' ? 'Télécharger une image' : 'Upload Image'}</span>
                                            <p className="text-[10px] text-gray-400 leading-tight">
                                                {locale === 'fr' ? `Associer une image au ${activeSide.nameFr}` : `Associate an image with the ${activeSide.name}`}
                                            </p>
                                        </div>
                                    )}
                                    <input type="file" ref={activeSideFileInputRef} accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                if (event.target?.result) {
                                                    const newSrc = event.target.result as string;
                                                    setSides(prev => prev.map(s => {
                                                        if (s.id === activeSideId) {
                                                            return {
                                                                ...s,
                                                                colors: s.colors.map(c => c.id === activeColorId ? { ...c, imageSrc: newSrc } : c)
                                                            };
                                                        }
                                                        return s;
                                                    }));
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                            </section>

                            {/* CANVAS SETTINGS SECTION */}
                            <section className="mt-4 pt-4 border-t border-gray-100 pb-10">
                                <h3 className="text-xs font-bold text-gray-400 mb-4">{locale === 'fr' ? 'Dimensions du Design Frame' : 'Design Frame Dimensions'}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                                            {locale === 'fr' ? 'Largeur' : 'Width'}
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <Maximize size={16} className="text-gray-400" />
                                            <input
                                                type="number"
                                                value={frameWidth}
                                                onChange={(e) => setFrameWidth(Number(e.target.value))}
                                                className="bg-transparent border-none outline-none text-sm font-bold w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                                            {locale === 'fr' ? 'Hauteur' : 'Height'}
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <Maximize size={16} className="text-gray-400 rotate-90" />
                                            <input
                                                type="number"
                                                value={frameHeight}
                                                onChange={(e) => setFrameHeight(Number(e.target.value))}
                                                className="bg-transparent border-none outline-none text-sm font-bold w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 leading-tight">
                                    {locale === 'fr'
                                        ? 'Ces dimensions définissent l\'espace de travail virtuel. La zone de design et les éléments sont positionnés relativement à ce cadre.'
                                        : 'These dimensions define the virtual workspace. The design zone and elements are positioned relative to this frame.'}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            )}
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />

            {/* ══════════════════════ ADD COLOR MODAL ══════════════════════ */}
            {showAddColorModal && (
                <div className="fixed inset-x-0 bottom-24 flex justify-center z-100 px-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {locale === 'fr' ? 'Nouvelle Couleur' : 'New Color'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {locale === 'fr' ? 'Ajouter une couleur' : 'Add a new color'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom' : 'Name'}
                                </label>
                                <input
                                    type="text"
                                    value={newColorName}
                                    onChange={(e) => setNewColorName(e.target.value)}
                                    placeholder="ex: Royal Blue"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Code Hex' : 'Hex'}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                        <input
                                            type="color"
                                            value={newColorHex}
                                            onChange={(e) => setNewColorHex(e.target.value)}
                                            className="absolute -inset-2 w-14 h-14 cursor-pointer"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newColorHex}
                                        onChange={(e) => setNewColorHex(e.target.value)}
                                        className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium uppercase font-mono focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowAddColorModal(false);
                                    setNewColorName('');
                                    setNewColorHex('#000000');
                                }}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                            >
                                {locale === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    if (newColorName && newColorHex) {
                                        const id = newColorName.toLowerCase().replace(/\s+/g, '-');
                                        setSides(prev => prev.map(s => ({
                                            ...s,
                                            colors: [
                                                ...s.colors,
                                                {
                                                    id,
                                                    name: newColorName,
                                                    hex: newColorHex,
                                                    imageSrc: ''
                                                }
                                            ]
                                        })));
                                        setShowAddColorModal(false);
                                        setNewColorName('');
                                        setNewColorHex('#000000');
                                    }
                                }}
                                disabled={!newColorName || !newColorHex}
                                className="flex-1 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {locale === 'fr' ? 'Ajouter' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ EDIT COLOR MODAL ══════════════════════ */}
            {showEditColorModal && editingColorId && (
                <div className="fixed inset-x-0 bottom-24 flex justify-center z-100 px-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Edit2 size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-900">
                                    {locale === 'fr' ? 'Modifier la Couleur' : 'Edit Color'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {locale === 'fr' ? 'Modifier les détails de la couleur' : 'Change color details'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (sides[0].colors.length <= 1) {
                                        alert(locale === 'fr' ? 'Impossible de supprimer la dernière couleur.' : 'Cannot delete the last color.');
                                        return;
                                    }
                                    if (confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette couleur ?' : 'Are you sure you want to delete this color?')) {
                                        const remainingColors = sides[0].colors.filter(c => c.id !== editingColorId);
                                        setSides(prev => prev.map(s => ({
                                            ...s,
                                            colors: s.colors.filter(c => c.id !== editingColorId)
                                        })));
                                        if (activeColorId === editingColorId) {
                                            setActiveColorId(remainingColors[0].id);
                                        }
                                        setShowEditColorModal(false);
                                    }
                                }}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom' : 'Name'}
                                </label>
                                <input
                                    type="text"
                                    value={editColorName}
                                    onChange={(e) => setEditColorName(e.target.value)}
                                    placeholder="ex: Royal Blue"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Code Hex' : 'Hex'}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                        <input
                                            type="color"
                                            value={editColorHex}
                                            onChange={(e) => setEditColorHex(e.target.value)}
                                            className="absolute -inset-2 w-14 h-14 cursor-pointer"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={editColorHex}
                                        onChange={(e) => setEditColorHex(e.target.value)}
                                        className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium uppercase font-mono focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEditColorModal(false)}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                            >
                                {locale === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    if (editColorName && editColorHex) {
                                        setSides(prev => prev.map(s => ({
                                            ...s,
                                            colors: s.colors.map(c =>
                                                c.id === editingColorId
                                                    ? { ...c, name: editColorName, hex: editColorHex }
                                                    : c
                                            )
                                        })));
                                        setShowEditColorModal(false);
                                    }
                                }}
                                disabled={!editColorName || !editColorHex}
                                className="flex-1 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {locale === 'fr' ? 'Enregistrer' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ ADD SIDE MODAL ══════════════════════ */}
            {showAddSideModal && (
                <div className="fixed inset-x-0 bottom-24 flex justify-center z-100 px-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {locale === 'fr' ? 'Nouvelle Face' : 'New Side'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {locale === 'fr' ? 'Ajouter une face / zone' : 'Add a new side / zone'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom (FR)' : 'Name (FR)'}
                                </label>
                                <input
                                    type="text"
                                    value={newSideNameFr}
                                    onChange={(e) => setNewSideNameFr(e.target.value)}
                                    placeholder="ex: Dos"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom (EN)' : 'Name (EN)'}
                                </label>
                                <input
                                    type="text"
                                    value={newSideName}
                                    onChange={(e) => setNewSideName(e.target.value)}
                                    placeholder="ex: Back"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowAddSideModal(false);
                                    setNewSideName('');
                                    setNewSideNameFr('');
                                    setNewSideImageSrc('');
                                    if (addSideFileInputRef.current) addSideFileInputRef.current.value = '';
                                }}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                            >
                                {locale === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    if (newSideName && newSideNameFr) {
                                        const id = newSideName.toLowerCase().replace(/\s+/g, '-');
                                        const sourceSide = sides[0];
                                        setSides(prev => [
                                            ...prev,
                                            {
                                                id,
                                                name: newSideName,
                                                nameFr: newSideNameFr,
                                                designZone: {
                                                    id: `zone-${id}`,
                                                    x: sourceSide.designZone.x,
                                                    y: sourceSide.designZone.y,
                                                    width: sourceSide.designZone.width,
                                                    height: sourceSide.designZone.height,
                                                    elements: []
                                                },
                                                colors: sourceSide.colors.map(c => ({
                                                    ...c,
                                                    imageSrc: ''
                                                }))
                                            }
                                        ]);
                                        setNewSideName('');
                                        setNewSideNameFr('');
                                        setNewSideImageSrc('');
                                        if (addSideFileInputRef.current) addSideFileInputRef.current.value = '';
                                        setShowAddSideModal(false);
                                    }
                                }}
                                disabled={!newSideName || !newSideNameFr}
                                className="flex-1 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {locale === 'fr' ? 'Ajouter' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ EDIT SIDE MODAL ══════════════════════ */}
            {showEditSideModal && editingSideId && (
                <div className="fixed inset-x-0 bottom-24 flex justify-center z-100 px-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Edit2 size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-900">
                                    {locale === 'fr' ? 'Modifier la Face' : 'Edit Side'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {locale === 'fr' ? 'Modifier les détails' : 'Change side details'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (sides.length <= 1) {
                                        alert(locale === 'fr' ? 'Impossible de supprimer la dernière face.' : 'Cannot delete the last side.');
                                        return;
                                    }
                                    if (confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette face ?' : 'Are you sure you want to delete this side?')) {
                                        const newSides = sides.filter(s => s.id !== editingSideId);
                                        setSides(newSides);
                                        if (activeSideId === editingSideId) {
                                            handleSwitchSide(newSides[0].id);
                                        }
                                        setShowEditSideModal(false);
                                    }
                                }}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>



                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom (FR)' : 'Name (FR)'}
                                </label>
                                <input
                                    type="text"
                                    value={editSideNameFr}
                                    onChange={(e) => setEditSideNameFr(e.target.value)}
                                    placeholder="ex: Dos"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate">
                                    {locale === 'fr' ? 'Nom (EN)' : 'Name (EN)'}
                                </label>
                                <input
                                    type="text"
                                    value={editSideName}
                                    onChange={(e) => setEditSideName(e.target.value)}
                                    placeholder="ex: Back"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEditSideModal(false)}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                            >
                                {locale === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    if (editSideName && editSideNameFr) {
                                        setSides(prev => prev.map(s =>
                                            s.id === editingSideId
                                                ? { ...s, name: editSideName, nameFr: editSideNameFr }
                                                : s
                                        ));
                                        setShowEditSideModal(false);
                                    }
                                }}
                                disabled={!editSideName || !editSideNameFr}
                                className="flex-1 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {locale === 'fr' ? 'Enregistrer' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ OFF ZONE DIALOG ══════════════════════ */}
            {offZoneElementId && (
                <div className="fixed inset-x-0 bottom-24 flex justify-center z-100 px-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {locale === 'fr' ? 'Élément hors zone' : 'Element off-zone'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {locale === 'fr' ? 'Voulez-vous le replacer ou le supprimer ?' : 'Want to center it or delete?'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setElements(elements.filter(el => el.id !== offZoneElementId));
                                    setOffZoneElementId(null);
                                }}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                            >
                                {locale === 'fr' ? 'Supprimer' : 'Delete'}
                            </button>
                            <button
                                onClick={() => {
                                    const el = elements.find(e => e.id === offZoneElementId);
                                    if (el) {
                                        handleElementChange(offZoneElementId, {
                                            ...el,
                                            x: designZone.width / 2,
                                            y: designZone.height / 2
                                        });
                                    }
                                    setOffZoneElementId(null);
                                }}
                                className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {locale === 'fr' ? 'Recentrer' : 'Center'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════ GLOBAL LOADING OVERLAY ══════════════════════ */}
            {(isSavingInEditor || isPreloading) && (
                <div className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <Tag size={20} className="text-black animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col items-center">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">
                            {isPreloading
                                ? (locale === 'fr' ? 'Initialisation du studio...' : 'Initializing studio...')
                                : (locale === 'fr' ? 'Génération du studio...' : 'Generating studio assets...')}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest animate-pulse">
                            {isPreloading
                                ? (locale === 'fr' ? 'Mise en cache des déclinaisons' : 'Caching product variations')
                                : (locale === 'fr' ? 'Optimisation des aperçus PNG' : 'Optimizing PNG previews')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
