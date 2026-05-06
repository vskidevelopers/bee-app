import type { Metadata } from 'next';
// import { redirect } from 'next/navigation';
// import { getPublicProducts } from '@/lib/actions/products';
import { OrderSummary } from '@/components/public/OrderSummary';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Checkout - Secure M-Pesa Payment | BeeHouseholds',
    description: 'Complete your order with secure M-Pesa payment. Countrywide delivery in Kenya. Guest checkout - no account needed.',
    keywords: ['checkout', 'M-Pesa payment', 'buy online Kenya', 'secure checkout Nairobi', 'BeeHouseholds'],
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{
        delivery?: string;
        fee?: string;
        success?: string;
        orderNumber?: string;
    }>;
}) {
    const params = await searchParams;

    // If success flag is present, show confirmation
    if (params.success === 'true' && params.orderNumber) {
        return <OrderSuccess orderNumber={params.orderNumber} />;
    }

    // Parse delivery params
    const deliveryOption = (params.delivery as 'nairobi' | 'outside' | 'pickup') || 'nairobi';
    const deliveryFeeFromUrl = params.fee ? Number(params.fee) : 300;

    // For SEO: Pre-fetch product data (optional, for related products later)
    // const products = await getPublicProducts({ limit: 4 });

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/cart" className="flex items-center gap-2 text-sm text-brand-grey hover:text-brand-gold transition">
                        <ArrowLeft className="h-4 w-4" /> Back to Cart
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* Progress Indicator (Mobile-First) */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 text-brand-gold font-medium">
                                <span className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs">1</span>
                                Cart
                            </span>
                            <span className="w-8 h-px bg-stone-300"></span>
                            <span className="flex items-center gap-1 text-brand-dark font-medium">
                                <span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">2</span>
                                Checkout
                            </span>
                            <span className="w-8 h-px bg-stone-300"></span>
                            <span className="flex items-center gap-1 text-stone-400">
                                <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs">3</span>
                                Confirmation
                            </span>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <CheckoutForm
                                deliveryOption={deliveryOption}
                                deliveryFee={deliveryFeeFromUrl}
                            />
                        </div>



                    </div>
                </div>
            </div>

            {/* Trust Badges Footer */}
            <div className="bg-white border-t border-stone-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-xs text-brand-grey">
                    <p className="mb-2">🔒 Secure M-Pesa Payment • 🚚 Countrywide Delivery • ✅ Quality Guarantee</p>
                    <p>Need help? WhatsApp us: <a href="https://wa.me/254720151058" className="text-brand-gold hover:underline">0791 242 021</a></p>
                </div>
            </div>
        </div>
    );
}

