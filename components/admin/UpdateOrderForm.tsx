'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types';

interface UpdateOrderFormProps {
    order: Order;
    onUpdate: (id: string, status: Order['status'], paymentData?: { transactionCode: string }) => Promise<{ success: boolean; message: string }>;
}

export function UpdateOrderForm({ order, onUpdate }: UpdateOrderFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(order.status);
    const [transactionCode, setTransactionCode] = useState(order.payment.transactionCode || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const paymentData = transactionCode && !order.payment.transactionCode
            ? { transactionCode }
            : undefined;

        const result = await onUpdate(order.id, status, paymentData);

        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Update Order</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Order Status</Label>
                            <Select value={status} onValueChange={(val) => setStatus(val as Order['status'])}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>M-Pesa Transaction Code</Label>
                            <Input
                                placeholder="e.g., SLK7H8X9Y0"
                                value={transactionCode}
                                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                                className="font-mono uppercase"
                            />
                            <p className="text-[11px] text-brand-grey">Leave blank if already verified</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="bg-brand-gold hover:bg-[#b88a35] text-white w-full md:w-auto"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                        Update Order
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}