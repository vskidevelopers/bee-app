'use client';

import { useState } from 'react';
import { ShopFilters } from './ShopFilters';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface CollapsibleFiltersProps {
    categories: string[];
    priceRange: { min: number; max: number };
}

export function CollapsibleFilters({ categories, priceRange }: CollapsibleFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 lg:sticky lg:top-24 overflow-hidden">

                {/* Mobile Toggle Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-full flex items-center justify-between p-5 border-b border-stone-200 text-left"
                    aria-expanded={isOpen}
                >
                    <span className="font-semibold text-brand-dark flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-brand-grey transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Desktop Header (Static) */}
                <div className="hidden lg:flex items-center justify-between p-5 border-b border-stone-200">
                    <h3 className="font-semibold text-brand-dark flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </h3>
                </div>

                {/* Filter Content */}
                <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-5`}>
                    <ShopFilters categories={categories} priceRange={priceRange} />
                </div>
            </div>
        </aside>
    );
}