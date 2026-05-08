import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Truck, Store, Phone, MessageCircle, CheckCircle,
    Shield, Heart, Users, MapPin, Clock, Star
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us - BeeHouseholds Nairobi | Smart Home & Decor Experts',
    description: 'Learn about BeeHouseholds: Nairobi-based retailer of warm duvets, smart home gadgets, and premium decor. Quality products, M-Pesa payment, countrywide delivery.',
    keywords: ['about BeeHouseholds', 'Nairobi home decor', 'smart home Kenya', 'duvets Nairobi', 'BeeHouseholds story', 'Kenya e-commerce'],
};

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'Customer First',
            desc: 'We listen, respond within 1 hour, and tailor solutions to your needs — whether you are buying one duvet or furnishing a hotel.',
        },
        {
            icon: Shield,
            title: 'Quality Guaranteed',
            desc: 'Every product is hand-selected for durability, comfort, and style. If you are not satisfied, we make it right.',
        },
        {
            icon: Truck,
            title: 'Reliable Delivery',
            desc: 'In-house riders for Nairobi (KSh 300), trusted couriers for the rest of Kenya. You always know when to expect your order.',
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp-First',
            desc: 'Prefer to chat? We are just a message away. Quick quotes, order updates, and support — all via WhatsApp.',
        },
    ];

    const stats = [
        { label: 'Happy Customers', value: '2,500+' },
        { label: 'Products Delivered', value: '15,000+' },
        { label: 'Nairobi Areas Served', value: '50+' },
        { label: 'Avg. Response Time', value: '<1 Hour' },
    ];

    return (
        <div className="min-h-screen bg-stone-50">

            {/* Hero Section */}
            <section className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                            About BeeHouseholds
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                            Bringing Comfort & Style to Kenyan Homes
                        </h1>
                        <p className="text-lg text-brand-grey mb-8">
                            We are a Nairobi-based retailer specializing in warm duvets, smart home gadgets, and premium decor —
                            delivered with care, paid for with M-Pesa, and supported via WhatsApp.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/shop">
                                <Button className="bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11 px-6">
                                    Shop Collection
                                </Button>
                            </Link>
                            <Link href="https://wa.me/254720151058" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold/5 h-11 px-6">
                                    <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl font-bold text-brand-dark mb-4">Our Story</h2>
                            <div className="space-y-4 text-brand-grey">
                                <p>
                                    BeeHouseholds started with a simple observation: many Kenyan homes struggle to find
                                    <strong className="text-brand-dark"> quality, affordable home essentials</strong> that combine comfort, style, and reliability.
                                </p>
                                <p>
                                    What began as a small operation supplying warm duvets to Nairobi apartments has grown into a
                                    trusted source for smart home gadgets, mosquito nets, furniture, and custom decor — all curated
                                    with the Kenyan climate and lifestyle in mind.
                                </p>
                                <p>
                                    Today, we serve customers across Kenya, from individual households to hotels and corporate projects.
                                    Our promise remains the same: <strong className="text-brand-dark">quality products, transparent pricing, and human-centered support</strong>.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-brand-grey">M-Pesa Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-brand-grey">Countrywide Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-brand-grey">1-Hour Response</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-brand-grey">Quality Guarantee</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative aspect-square md:aspect-auto md:h-[400px] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
                            <img
                                src="https://res.cloudinary.com/dlmmsamck/image/upload/v1778227819/f0c89b58-1693-42f2-aff4-77ea56f6c792_boljsr.png"
                                alt="BeeHouseholds store in Nairobi"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl font-bold text-brand-dark mb-3">What We Stand For</h2>
                        <p className="text-brand-grey">
                            These values guide every decision we make — from product selection to customer support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <Card key={idx} className="border-stone-200 hover:border-brand-gold/50 transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-4">
                                            <Icon className="h-6 w-6 text-brand-gold" />
                                        </div>
                                        <h3 className="font-semibold text-brand-dark mb-2">{value.title}</h3>
                                        <p className="text-sm text-brand-grey">{value.desc}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-20 bg-stone-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-4">
                                <p className="text-3xl font-bold text-brand-dark mb-1">{stat.value}</p>
                                <p className="text-sm text-brand-grey">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery & Payment Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How We Serve You</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Delivery */}
                            <div className="text-center p-6 bg-white rounded-xl border border-stone-200">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <Truck className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-brand-dark mb-2">Delivery Options</h3>
                                <ul className="text-sm text-brand-grey space-y-2 text-left">
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Nairobi:</strong> In-house riders, KSh 300 flat</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Outside Nairobi:</strong> Trusted couriers, quote after order</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Pick Up:</strong> Collect from our Nairobi store, free</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Payment */}
                            <div className="text-center p-6 bg-white rounded-xl border border-stone-200">
                                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-7 w-7 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-brand-dark mb-2">Secure Payment</h3>
                                <ul className="text-sm text-brand-grey space-y-2 text-left">
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>M-Pesa Only:</strong> Lipa Na M-Pesa, Paybill</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Transaction Code:</strong> Required for order confirmation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>No Card Data:</strong> We never store payment details</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div className="text-center p-6 bg-white rounded-xl border border-stone-200">
                                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-7 w-7 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-brand-dark mb-2">Human Support</h3>
                                <ul className="text-sm text-brand-grey space-y-2 text-left">
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>WhatsApp First:</strong> Quick quotes & updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Response Time:</strong> Under 1 hour during business hours</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-gold mt-0.5">•</span>
                                        <span><strong>Real People:</strong> No bots, no scripts</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit Us Section */}
            <section className="py-12 md:py-20 bg-white border-t border-stone-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-7 w-7 text-brand-gold" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Visit Our Store</h2>
                        <p className="text-brand-grey mb-6">
                            Prefer to see products in person? Stop by our Nairobi location.
                        </p>

                        <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 text-left mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-brand-dark">Address</p>
                                    <p className="text-brand-grey">Iconic Business Plaza, Moi Avenue</p>
                                    <p className="text-brand-grey">6th Floor, Shop P1, Nairobi, Kenya</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-brand-dark">Business Hours</p>
                                    <p className="text-brand-grey">Monday - Saturday: 8:00 AM - 6:00 PM EAT</p>
                                    <p className="text-brand-grey">Sunday: By appointment only</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="https://wa.me/254720151058" target="_blank" rel="noopener noreferrer">
                                <Button className="bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11 px-6">
                                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Directions
                                </Button>
                            </a>
                            <a href="tel:+254791242021">
                                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold/5 h-11 px-6">
                                    <Phone className="h-4 w-4 mr-2" /> Call Us
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20 bg-brand-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Upgrade Your Space?</h2>
                    <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
                        Browse our collection of warm duvets, smart home gadgets, and premium decor —
                        all with secure M-Pesa payment and reliable delivery across Kenya.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/shop">
                            <Button className="bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11 px-8">
                                Shop Now
                            </Button>
                        </Link>
                        <Link href="/quote">
                            <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 h-11 px-8">
                                Request a Quote
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name: 'BeeHouseholds',
                        image: 'https://beehouseholds.co.ke/logo.png',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'Iconic Business Plaza, Moi Avenue, 6th Floor, Shop P1',
                            addressLocality: 'Nairobi',
                            addressCountry: 'KE',
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: -1.286389,
                            longitude: 36.817223,
                        },
                        url: 'https://beehouseholds.co.ke',
                        telephone: '+254791242021',
                        priceRange: 'KSh',
                        openingHoursSpecification: [
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                opens: '08:00',
                                closes: '18:00',
                            },
                        ],
                        sameAs: [
                            'https://wa.me/254720151058',
                        ],
                    }),
                }}
            />
        </div>
    );
}