'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function CustomerSearch({ defaultValue }: { defaultValue?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams?.toString());
            if (value) params.set('query', value);
            else params.delete('query');
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
                placeholder="Search by name, phone, or email..."
                className="pl-9"
                defaultValue={defaultValue}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={isPending}
            />
            {isPending && <span className="absolute right-3 top-2.5 text-xs text-brand-grey">Searching...</span>}
        </div>
    );
}