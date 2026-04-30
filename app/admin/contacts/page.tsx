import { getAllContactInquiries, updateInquiryStatus } from '@/lib/actions/contacts';
import { ContactInquiry } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, } from 'lucide-react';
import { ContactsFilter } from '@/components/admin/ContactsFilter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminContactsPage({
    searchParams,
}: {
    searchParams?: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = params?.status;

    console.info('[ContactsPage] Loading', { status });
    const inquiries = await getAllContactInquiries(status);

    const getStatusBadge = (status: ContactInquiry['status']) => {
        const map = {
            new: 'bg-blue-100 text-blue-700',
            read: 'bg-yellow-100 text-yellow-700',
            replied: 'bg-green-100 text-green-700',
            archived: 'bg-stone-100 text-stone-700',
        };
        return map[status] || 'bg-stone-100';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Contact Inquiries</h1>
                    <p className="text-brand-grey text-sm mt-1">{inquiries.length} inquiries</p>
                </div>
                <ContactsFilter defaultStatus={status} />
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-brand-grey">
                                    No contact inquiries yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell>
                                        <div className="font-medium text-brand-dark">{inquiry.name}</div>
                                        <div className="flex items-center gap-1 text-xs text-brand-grey">
                                            <Phone className="h-3 w-3" /> {inquiry.phone}
                                        </div>
                                        {inquiry.email && (
                                            <div className="flex items-center gap-1 text-xs text-brand-grey">
                                                <Mail className="h-3 w-3" /> {inquiry.email}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-brand-dark max-w-[150px] truncate">
                                        {inquiry.subject}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[250px] truncate text-sm text-brand-grey" title={inquiry.message}>
                                            {inquiry.message}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-brand-grey capitalize">
                                        {inquiry.source.replace(/-/g, ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(inquiry.status)}>
                                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-brand-grey text-sm">
                                        {new Date(inquiry.createdAt).toLocaleDateString('en-KE')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            defaultValue={inquiry.status}
                                            onValueChange={(val) => updateInquiryStatus(inquiry.id, val as ContactInquiry['status'])}
                                        >
                                            <SelectTrigger className="w-[130px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="read">Read</SelectItem>
                                                <SelectItem value="replied">Replied</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
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