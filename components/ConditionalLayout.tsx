"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        };

        // Delay until after current paint cycle
        requestAnimationFrame(() => {
            requestAnimationFrame(handleScroll);
        });
    }, [pathname]);

    // Define routes where Header and Footer should be hidden
    const hideHeader = pathname === "/login" || pathname === "/register";
    const hideFooter = pathname === "/login" || pathname === "/register" || pathname.startsWith("/customize");

    return (
        <>
            {!hideHeader && <Header />}
            {children}
            {!hideFooter && <Footer />}
        </>
    );
}
