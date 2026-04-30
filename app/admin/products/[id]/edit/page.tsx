import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { updateProduct, getProduct } from '@/lib/actions/products';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();

    // Bind ID to Server Action
    const handleSubmit = updateProduct.bind(null, id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-dark">Edit Product</h1>
                <p className="text-brand-grey text-sm mt-1">Update details for &quot;{product.name}&quot;</p>
            </div>
            <ProductForm product={product} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </div>
    );
}