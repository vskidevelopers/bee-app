import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '@/lib/actions/products';

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-dark">Add New Product</h1>
                <p className="text-brand-grey text-sm mt-1">Fill in the details to add a product to your catalog</p>
            </div>
            <ProductForm onSubmit={createProduct} submitLabel="Create Product" />
        </div>
    );
}