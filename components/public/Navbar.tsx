'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, Phone, X, MapPin } from 'lucide-react';
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
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
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
                                'text-sm font-medium transition-colors hover:text-brand-gold',
                                pathname === link.href ? 'text-brand-gold' : 'text-brand-grey'
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
                        className="gap-2 border-brand-gold text-brand-gold hover:bg-brand-gold/5 hover:text-brand-gold"
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
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white animate-pulse-once">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-stone-100">
                            <Menu className="h-5 w-5 text-brand-dark" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[85vw] max-w-sm bg-white p-0">
                        {/* Sheet Header */}
                        <div className="flex items-center justify-between border-b border-stone-200 p-4">
                            <SheetTitle className="text-brand-dark">Menu</SheetTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileOpen(false)}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">

                            {/* Navigation Links */}
                            <nav className="flex-1 px-4 py-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors mb-1',
                                            pathname === link.href
                                                ? 'bg-brand-gold/10 text-brand-gold'
                                                : 'text-brand-dark hover:bg-stone-50'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Fixed Bottom Section: Cart + Contact */}
                            <div className="border-t border-stone-200 bg-stone-50/50 p-4 space-y-4">

                                {/* Cart Button (Prominent) */}
                                <Button
                                    asChild
                                    className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-12 text-base"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Link href="/cart" className="flex items-center justify-center gap-2">
                                        <ShoppingBag className="h-5 w-5" />
                                        View Cart
                                        {itemCount > 0 && (
                                            <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-brand-gold px-1.5">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>

                                {/* WhatsApp Button */}
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full h-12 border-brand-gold text-brand-gold hover:bg-brand-gold/5 font-medium text-base"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Chat on WhatsApp
                                    </a>
                                </Button>

                                {/* Contact Info (Clean Spacing) */}
                                <div className="pt-2 space-y-3">
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                                        <div className="text-brand-grey leading-relaxed">
                                            <p className="font-medium text-brand-dark">Visit Us</p>
                                            <p>Iconic Business Plaza, Moi Avenue</p>
                                            <p>6th Floor, Shop P1, Nairobi</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-brand-gold shrink-0" />
                                        <div className="text-brand-grey">
                                            <p className="font-medium text-brand-dark">Call/WhatsApp</p>
                                            <a href="tel:+254720151058" className="hover:text-brand-gold transition">
                                                0720 151 058
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Note */}
                                <p className="text-[11px] text-center text-brand-grey pt-2 border-t border-stone-200">
                                    🔒 Secure checkout • M-Pesa accepted • Countrywide delivery
                                </p>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}