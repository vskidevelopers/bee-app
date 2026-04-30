'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export function OrderFilters({ defaultStatus, defaultQuery }: { defaultStatus?: string; defaultQuery?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleFilterChange = (status: string, query: string) => {
        startTransition(() => {
            const params = new URLSearchParams();
            if (status && status !== 'all') params.set('status', status);
            if (query) params.set('query', query);
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                    placeholder="Search by order #, name, or phone..."
                    className="pl-9"
                    defaultValue={defaultQuery}
                    onChange={(e) => handleFilterChange(searchParams.get('status') || 'all', e.target.value)}
                    disabled={isPending}
                />
            </div>
            <Select
                defaultValue={defaultStatus || 'all'}
                onValueChange={(val) => handleFilterChange(val, searchParams.get('query') || '')}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}