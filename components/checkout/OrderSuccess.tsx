'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, MessageCircle, Truck } from 'lucide-react';

interface OrderSuccessProps {
    orderNumber: string;
}

export function OrderSuccess({ orderNumber }: OrderSuccessProps) {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-brand-dark mb-2">Order Confirmed!</h1>
                <p className="text-brand-grey mb-6">Thank you for shopping with BeeHouseholds</p>

                {/* Order Number + WhatsApp Quick Follow-up */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8">
                    <p className="text-sm text-brand-grey mb-1">Your Order Number</p>
                    <p className="text-xl font-mono font-bold text-brand-dark">{orderNumber}</p>

                    {/* WhatsApp Quick Follow-up */}
                    <a
                        href={`https://wa.me/254720151058?text=Hi BeeHouseholds, I'd like to follow up on my order: ${orderNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-[#b88a35] font-medium transition"
                    >

                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <path fill="#22c55e" d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4"></path>
                        </svg>

                        Send this order number via WhatsApp for faster follow-up
                    </a>

                    <p className="text-xs text-brand-grey mt-2">
                        Or save this number to track your order manually
                    </p>
                </div>

                {/* Next Steps */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-lg text-left">
                        <MessageCircle className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-brand-dark">We&apos;ll contact you shortly</p>
                            <p className="text-sm text-brand-grey">Expect an SMS/WhatsApp with delivery updates within 1 hour</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-lg text-left">
                        <Truck className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-brand-dark">Delivery Timeline</p>
                            <p className="text-sm text-brand-grey">
                                Nairobi: Same/next day • Outside: Courier will confirm timing
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link href="/shop">
                        <Button className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11">
                            <ShoppingBag className="h-4 w-4 mr-2" /> Continue Shopping
                        </Button>
                    </Link>
                    <Link href={`https://wa.me/254720151058?text=Hi, I have a question about my order ${orderNumber}`}>
                        <Button variant="outline" className="w-full h-11 border-brand-gold text-brand-gold hover:bg-brand-gold/5">
                            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Support
                        </Button>
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-brand-grey mt-6">
                    Need help? Call/WhatsApp: <a href="tel:+254791242021" className="text-brand-gold hover:underline">0791 242 021</a>
                </p>
            </div>
        </div>
    );
}