'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface MpesaInstructionsProps {
    amount: number;
    onPaymentConfirmed: () => void;
    loading?: boolean;
    deliveryOption?: 'nairobi' | 'outside' | 'pickup';
}

export function MpesaInstructions({ amount, onPaymentConfirmed, loading = false, deliveryOption }: MpesaInstructionsProps) {
    const [copied, setCopied] = useState(false);
    const [transactionCode, setTransactionCode] = useState('');

    const paybill = '123456'; // Replace with your actual Paybill
    const account = 'BEEHOUSE'; // Replace with your actual Account Number

    const handleCopy = async () => {
        const text = `Paybill: ${paybill}\nAccount: ${account}\nAmount: KSh ${amount.toLocaleString()}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Payment details copied');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmPayment = () => {
        if (!transactionCode.trim()) {
            toast.error('Please enter your M-Pesa transaction code');
            return;
        }
        // In production: verify code with Daraja API or admin confirmation
        toast.success('Payment confirmed! Processing your order...');
        onPaymentConfirmed();
    };

    return (
        <div className="space-y-4">
            {/* M-Pesa Visual */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="font-semibold text-green-900">Pay with M-Pesa</p>
                    <p className="text-sm text-green-700">Lipa Na M-Pesa • Paybill</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 text-sm">
                <ol className="list-decimal list-inside space-y-2 text-brand-grey">
                    <li>Go to <strong>M-Pesa Menu</strong> → <strong>Lipa Na M-Pesa</strong></li>
                    <li>Select <strong>Paybill</strong></li>
                    <li>Enter Paybill: <span className="font-mono font-semibold text-brand-dark">{paybill}</span></li>
                    <li>Enter Account: <span className="font-mono font-semibold text-brand-dark">{account}</span></li>
                    <li>Enter Amount: <span className="font-semibold text-brand-dark">KSh {amount.toLocaleString()}</span></li>
                    <li>Enter your M-Pesa PIN and confirm</li>
                </ol>
            </div>



            {/* Copy Button */}
            <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold/5"
            >
                {copied ? (
                    <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Copied!
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4 mr-2" /> Copy Payment Details
                    </>
                )}
            </Button>

            {/* Transaction Code Input */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
                <Label htmlFor="transactionCode">M-Pesa Transaction Code *</Label>
                <div className="flex gap-2">
                    <Input
                        id="transactionCode"
                        value={transactionCode}
                        onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                        placeholder="e.g., SLK7H8X9Y0"
                        className="font-mono uppercase flex-1 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                        maxLength={10}
                    />
                    <Button
                        type="button"
                        onClick={handleConfirmPayment}
                        disabled={loading || !transactionCode.trim()}
                        className="bg-brand-gold hover:bg-[#b88a35] text-white shrink-0"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                    </Button>
                </div>
                <p className="text-[11px] text-brand-grey">
                    Found in your M-Pesa confirmation SMS (e.g., &quot;You have sent KSh X to BEEHOUSE... Ref: SLK7H8X9Y0&quot;)
                </p>
            </div>

            {/* Security Note */}
            <p className="text-xs text-brand-grey text-center pt-2">
                🔐 Never share your M-Pesa PIN • We never ask for it • Order confirmed after payment verification
            </p>

            {/* Inside MpesaInstructions return, below the payment steps */}
            {deliveryOption === 'outside' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">📦 Outside Nairobi? Your exact courier fee will be confirmed via WhatsApp after payment.</p>
                </div>
            )}
            {deliveryOption === 'pickup' && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-900">🏪 Pick up ready in 24hrs. We&apos;ll SMS you when your order is packed.</p>
                </div>
            )}
        </div>
    );
}