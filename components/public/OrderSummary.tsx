// components/public/OrderSummary.tsx
import { ReactNode } from 'react';

interface OrderSummaryProps {
    subtotal: number;
    itemCount: number;
    deliveryLabel: string; // "KSh 300" | "Courier" | ""
    deliveryFee: number;   // For calculation only, not displayed directly
    total: number;
    children?: ReactNode;
    note?: string;
    hideDeliveryRow?: boolean; // For pickup: hide the row entirely
}

export function OrderSummary({
    subtotal,
    itemCount,
    deliveryLabel,
    deliveryFee,
    total,
    children,
    note = '🔒 Secure checkout • M-Pesa accepted',
    hideDeliveryRow = false,
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-brand-dark mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-grey">
                    <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                </div>

                {/* Delivery row: shown or hidden based on prop */}
                {!hideDeliveryRow && (
                    <div className="flex justify-between text-brand-grey">
                        <span>Delivery</span>
                        <span className="text-brand-dark font-medium">{deliveryLabel}</span>
                    </div>
                )}

                <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-brand-dark text-base">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                </div>
            </div>

            {children && <div className="mt-6 space-y-3">{children}</div>}
            {note && <p className="text-xs text-brand-grey mt-4 text-center">{note}</p>}
        </div>
    );
}