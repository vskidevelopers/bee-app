'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Package, Truck, CheckCircle, AlertCircle, MapPin, Clock } from 'lucide-react';
import { trackOrder } from '@/lib/actions/orders';

export function TrackForm() {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; order?: any } | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim() || !phone.trim()) return;

        setLoading(true);
        const data = await trackOrder(orderNumber, phone);
        setResult(data);
        setLoading(false);
    };

    // ✅ Show results if found
    if (result?.success && result.order) {
        return <TrackResult order={result.order} onReset={() => setResult(null)} />;
    }

    // ✅ Show form
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 p-6">
            <form onSubmit={handleTrack} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number *</Label>
                    <Input
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                        placeholder="e.g., BH-20260429-1234"
                        className="font-mono uppercase focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number Used *</Label>
                    <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0720 151 058"
                        className="font-mono focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                        required
                    />
                    <p className="text-[11px] text-brand-grey">Must match the number used at checkout</p>
                </div>

                <Button type="submit" className="w-full bg-brand-gold hover:bg-[#b88a35] text-white h-11" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Track Order
                </Button>

                {result?.success === false && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        {result.message}
                    </div>
                )}
            </form>
            <p className="text-xs text-brand-grey mt-4 text-center">
                Need help? <a href="https://wa.me/254720151058" className="text-brand-gold hover:underline">WhatsApp us</a>
            </p>
        </div>
    );
}

// ✅ Result Display Component
function TrackResult({ order, onReset }: { order: any; onReset: () => void }) {
    const statusSteps = [
        { label: 'Order Placed', key: 'pending', icon: Package, color: 'bg-blue-100 text-blue-700' },
        { label: 'Processing', key: 'processing', icon: Clock, color: 'bg-purple-100 text-purple-700' },
        { label: 'Shipped', key: 'shipped', icon: Truck, color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Delivered', key: 'delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.key === order.status);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 p-6">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b border-stone-100">
                <h2 className="text-xl font-bold text-brand-dark">Order {order.orderNumber}</h2>
                <p className="text-sm text-brand-grey mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4 mb-6">
                {statusSteps.map((step, idx) => {
                    const isActive = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${isCurrent ? step.color : isActive ? 'bg-stone-100 text-stone-400' : 'bg-stone-50 text-stone-300'}`}>
                                {isActive && <Icon className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                                <p className={`font-medium ${isCurrent ? 'text-brand-dark' : 'text-stone-400'}`}>{step.label}</p>
                                {isCurrent && <p className="text-xs text-brand-grey capitalize">Current status</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Details */}
            <div className="space-y-3 p-4 bg-stone-50 rounded-lg border border-stone-200 text-sm">
                <div className="flex justify-between">
                    <span className="text-brand-grey">Items</span>
                    <span className="font-medium">{order.items} item(s)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-brand-grey">Total Paid</span>
                    <span className="font-medium">KSh {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-brand-grey">Delivery To</span>
                    <span className="font-medium flex items-center gap-1 text-right max-w-[60%]">
                        <MapPin className="h-3 w-3 shrink-0 mt-0.5" /> {order.customer.deliveryAddress}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-brand-grey">Payment</span>
                    <span className={`font-medium ${order.payment.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.payment.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                </div>
                {order.notes && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-xs text-brand-grey italic">
                        Note: {order.notes}
                    </div>
                )}
            </div>

            {/* Actions */}
            <Button variant="outline" onClick={onReset} className="w-full mt-6 h-11 border-stone-300 text-brand-dark hover:bg-stone-50">
                Track Another Order
            </Button>
            <p className="text-xs text-brand-grey mt-4 text-center">
                Questions about this order?{' '}
                <a
                    href={`https://wa.me/254720151058?text=Hi, I need help with order ${order.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:underline"
                >
                    Chat on WhatsApp
                </a>
            </p>
        </div>
    );
}