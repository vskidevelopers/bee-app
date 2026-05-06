import type { Metadata } from 'next';
import { TrackForm } from '@/components/track/TrackForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Track Your Order | BeeHouseholds',
    description: 'Check the real-time status of your BeeHouseholds order. Enter your order number and phone number to track delivery progress.',
    keywords: ['track order BeeHouseholds', 'order status Kenya', 'delivery tracking Nairobi', 'BeeHouseholds order lookup'],
};

export const dynamic = 'force-dynamic';

export default function TrackPage() {
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
                {/* Page Header */}
                <div className="max-w-lg mx-auto text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-dark mb-2">Track Your Order</h1>
                    <p className="text-brand-grey">
                        Enter your order number and the phone number used during checkout
                    </p>
                </div>

                {/* Form & Results */}
                <TrackForm />

                {/* Footer Help */}
                <div className="max-w-lg mx-auto mt-8 text-center text-xs text-brand-grey">
                    <p>Can&apos;t find your order? <a href="https://wa.me/254720151058" className="text-brand-gold hover:underline">WhatsApp us</a> with your payment reference.</p>
                </div>
            </div>
        </div>
    );
}