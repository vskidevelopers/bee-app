'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, ArrowLeft, Phone } from 'lucide-react';

interface ContactSuccessProps {
    inquiryId: string;
}

export function ContactSuccess({ inquiryId }: ContactSuccessProps) {
    const whatsappMessage = encodeURIComponent(
        `Hi BeeHouseholds, I sent a contact form inquiry (Ref: ${inquiryId}). Please follow up.`
    );
    const whatsappLink = `https://wa.me/254720151058?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-brand-dark mb-2">Message Received!</h1>
                <p className="text-brand-grey mb-6">We&apos;ll respond within 12 hours via WhatsApp or call</p>

                {/* Reference Number */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8">
                    <p className="text-sm text-brand-grey mb-1">Your Reference</p>
                    <p className="text-xl font-mono font-bold text-brand-dark">{inquiryId}</p>

                    {/* WhatsApp Quick Follow-up */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-brand-gold hover:text-[#b88a35] font-medium transition"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Send this reference via WhatsApp for faster follow-up
                    </a>

                    <p className="text-xs text-brand-grey mt-2">
                        Or save this number to reference your message
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link href="/shop">
                        <Button className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11">
                            <ArrowLeft className="h-4 w-4 mr-2 rotate-180" /> Continue Shopping
                        </Button>
                    </Link>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full h-11 border-brand-gold text-brand-gold hover:bg-brand-gold/5">
                            <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp Now
                        </Button>
                    </a>
                    <Button
                        variant="outline"
                        className="w-full h-11 border-stone-300 text-brand-dark hover:bg-stone-50"
                        onClick={() => window.location.assign('tel:+254791242021')}
                    >
                        <Phone className="h-4 w-4 mr-2" /> Call Us Directly
                    </Button>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-brand-grey mt-6">
                    Questions? Call/WhatsApp: <a href="tel:+254791242021" className="text-brand-gold hover:underline">0791 242 021</a>
                </p>
            </div>
        </div>
    );
}