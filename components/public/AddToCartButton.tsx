'use client'; // ✅ Required for useCart hook

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/types';

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const router = useRouter();
    const { addItem } = useCart();

    const handleClick = async () => {
        try {
            const result = await addItem(product, {}, 1);
            console.log('Add to cart success', { product, result });
            router.push('/cart');
        } catch (error) {
            console.error('Add to cart failed', { product, error });
        }
    };

    return (
        <Button
            onClick={handleClick}
            className="bg-brand-gold border border-[#b88a35] hover:bg-[#b88a35] hover:text-white font-medium min-w-[180px]"
        >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
        </Button>
    );
}