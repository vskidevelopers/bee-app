'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem(product, {}, 1);
        toast.success('Added to cart', {
            description: product.name,
            action: {
                label: 'View Cart',
                onClick: () => window.location.href = '/cart',
            },
        });
    };

    const displayPrice = product.discountPrice
        ? { current: product.discountPrice, original: product.price, onSale: true }
        : { current: product.price, original: null, onSale: false };

    return (
        <Link
            href={`/shop/${product.slug}`}
            className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-gold/50 hover:shadow-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
                {product.images[0]?.url ? (
                    <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                        <span className="text-sm">No image</span>
                    </div>
                )}

                {/* Sale Badge */}
                {displayPrice.onSale && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white">
                        SALE
                    </Badge>
                )}

                {/* Quick Add Button (Desktop Hover) */}
                <Button
                    onClick={handleAddToCart}
                    className="absolute border border-[#b88a35] text-[#b88a35] bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gold hover:bg-[#b88a35] hover:text-white shadow-md"
                    size="sm"
                >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    + Add
                </Button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-medium text-brand-dark line-clamp-1 group-hover:text-brand-gold transition">
                    {product.name}
                </h3>
                <p className="text-sm text-brand-grey line-clamp-2 mt-1 min-h-[2.5rem]">
                    {product.shortDescription}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-dark">
                        KSh {displayPrice.current.toLocaleString()}
                    </span>
                    {displayPrice.original && (
                        <span className="text-sm text-stone-400 line-through">
                            KSh {displayPrice.original.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Category Tag */}
                <div className="mt-2">
                    <Badge variant="secondary" className="text-xs bg-stone-100 text-brand-grey">
                        {product.category}
                    </Badge>
                </div>
            </div>
        </Link>
    );
}