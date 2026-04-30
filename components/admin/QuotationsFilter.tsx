'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function QuotationsFilter({ defaultStatus }: { defaultStatus?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleStatusChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') params.delete('status');
        else params.set('status', value);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Select defaultValue={defaultStatus || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
        </Select>
    );
}