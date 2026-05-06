'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export function ShopControls({ defaultSearch, defaultSort }: { defaultSearch?: string; defaultSort?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateUrl = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') params.delete(key);
            else params.set(key, value);
        });
        params.delete('page'); // Reset to page 1 on filter change
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                    placeholder="Search products..."
                    className="pl-9"
                    defaultValue={defaultSearch}
                    onChange={(e) => updateUrl({ search: e.target.value || null })}
                />
            </div>
            <Select defaultValue={defaultSort || 'newest'} onValueChange={(val) => updateUrl({ sort: val })}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
} 