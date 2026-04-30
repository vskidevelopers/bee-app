import { getAllCustomers } from '@/lib/actions/customers';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Mail, Package } from 'lucide-react';
import Link from 'next/link';
import { CustomerSearch } from '@/components/admin/CustomerSearch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCustomersPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const params = await searchParams;
    const query = params?.query || '';

    console.info('[CustomersPage] Loading', { query });

    const customers = await getAllCustomers(query);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-dark">Customers</h1>
                <p className="text-brand-grey text-sm mt-1">{customers.length} customers found</p>
            </div>

            <CustomerSearch defaultValue={query} />

            <div className="border border-stone-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Last Order</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-brand-grey">
                                    {query ? 'No customers match your search.' : 'No customers yet. They will appear after first checkout.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <CustomerRow key={customer.id} customer={customer} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Extracted row component (server-side, no interactivity)
function CustomerRow({ customer }: { customer: Customer }) {
    const orderCount = customer.orders?.length || 0;
    const lastOrder = customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString('en-KE') : '—';
    const hasNotes = customer.notes && customer.notes.trim().length > 0;

    return (
        <TableRow>
            <TableCell>
                <div className="font-medium text-brand-dark">{customer.name}</div>
                {orderCount > 1 && (
                    <Badge variant="secondary" className="mt-1 text-xs">Repeat Customer</Badge>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-brand-grey">
                    <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </div>
                {customer.email && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-grey mt-0.5">
                        <Mail className="h-3 w-3" /> {customer.email}
                    </div>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-brand-grey" />
                    <span className="font-medium">{orderCount}</span>
                </div>
            </TableCell>
            <TableCell className="text-brand-grey text-sm">{lastOrder}</TableCell>
            <TableCell>
                {hasNotes ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Has Notes</Badge>
                ) : (
                    <span className="text-stone-400 text-sm">—</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <Link href={`/admin/customers/${customer.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    );
}