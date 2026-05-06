'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, Phone, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';


const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/track', label: 'Track Order' },
];

export function Navbar() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);



    const whatsappNumber = '254720151058';
    const whatsappMessage = encodeURIComponent(
        "Hi BeeHouseholds, I'm interested in your products. Please share pricing & delivery details."
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Logo className="h-10 w-auto" />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-brand-gold",
                                pathname === link.href
                                    ? "text-brand-gold"
                                    : "text-brand-grey"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 border-brand-gold text-brand-gold hover:bg-yellow-50 hover:text-brand-gold"
                    >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            <Phone className="h-4 w-4" />
                            <span className="hidden lg:inline">WhatsApp Us</span>
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="relative hover:bg-stone-100"
                    >
                        <Link href="/cart">
                            <ShoppingBag className="h-5 w-5 text-brand-dark" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-stone-100">
                            <Menu className="h-5 w-5 text-brand-dark" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                        <SheetHeader className="border-b border-stone-200 pb-4">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-brand-dark">Menu</SheetTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileOpen(false)}
                                    className="hover:bg-stone-100"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </SheetHeader>
                        <nav className="flex flex-col gap-2 mt-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "text-base font-medium p-3 rounded-md transition-colors",
                                        pathname === link.href
                                            ? "bg-yellow-50 text-brand-gold"
                                            : "text-brand-dark hover:bg-stone-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-6 mt-6 border-t border-stone-200 flex flex-col gap-3">
                                <Button
                                    asChild
                                    className="w-full bg-brand-gold hover:bg-[#b88a35] text-white"
                                >
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Chat on WhatsApp
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="relative hover:bg-stone-100">
                                    <Link href="/cart">
                                        <ShoppingBag className="h-5 w-5 text-brand-dark" />
                                        {itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white animate-pulse-once">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>
                            </div>
                            {/* Mobile Contact Info */}
                            <div className="pt-6 mt-6 border-t border-stone-200 space-y-3">
                                <div className="text-sm text-brand-grey">
                                    <p className="font-medium text-brand-dark mb-1">Visit Us:</p>
                                    <p>Iconic Business Plaza, Moi Avenue</p>
                                    <p>6th Floor, Shop P1, Nairobi</p>
                                </div>
                                <div className="text-sm text-brand-grey">
                                    <p className="font-medium text-brand-dark mb-1">Hours:</p>
                                    <p>Mon-Sat: 8AM - 6PM</p>
                                    <p>Sun: 10AM - 4PM</p>
                                </div>
                                <div className="text-sm text-brand-grey">
                                    <p className="font-medium text-brand-dark mb-1">Call/WhatsApp:</p>
                                    <p>0720 151 058</p>
                                </div>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}