'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Menu, X, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

    return (
        <div className="min-h-screen bg-stone-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
                    }`}
            >
                <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                    <span className={`font-bold text-brand-dark truncate ${sidebarOpen ? '' : 'hidden md:block'}`}>
                        BeeHouseholds
                    </span>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-brand-grey hover:text-brand-dark">
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {adminNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${pathname === item.href
                                ? 'bg-yellow-50 text-brand-gold'
                                : 'text-brand-grey hover:bg-stone-50 hover:text-brand-dark'
                                }`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className={sidebarOpen ? '' : 'hidden md:hidden'}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200">
                    <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5 mr-2 shrink-0" />
                        <span className={sidebarOpen ? '' : 'hidden'}>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30">
                    <span className="font-bold text-brand-dark">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(true)} className="text-brand-grey hover:text-brand-dark">
                        <Menu className="h-5 w-5" />
                    </button>
                </header>
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}