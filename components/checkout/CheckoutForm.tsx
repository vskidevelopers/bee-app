'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder } from '@/lib/actions/orders';
import { MpesaInstructions } from './MpesaInstructions';


interface CheckoutFormProps {
    deliveryOption: 'nairobi' | 'outside' | 'pickup';
    deliveryFee: number;
}

export function CheckoutForm({ deliveryOption, deliveryFee }: CheckoutFormProps) {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        deliveryAddress: deliveryOption === 'pickup' ? 'Pick up in-store' : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }
        if (!formData.phone.trim() || !/^254\d{9}$|^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            toast.error('Please enter a valid Kenyan phone number (e.g., 0720151058 or 254720151058)');
            return false;
        }
        if (deliveryOption !== 'pickup' && !formData.deliveryAddress.trim()) {
            toast.error('Please enter your delivery address');
            return false;
        }
        return true;
    };

    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStep('payment');
        console.info('[Checkout] Moving to payment step', { formData, deliveryOption });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        console.info('[Checkout] Placing order', { formData, items: items.length, subtotal, deliveryFee });

        // Format items for order
        const orderItems = items.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            priceAtPurchase: item.discountPrice || item.price,
            specifications: item.specifications || {},
        }));

        // Format phone to E.164
        const phone = formData.phone.startsWith('254')
            ? formData.phone
            : `254${formData.phone.replace(/^0/, '')}`;

        const result = await createOrder({
            customer: {
                name: formData.name,
                phone,
                email: formData.email || undefined,
                deliveryAddress: formData.deliveryAddress,
                location: deliveryOption,
            },
            items: orderItems,
            deliveryOption,
            deliveryFee,
            subtotal,
            total: subtotal + deliveryFee,
        });

        setLoading(false);

        if (result.success && result.orderNumber) {
            console.info('[Checkout] Order placed successfully', { orderNumber: result.orderNumber });
            clearCart();
            // Redirect to success state with order number
            router.replace(`/checkout?success=true&orderNumber=${result.orderNumber}`);
        } else {
            console.error('[Checkout] Order failed', result);
            toast.error(result.message || 'Failed to place order. Please try again.');
        }
    };

    // Step 1: Customer Details
    if (step === 'details') {
        return (
            <form onSubmit={handleContinueToPayment} className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-brand-dark mb-1">Contact & Delivery</h2>
                    <p className="text-sm text-brand-grey">Enter your details to proceed with M-Pesa payment</p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Jane Doe"
                        required
                        className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0720 151 058"
                        required
                        pattern="^(\+254|254|0)?[79]\d{8}$"
                        className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold font-mono"
                    />
                    <p className="text-[11px] text-brand-grey">We&apos;ll send order updates via SMS/WhatsApp</p>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                    />
                </div>

                {/* Delivery Address (Conditional) */}
                {deliveryOption !== 'pickup' && (
                    <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">
                            {deliveryOption === 'nairobi' ? 'Delivery Address in Nairobi *' : 'Delivery Address *'}
                        </Label>
                        <Textarea
                            id="deliveryAddress"
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            placeholder={deliveryOption === 'nairobi'
                                ? "e.g., Apartment 4B, Riverside Drive, Nairobi"
                                : "e.g., Moi Avenue, Mombasa (Courier will contact you)"}
                            required
                            rows={3}
                            className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold resize-y"
                        />
                        {deliveryOption === 'outside' && (
                            <p className="text-[11px] text-brand-grey flex items-start gap-1">
                                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                For areas outside Nairobi, our courier partner will contact you to confirm the exact delivery fee before dispatch.
                            </p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11 mt-2"
                >
                    Continue to Payment
                </Button>

                {/* Trust Note */}
                <p className="text-xs text-brand-grey text-center pt-2">
                    🔒 Your data is secure • No account required • M-Pesa only
                </p>
            </form>
        );
    }

    // Step 2: Payment Instructions (M-Pesa)
    if (step === 'payment') {
        return (
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-brand-dark mb-1">Confirm & Pay with M-Pesa</h2>
                    <p className="text-sm text-brand-grey">Follow the instructions below to complete your order</p>
                </div>

                {/* Order Recap */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <h3 className="font-medium text-brand-dark mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-brand-grey">Items ({items.length})</span>
                            <span>KSh {subtotal.toLocaleString()}</span>
                        </div>
                        {deliveryOption !== 'pickup' && (
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Delivery</span>
                                <span>{deliveryOption === 'nairobi' ? 'KSh 300' : 'Courier (quote after)'}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-brand-dark pt-2 border-t border-stone-200">
                            <span>Total</span>
                            <span>KSh {(subtotal + deliveryFee).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* M-Pesa Instructions */}
                <MpesaInstructions
                    amount={subtotal + deliveryFee}
                    onPaymentConfirmed={handlePlaceOrder}
                    loading={loading}
                />

                {/* Back Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('details')}
                    className="w-full h-11 border-stone-300 text-brand-dark hover:bg-stone-50"
                    disabled={loading}
                >
                    ← Edit Details
                </Button>
            </div>
        );
    }

    return null;
}