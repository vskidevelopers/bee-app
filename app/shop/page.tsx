import { LoadMoreButton } from '@/components/public/LoadMoreButton';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicProducts, getProductCategories } from '@/lib/actions/products';
import { ProductCard } from '@/components/public/ProductCard';
import { ShopFilters } from '@/components/public/ShopFilters';
import { ShopControls } from '@/components/public/ShopControls'; // ✅ Import
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { CollapsibleFilters } from '@/components/public/CollapsibleFilters';

export const metadata: Metadata = {
    title: 'Shop - Smart Home & Decor Nairobi | BeeHouseholds',
    description: 'Browse our collection of warm duvets, mosquito nets, smart home gadgets, and premium decor. Countrywide delivery in Kenya. M-Pesa accepted.',
    keywords: ['shop online Nairobi', 'buy duvets Kenya', 'smart home gadgets Nairobi', 'mosquito nets delivery', 'home decor Kenya', 'BeeHouseholds'],
};

export const dynamic = 'force-dynamic';

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        search?: string;
        page?: string;
        sort?: string;
    }>;
}) {
    const params = await searchParams;
    const page = params.page ? Number(params.page) : 1;
    const limit = 12;

    const [productsData, categories] = await Promise.all([
        getPublicProducts({
            category: params.category,
            minPrice: params.minPrice ? Number(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
            search: params.search,
            page,
            limit,
        }),
        getProductCategories(),
    ]);

    const { products, hasMore } = productsData;
    const priceRange = { min: 500, max: 10000 };

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-950 text-white">
                <div className="container mx-auto px-4 py-10 sm:py-16">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center rounded-full bg-brand-gold/10 px-3 py-1 text-sm font-semibold text-brand-gold">
                                Curated home essentials
                            </span>
                            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                                Shop Collection
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Discover premium duvets, mosquito nets, smart home gadgets, and elegant decor with nationwide delivery across Kenya.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <CollapsibleFilters categories={categories} priceRange={priceRange} />

                    <main className="flex-1">
                        {/* ✅ Replaced inline interactive elements with Client Component */}
                        <ShopControls defaultSearch={params.search} defaultSort={params.sort} />

                        {products.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
                                <p className="text-brand-grey text-lg">No products match your filters.</p>
                                <Link href="/shop" className="mt-2 text-brand-gold hover:underline">
                                    Clear filters
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center mt-10">
                                        <LoadMoreButton currentPage={page} />
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}