import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSuccess } from '@/components/contact/ContactSuccess';
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us - BeeHouseholds Nairobi | Smart Home & Decor',
    description: 'Get in touch with BeeHouseholds for questions, support, or custom requests. WhatsApp, call, or email — we respond within 1 hour.',
    keywords: ['contact BeeHouseholds', 'Nairobi home decor', 'smart home support Kenya', 'customer service Nairobi', 'BeeHouseholds help'],
};

export const dynamic = 'force-dynamic';

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; inquiryId?: string }>;
}) {
    const params = await searchParams;

    if (params.success === 'true' && params.inquiryId) {
        return <ContactSuccess inquiryId={params.inquiryId} />;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-brand-grey hover:text-brand-gold transition">
                        <ArrowLeft className="h-4 w-4" /> Back to Shop
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">

                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-brand-dark mb-2">Contact Us</h1>
                        <p className="text-brand-grey">
                            Questions, support, or custom requests? We&apos;re here to help.
                        </p>
                    </div>

                    {/* Quick Contact Options (Mobile-Friendly) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <a
                            href="https://wa.me/254720151058"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-brand-gold transition text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <MessageCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-brand-dark">WhatsApp Us</p>
                                <p className="text-sm text-brand-grey">Fastest response • 0791 242 021</p>
                            </div>
                        </a>
                        <a
                            href="tel:+254791242021"
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-brand-gold transition text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Phone className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-brand-dark">Call Us</p>
                                <p className="text-sm text-brand-grey">Mon-Sat • 8AM-6PM EAT</p>
                            </div>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-stone-200"></div>
                        <span className="text-sm text-brand-grey">Or send us a message</span>
                        <div className="flex-1 h-px bg-stone-200"></div>
                    </div>

                    {/* Contact Form */}
                    <ContactForm />

                    {/* Trust Badges */}
                    <div className="mt-12 text-center text-xs text-brand-grey">
                        <p className="mb-2">🔒 Your info is secure • 💬 Response within 1 hour • 🚚 Countrywide support</p>
                    </div>

                </div>
            </div>
        </div>
    );
}