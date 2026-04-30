import Link from 'next/link';
import { Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-stone-900 text-stone-300 mt-auto">
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">🐝 BeeHouseholds</h3>
                    <p className="text-sm text-stone-400">Making your home smarter, warmer, and safer. Nairobi&apos;s trusted destination for premium home essentials.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/shop" className="hover:text-amber-500 transition">Shop Collection</Link></li>
                        <li><Link href="/about" className="hover:text-amber-500 transition">About Us</Link></li>
                        <li><Link href="/track" className="hover:text-amber-500 transition">Track Order</Link></li>
                        <li><Link href="/contact" className="hover:text-amber-500 transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-white mb-4">Contact & Location</h4>
                    <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                        <span>Iconic Business Plaza, Moi Avenue, 6th Floor, Shop P1, Nairobi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-amber-500" />
                        <span>0720 151 058</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Mon-Sat: 8AM-6PM | Sun: 10AM-4PM</span>
                    </div>
                </div>

                {/* Social/Trust */}
                <div>
                    <h4 className="font-semibold text-white mb-4">Social & Trust</h4>
                    <a href="https://www.tiktok.com/@bee_households260" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-amber-500 transition mb-4">
                        🎵 TikTok @bee_households260
                    </a>
                    <p className="text-xs text-stone-500">133K+ Likes | Countrywide Delivery | Quality Guarantee</p>
                </div>
            </div>

            <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
                © {currentYear} BeeHouseholds. All rights reserved.
            </div>
        </footer>
    );
}