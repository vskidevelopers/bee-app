import type { Metadata } from 'next';
import { QuoteForm } from '@/components/quote/QuoteForm';
import { QuoteSuccess } from '@/components/quote/QuoteSuccess';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Request a Quote - Custom Home Solutions | BeeHouseholds',
    description: 'Get a personalized quote for duvets, smart home gadgets, or custom decor. Fast response via WhatsApp or call. Nairobi & countrywide delivery.',
    keywords: ['quote request Nairobi', 'custom duvets Kenya', 'smart home quote', 'home decor pricing', 'BeeHouseholds quotation'],
};

export const dynamic = 'force-dynamic';

export default async function QuotePage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; quoteId?: string }>;
}) {
    const params = await searchParams;

    if (params.success === 'true' && params.quoteId) {
        return <QuoteSuccess quoteId={params.quoteId} />;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-brand-grey hover:text-brand-gold transition">
                        <ArrowLeft className="h-4 w-4" /> Back to Shop
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-brand-dark mb-2">Request a Quote</h1>
                        <p className="text-brand-grey">
                            Tell us what you need — we&apos;ll respond within 1 hour via WhatsApp or call
                        </p>
                    </div>
                    <QuoteForm />
                    <div className="mt-12 text-center text-xs text-brand-grey">
                        <p className="mb-2">🔒 Your info is secure • 💬 WhatsApp: 0791 242 021 • 🚚 Countrywide delivery</p>
                        <p>Prefer to chat? <a href="https://wa.me/254720151058" className="text-brand-gold hover:underline">Start a conversation</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}