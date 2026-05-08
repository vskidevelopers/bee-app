'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard, ShoppingCart, Package, Users, LogOut,
    Menu, X, FileText, Mail, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/quotations', label: 'Quotations', icon: FileText },
    { href: '/admin/contacts', label: 'Contacts', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Route Guard: Redirect unauthenticated users to /login
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-brand-grey animate-pulse">Verifying access...</div>
            </div>
        );
    }

    if (!user) return null; // Prevents flash before redirect

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    // ✅ Helper: Close mobile menu after navigation
    const handleMobileNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">

            {/* ========== MOBILE: Sticky Top Header ========== */}
            <header className="md:hidden sticky top-0 z-50 bg-white border-b border-stone-200 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-stone-100">
                                <Menu className="h-5 w-5 text-brand-dark" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 bg-white p-0">
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between border-b border-stone-200 p-4">
                                <span className="font-bold text-brand-dark">BeeHouseholds Admin</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Mobile Nav Links */}
                            <nav className="p-4 space-y-1">
                                {adminNav.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleMobileNavClick}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${pathname === item.href
                                                ? 'bg-brand-gold/10 text-brand-gold'
                                                : 'text-brand-grey hover:bg-stone-50 hover:text-brand-dark'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Sign Out */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200 bg-white">
                                <Button
                                    variant="ghost"
                                    onClick={() => { handleSignOut(); handleMobileNavClick(); }}
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <LogOut className="h-5 w-5 mr-2 shrink-0" />
                                    Sign Out
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <span className="font-bold text-brand-dark">Admin Panel</span>
                </div>

                {/* Mobile Cart/Quick Actions (Optional) */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-stone-100">
                        <Users className="h-5 w-5 text-brand-grey" />
                    </Button>
                </div>
            </header>

            {/* ========== DESKTOP: Static Sidebar ========== */}
            <aside
                className={`hidden md:flex flex-col fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-stone-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200">
                    <span className={`font-bold text-brand-dark truncate transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                        BeeHouseholds
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="h-8 w-8 hover:bg-stone-100"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="h-4 w-4 text-brand-grey" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-brand-grey" />
                        )}
                    </Button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {adminNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'bg-brand-gold/10 text-brand-gold'
                                    : 'text-brand-grey hover:bg-stone-50 hover:text-brand-dark'
                                }`}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="p-3 border-t border-stone-200">
                    <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${!sidebarOpen ? 'px-3' : ''
                            }`}
                        title={!sidebarOpen ? 'Sign Out' : undefined}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className={`ml-2 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                            }`}>
                            Sign Out
                        </span>
                    </Button>
                </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            <main className="flex-1 min-w-0 pt-16 md:pt-0">
                {/* Content Wrapper */}
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>

            {/* ✅ Mobile Overlay: Close menu when clicking outside */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}