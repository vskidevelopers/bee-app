'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalLayoutProps {
    children: ReactNode;
    publicNav: ReactNode;
    publicFooter: ReactNode;
}

/**
 * Client component that conditionally renders public Navbar/Footer
 * Prevents hydration mismatches and layout nesting issues on /admin routes
 */
export const ConditionalLayout = ({
    children,
    publicNav,
    publicFooter,
}: ConditionalLayoutProps) => {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && publicNav}
            <main className="flex-1">{children}</main>
            {!isAdminRoute && publicFooter}
        </>
    );
};