import { getAllProducts } from '@/lib/actions/products';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteProductDialog from '@/components/admin/DeleteProductDialog';
import { ProductSearch } from '@/components/admin/ProductSearch'; // ✅ Import client component

// Prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const params = await searchParams;
    const query = params?.query || '';

    // Fetch via Server Action
    const products = await getAllProducts(query);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Products</h1>
                    <p className="text-brand-grey text-sm mt-1">{products.length} products in catalog</p>
                </div>

                <Button
                    asChild
                    className="bg-brand-gold border border-[#b88a35] hover:bg-[#b88a35] text-[#b88a35] hover:text-white font-semibold shadow-md hover:shadow-lg transition-all shrink-0"
                >
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </Button>
            </div>

            {/* ✅ Client Component for search */}
            <ProductSearch defaultValue={query} />

            {/* Products Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead className="w-[40%]">Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-brand-grey">
                                    No products found. {query ? 'Try a different search.' : 'Add your first product.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <ProductRow key={product.id} product={product} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Extracted row component (still server-side, no interactivity)
function ProductRow({ product }: { product: Product }) {
    const price = product.price;
    const discountPrice = product.discountPrice;
    const hasDiscount = typeof discountPrice === 'number' && typeof price === 'number' && discountPrice < price;

    return (
        <TableRow>
            <TableCell>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {product.images[0]?.url ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-md bg-stone-100 flex items-center justify-center text-stone-400">
                            <span className="text-xs">IMG</span>
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-brand-dark">{product.name}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-brand-grey">{product.category}</TableCell>
            <TableCell className="font-medium">
                {hasDiscount ? (
                    <div className="flex flex-col gap-1">
                        <span>KSh {discountPrice.toLocaleString()}</span>
                        <span className="line-through text-stone-500">KSh {price.toLocaleString()}</span>
                    </div>
                ) : (
                    <span>KSh {price?.toLocaleString()}</span>
                )}
            </TableCell>
            <TableCell>
                <Badge
                    variant={'default'}
                    className={'bg-green-100 text-green-700 hover:bg-green-100'}
                >
                    {`in stock`}
                </Badge>
            </TableCell>
            <TableCell>
                {product.featured ? (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Featured</Badge>
                ) : (
                    <span className="text-stone-400 text-sm">Standard</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteProductDialog productId={product.id} productName={product.name} />
                </div>
            </TableCell>
        </TableRow>
    );
}