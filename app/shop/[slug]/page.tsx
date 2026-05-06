/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicProduct } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import { MessageCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/public/AddToCartButton';

type Props = {
    params: Promise<{ slug: string }>;
};

// Dynamic metadata for SEO
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const product = await getPublicProduct(slug);

    if (!product) return { title: 'Product Not Found | BeeHouseholds' };

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.name} | BeeHouseholds`,
        description: product.shortDescription,
        keywords: [product.name, product.category, 'Nairobi', 'Kenya', 'smart home', 'home decor'],
        openGraph: {
            title: product.name,
            description: product.shortDescription,
            images: product.images[0]?.url ? [product.images[0].url, ...previousImages] : previousImages,
        },
    };
}


function ProductJsonLd({ product }: { product: any }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images.map((img: any) => img.url),
        description: product.description,
        brand: { '@type': 'Brand', name: 'BeeHouseholds' },
        offers: {
            '@type': 'Offer',
            url: `https://beehouseholds.co.ke/product/${product.slug}`,
            priceCurrency: 'KES',
            price: product.discountPrice || product.price,
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    console.info('[ProductDetail] Loading', { slug });

    const product = await getPublicProduct(slug);
    if (!product) notFound();

    const displayPrice = product.discountPrice
        ? { current: product.discountPrice, original: product.price, onSale: true }
        : { current: product.price, original: null, onSale: false };

    // WhatsApp quote link
    const whatsappNumber = '254720151058';
    const whatsappMessage = encodeURIComponent(
        `Hi BeeHouseholds, I'm interested in ${product.name} (${product.category}). Price: KSh ${displayPrice.current.toLocaleString()}. Please share delivery details.`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen bg-stone-50">
            <ProductJsonLd product={product} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-3">
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-brand-grey hover:text-brand-gold transition">
                        <ArrowLeft className="h-4 w-4" /> Back to Shop
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white rounded-xl border border-stone-200 overflow-hidden">
                            {product.images[0]?.url ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.images[0].alt || product.name}
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                    No image available
                                </div>
                            )}
                        </div>
                        {/* Thumbnail strip (if multiple images) */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-lg border border-stone-200 overflow-hidden shrink-0">
                                        <img
                                            src={img.url}
                                            alt={img.alt || `View ${idx + 1}`}
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge className="mb-3 bg-stone-100 text-brand-grey">{product.category}</Badge>
                            <h1 className="text-3xl font-bold text-brand-dark">{product.name}</h1>
                            {product.featured && (
                                <Badge className="mt-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                                    Featured
                                </Badge>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-brand-dark">
                                KSh {displayPrice.current.toLocaleString()}
                            </span>
                            {displayPrice.original && (
                                <>
                                    <span className="text-xl text-stone-400 line-through">
                                        KSh {displayPrice.original.toLocaleString()}
                                    </span>
                                    <Badge className="bg-red-100 text-red-700">
                                        SAVE {Math.round((1 - displayPrice.current / displayPrice.original) * 100)}%
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="prose prose-stone max-w-none">
                            <p className="text-brand-grey">{product.shortDescription}</p>
                            {product.description && (
                                <div className="mt-4 text-sm text-brand-grey whitespace-pre-line">
                                    {product.description}
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        {Object.keys(product.specifications).length > 0 && (
                            <div className="bg-white rounded-xl border border-stone-200 p-4">
                                <h3 className="font-semibold text-brand-dark mb-3">Specifications</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-start gap-1">
                                            <span className="text-[#4B5563] font-bold">{key}:</span>
                                            <span className="font-medium text-brand-dark">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
                            <AddToCartButton product={product} />
                            <Button
                                asChild
                                variant="outline"
                                className="border-brand-gold text-brand-gold hover:bg-brand-gold/5 min-w-[180px]"
                            >
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp for Quote
                                </a>
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-4 text-center text-xs text-brand-grey">
                            <div>
                                <div className="font-medium text-brand-dark">🚚 Countrywide</div>
                                <div>Delivery</div>
                            </div>
                            <div>
                                <div className="font-medium text-brand-dark">💳 M-Pesa</div>
                                <div>Accepted</div>
                            </div>
                            <div>
                                <div className="font-medium text-brand-dark">✅ Quality</div>
                                <div>Guarantee</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
