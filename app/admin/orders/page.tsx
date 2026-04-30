import { getAllOrders } from '@/lib/actions/orders';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { OrderFilters } from '@/components/admin/OrderFilters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams?: Promise<{ status?: string; query?: string }>;
}) {
    const params = await searchParams;
    const status = params?.status;
    const query = params?.query;

    const orders = await getAllOrders(status, query);

    const getStatusBadge = (status: Order['status']) => {
        const map: Record<Order['status'], string> = {
            pending: 'bg-orange-100 text-orange-700',
            processing: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return map[status] || 'bg-stone-100 text-stone-700';
    };

    const getPaymentBadge = (payment: Order['payment']) => {
        return payment.status === 'confirmed'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Orders</h1>
                    <p className="text-brand-grey text-sm mt-1">{orders.length} orders found</p>
                </div>
            </div>

            <OrderFilters defaultStatus={status} defaultQuery={query} />

            <div className="border border-stone-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-brand-grey">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-brand-dark">{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <div className="text-brand-dark">{order.customer.name}</div>
                                        <div className="text-xs text-brand-grey">{order.customer.phone}</div>
                                    </TableCell>
                                    <TableCell className="text-brand-grey">{order.items.length} item(s)</TableCell>
                                    <TableCell className="font-medium">KSh {order.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={getPaymentBadge(order.payment)}>
                                            {order.payment.status === 'confirmed'
                                                ? order.payment.transactionCode || 'Paid'
                                                : order.payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-brand-grey text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('en-KE')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}