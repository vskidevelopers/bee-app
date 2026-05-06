'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LoadMoreButton({ currentPage }: { currentPage: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLoadMore = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(currentPage + 1));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Button variant="outline" onClick={handleLoadMore} className="min-w-[140px]">
            Load More
        </Button>
    );
}