"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'en' | 'fr';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Locale, Record<string, string>> = {
    en: {
        nav_home: "Home",
        nav_shop: "Shop",
        nav_categories: "Categories",
        nav_about: "About",
        hero_title: "Bring Your Brand To Every Surface",
        hero_subtitle: "Professional quality prints for businesses, events, and individuals. High-quality apparel and accessories, customized just for you.",
        hero_cta: "Start Creating",
        search_placeholder: "Search components...",
        cat_t_shirts: "T-shirts",
        cat_sweatshirts: "Sweatshirts",
        cat_hats: "Hats",
        cat_jackets_vests: "Jackets & Vests",
        cat_bags: "Bags",
        cat_drinkware: "Drinkware",
        cat_polos: "Polos & Business Wear",
        cat_workwear: "Workwear and Uniforms",
        cat_office: "Office Supplies",
        cat_tech: "Technology",
        cat_signage: "Trade Show & Signage",
        cat_activewear: "Activewear",
        cat_section_title: "Custom T-shirts & Promotional Products for Your Group",
        hero_main_title: "Design. Print. Deliver.",
        hero_main_subtitle: "Your complete web-to-print solution for custom apparel, business stationery, and promotional products. Fast, simple, and professional.",
        hero_main_cta: "Create Your Project",
        steps_title: "How It Works",
        step_1_title: "Choose Product",
        step_1_desc: "Select from our premium catalog of apparel and branding surfaces.",
        step_2_title: "Add Your Design",
        step_2_desc: "Upload your artwork or work with our templates to create your vision.",
        step_3_title: "We Print & Deliver",
        step_3_desc: "Expert printing and fast shipping directly to your business or home.",
        arrivals_title: "New Arrivals Are Here",
        arrivals_desc: "Gear up for the season with fresh picks from the brands you love. From cozy layers to cool accessories, we're always adding more!",
        arrivals_cta: "Shop Now",
        footer_support: "Support",
        footer_contact: "Contact Us",
        footer_shipping: "Shipping Info",
        footer_faq: "FAQs",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service",
        footer_phone: "Phone",
        footer_email: "Email",
        footer_rights: "All rights reserved.",
        footer_description: "Your complete web-to-print solution for custom apparel, business stationery, and promotional products.",
    },
    fr: {
        nav_home: "Accueil",
        nav_shop: "Boutique",
        nav_categories: "Catégories",
        nav_about: "À propos",
        hero_title: "Donnez vie à votre marque sur tous supports",
        hero_subtitle: "Impressions de qualité professionnelle pour entreprises, événements et particuliers. Vêtements et accessoires de haute qualité, personnalisés pour vous.",
        hero_cta: "Commencer à créer",
        search_placeholder: "Rechercher...",
        cat_t_shirts: "T-shirts",
        cat_sweatshirts: "Sweat-shirts",
        cat_hats: "Chapeaux",
        cat_jackets_vests: "Vestes et Gilets",
        cat_bags: "Sacs",
        cat_drinkware: "Articles de boisson",
        cat_polos: "Polos et Tenues de ville",
        cat_workwear: "Vêtements de travail",
        cat_office: "Fournitures de bureau",
        cat_tech: "Technologie",
        cat_signage: "Signalétique Salon",
        cat_activewear: "Vêtements de sport",
        cat_section_title: "T-shirts personnalisés et objets publicitaires pour votre groupe",
        hero_main_title: "Concevez. Imprimez. Livrez.",
        hero_main_subtitle: "Votre solution web-to-print complète pour vêtements personnalisés, papeterie d'entreprise et objets publicitaires.",
        hero_main_cta: "Créer votre projet",
        steps_title: "Comment ça marche",
        step_1_title: "Choisissez votre produit",
        step_1_desc: "Sélectionnez parmi notre catalogue premium de vêtements et supports.",
        step_2_title: "Ajoutez votre design",
        step_2_desc: "Téléchargez votre logo ou utilisez nos modèles pour créer votre vision.",
        step_3_title: "On imprime et on livre",
        step_3_desc: "Impression experte et expédition rapide directement chez vous.",
        arrivals_title: "Les nouveautés sont arrivées",
        arrivals_desc: "Préparez-vous pour la saison avec les nouveautés de vos marques préférées. Des vêtements confortables aux accessoires tendance, nous en ajoutons sans cesse !",
        arrivals_cta: "Acheter maintenant",
        footer_support: "Support",
        footer_contact: "Contactez-nous",
        footer_shipping: "Livraison",
        footer_faq: "FAQ",
        footer_privacy: "Politique de confidentialité",
        footer_terms: "Conditions d'utilisation",
        footer_phone: "Téléphone",
        footer_email: "Email",
        footer_rights: "Tous droits réservés.",
        footer_description: "Votre solution web-to-print complète pour vêtements personnalisés, papeterie d'entreprise et objets publicitaires.",
    }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
    children,
    initialLocale = 'en'
}) => {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    useEffect(() => {
        // Sync state if initialLocale changes (e.g. server-side detection changes)
        if (initialLocale && initialLocale !== locale) {
            setLocaleState(initialLocale);
        }
    }, [initialLocale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        // Set cookie for server-side detection on next request
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
    };

    const t = (key: string) => {
        return translations[locale][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
