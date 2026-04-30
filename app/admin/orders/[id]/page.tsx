import { notFound } from 'next/navigation';
import { getOrder, updateOrderStatus } from '@/lib/actions/orders';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, MapPin, Package, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UpdateOrderForm } from '@/components/admin/UpdateOrderForm';
export const dynamic = 'force-dynamic';

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await getOrder(id);
    if (!order) notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/orders">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">Order {order.orderNumber}</h1>
                        <p className="text-sm text-brand-grey">{new Date(order.createdAt).toLocaleString('en-KE')}</p>
                    </div>
                </div>
                <Badge className={`text-sm px-3 py-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                    }`}>
                    {order.status.toUpperCase()}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer & Shipping */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" /> Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium text-brand-dark">{order.customer.name}</p>
                                <p className="text-brand-grey flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {order.customer.phone}
                                </p>
                                {order.customer.email && <p className="text-brand-grey">{order.customer.email}</p>}
                            </div>
                            <div className="pt-3 border-t border-stone-100">
                                <p className="font-medium text-brand-dark flex items-center gap-1 mb-1">
                                    <MapPin className="h-3 w-3" /> Delivery Address
                                </p>
                                <p className="text-brand-grey">{order.customer.deliveryAddress}</p>
                                {order.customer.location && <p className="text-brand-grey mt-1">Area: {order.customer.location}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Payment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Method</span>
                                <span className="font-medium">{order.payment.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-grey">Status</span>
                                <Badge className={order.payment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                    {order.payment.status}
                                </Badge>
                            </div>
                            {order.payment.transactionCode && (
                                <div className="flex justify-between">
                                    <span className="text-brand-grey">M-Pesa Code</span>
                                    <span className="font-mono font-medium">{order.payment.transactionCode}</span>
                                </div>
                            )}
                            {order.payment.paidAt && (
                                <div className="flex justify-between">
                                    <span className="text-brand-grey">Paid At</span>
                                    <span>{new Date(order.payment.paidAt).toLocaleString('en-KE')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Items & Update Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package className="h-4 w-4" /> Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start py-3 border-b border-stone-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-brand-dark">{item.productName}</p>
                                            {Object.keys(item.specifications).length > 0 && (
                                                <p className="text-xs text-brand-grey mt-1">
                                                    {Object.entries(item.specifications).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">KSh {(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                            <p className="text-xs text-brand-grey">KSh {item.priceAtPurchase.toLocaleString()} × {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-grey">Subtotal</span>
                                    <span>KSh {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-grey">Delivery Fee</span>
                                    <span>KSh {order.deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-brand-dark pt-2 border-t border-stone-100">
                                    <span>Total</span>
                                    <span>KSh {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <UpdateOrderForm order={order} onUpdate={updateOrderStatus} />
                </div>
            </div>
        </div>
    );
}