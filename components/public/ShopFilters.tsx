'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ShopFiltersProps {
    categories: string[];
    priceRange: { min: number; max: number };
}

export function ShopFilters({ categories, priceRange }: ShopFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('category') || 'all';
    const currentMin = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : priceRange.min;
    const currentMax = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : priceRange.max;

    const updateFilters = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        // Reset to page 1 when filters change
        params.delete('page');

        router.replace(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        router.replace(pathname);
    };

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div>
                <h4 className="text-sm font-medium text-brand-dark mb-3">Category</h4>
                <Select
                    value={currentCategory}
                    onValueChange={(val) => updateFilters({ category: val === 'all' ? null : val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Price Filter */}
            <div>
                <h4 className="text-sm font-medium text-brand-dark mb-3">Price Range</h4>
                <div className="px-2">
                    <Slider
                        defaultValue={[currentMin, currentMax]}
                        min={priceRange.min}
                        max={priceRange.max}
                        step={100}
                        onValueCommit={([min, max]) => updateFilters({ minPrice: min, maxPrice: max })}
                        className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-brand-grey">
                        <span>KSh {currentMin.toLocaleString()}</span>
                        <span>KSh {currentMax.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Clear Filters */}
            {(currentCategory !== 'all' || currentMin !== priceRange.min || currentMax !== priceRange.max) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-brand-grey hover:text-brand-dark w-full justify-start"
                >
                    <X className="h-4 w-4 mr-2" /> Clear all filters
                </Button>
            )}
        </div>
    );
}