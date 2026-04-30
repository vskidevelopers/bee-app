import { notFound } from 'next/navigation';
import { getCustomerWithOrders, updateCustomerNotes } from '@/lib/actions/customers';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Phone, Mail, MapPin, ArrowLeft, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { UpdateNotesForm } from '@/components/admin/UpdateNotesForm';

export const dynamic = 'force-dynamic';

interface CustomerDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
    const { id } = await params;
    console.info('[CustomerDetailPage] Loading', { id });

    const { customer, orders } = await getCustomerWithOrders(id);
    if (!customer) notFound();

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const firstOrder = orders[orders.length - 1]?.createdAt;
    const lastOrder = orders[0]?.createdAt;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/customers">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">{customer.name}</h1>
                        <p className="text-sm text-brand-grey">Customer since {firstOrder ? new Date(firstOrder).toLocaleDateString('en-KE') : '—'}</p>
                    </div>
                </div>
                {orders.length > 1 && (
                    <Badge className="bg-green-100 text-green-700">Repeat Customer</Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Contact & Notes */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Contact Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-brand-grey" />
                                <span className="font-mono">{customer.phone}</span>
                            </div>
                            {customer.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-brand-grey" />
                                    <span>{customer.email}</span>
                                </div>
                            )}
                            {orders[0]?.customer.deliveryAddress && (
                                <div className="pt-2 border-t border-stone-100">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-brand-grey mt-0.5" />
                                        <span className="text-brand-grey">{orders[0].customer.deliveryAddress}</span>
                                    </div>
                                    {orders[0].customer.location && (
                                        <p className="text-xs text-brand-grey mt-1 ml-6">Area: {orders[0].customer.location}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Total Orders</span>
                                <span className="font-medium">{orders.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Total Spent</span>
                                <span className="font-medium">KSh {totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Last Order</span>
                                <span>{lastOrder ? new Date(lastOrder).toLocaleDateString('en-KE') : '—'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpdateNotesForm customerId={customer.id} initialNotes={customer.notes || ''} onUpdate={updateCustomerNotes} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Order History */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package className="h-4 w-4" /> Order History ({orders.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orders.length === 0 ? (
                                <p className="text-center py-8 text-brand-grey">No orders found for this customer.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <OrderSummaryRow key={order.id} order={order} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Order summary row for customer detail page
function OrderSummaryRow({ order }: { order: Order }) {
    const statusColors: Record<Order['status'], string> = {
        pending: 'bg-orange-100 text-orange-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="p-4 rounded-lg border border-stone-200 hover:border-brand-gold/30 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-dark hover:text-brand-gold transition">
                        {order.orderNumber}
                    </Link>
                    <p className="text-xs text-brand-grey mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="font-medium">KSh {order.total.toLocaleString()}</span>
                </div>
            </div>

            <div className="text-sm text-brand-grey">
                <span className="font-medium">{order.items.length} item(s)</span>
                {order.items.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="ml-1">• {item.productName}</span>
                ))}
                {order.items.length > 2 && <span className="ml-1">+{order.items.length - 2} more</span>}
            </div>

            {order.payment.transactionCode && (
                <div className="mt-2 text-xs text-brand-grey flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    M-Pesa: {order.payment.transactionCode}
                </div>
            )}
        </div>
    );
}