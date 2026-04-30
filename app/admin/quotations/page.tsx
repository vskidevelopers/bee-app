import { getAllQuotations, updateQuotationStatus } from '@/lib/actions/quotations';
import { Quotation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, } from 'lucide-react';
import { QuotationsFilter } from '@/components/admin/QuotationsFilter';

export const dynamic = 'force-dynamic';

export default async function AdminQuotationsPage({
    searchParams,
}: {
    searchParams?: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = params?.status;

    console.info('[QuotationsPage] Loading', { status });
    const quotations = await getAllQuotations(status);

    const getStatusBadge = (status: Quotation['status']) => {
        const map = {
            new: 'bg-blue-100 text-blue-700',
            contacted: 'bg-yellow-100 text-yellow-700',
            quoted: 'bg-green-100 text-green-700',
            closed: 'bg-stone-100 text-stone-700',
        };
        return map[status] || 'bg-stone-100';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Quotation Requests</h1>
                    <p className="text-brand-grey text-sm mt-1">{quotations.length} requests</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">Quotation Requests</h1>
                        <p className="text-brand-grey text-sm mt-1">{quotations.length} requests</p>
                    </div>

                    {/* ✅ Client Component replaces inline Select */}
                    <QuotationsFilter defaultStatus={status} />
                </div>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product Interest</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-brand-grey">
                                    No quotation requests yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            quotations.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>
                                        <div className="font-medium text-brand-dark">{q.name}</div>
                                        <div className="flex items-center gap-1 text-xs text-brand-grey">
                                            <Phone className="h-3 w-3" /> {q.phone}
                                        </div>
                                        {q.email && (
                                            <div className="flex items-center gap-1 text-xs text-brand-grey">
                                                <Mail className="h-3 w-3" /> {q.email}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-brand-grey">{q.productInterest || '—'}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate text-sm text-brand-grey" title={q.message}>
                                            {q.message}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-brand-grey capitalize">{q.source.replace('-', ' ')}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(q.status)}>{q.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-brand-grey text-sm">
                                        {new Date(q.createdAt).toLocaleDateString('en-KE')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            defaultValue={q.status}
                                            onValueChange={(val) => updateQuotationStatus(q.id, val as Quotation['status'])}
                                        >
                                            <SelectTrigger className="w-[130px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="contacted">Contacted</SelectItem>
                                                <SelectItem value="quoted">Quoted</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
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