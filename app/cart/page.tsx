'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, CreditCard, Truck, Package, Store } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { OrderSummary } from '@/components/public/OrderSummary';

// Delivery option type
type DeliveryOption = 'nairobi' | 'outside' | 'pickup';

export default function CartPage() {
    const router = useRouter();
    const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

    // Default to Nairobi (most common)
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('nairobi');

    // Calculate fee and label based on selection
    const deliveryConfig = {
        nairobi: { fee: 300, label: 'KSh 300', hideRow: false },
        outside: { fee: 0, label: 'Courier', hideRow: false },
        pickup: { fee: 0, label: '', hideRow: true },
    };

    const { fee: deliveryFee, label: deliveryLabel, hideRow: hideDeliveryRow } = deliveryConfig[deliveryOption];
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-stone-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-dark mb-2">Your Cart is Empty</h1>
                    <p className="text-brand-grey mb-6">Looks like you haven&apos;t added anything yet. Browse our collection to find something you love.</p>
                    <Link href="/shop">
                        <Button className="bg-brand-gold hover:bg-[#b88a35] text-white">
                            <ArrowLeft className="h-4 w-4 mr-2 rotate-180" /> Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleCheckout = () => {
        const params = new URLSearchParams({
            delivery: deliveryOption,
            fee: String(deliveryFee),
        });
        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-stone-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">Shopping Cart</h1>
                        <p className="text-brand-grey text-sm mt-1">{itemCount} item{itemCount > 1 ? 's' : ''} in your cart</p>
                    </div>
                    <Link href="/shop" className="text-sm text-brand-gold hover:text-[#b88a35] font-medium flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-stone-200 p-4 flex gap-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                    {item.images?.[0]?.url ? (
                                        <Image src={item.images[0].url} alt={item.images[0].alt || item.name} fill className="object-cover" sizes="96px" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs">No image</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-brand-dark line-clamp-1">{item.name}</h3>
                                            <p className="text-sm text-brand-grey mt-0.5">{item.category}</p>
                                        </div>
                                        <button onClick={() => { removeItem(item.id); toast.info('Item removed'); }} className="text-stone-400 hover:text-red-500 transition p-1" title="Remove item">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <div className="flex items-center border border-stone-200 rounded-md">
                                            <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-stone-50 text-brand-grey transition disabled:opacity-50" disabled={item.quantity <= 1}>
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-brand-dark">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-stone-50 text-brand-grey transition">
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <span className="text-sm text-brand-grey">KSh {(item.discountPrice || item.price).toLocaleString()} each</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-semibold text-brand-dark">KSh {((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end pt-2">
                            <Button variant="ghost" size="sm" onClick={() => { clearCart(); toast.info('Cart cleared'); }} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Delivery Options + OrderSummary */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* ✅ Visual Delivery Selector (Radio Style) */}
                        <div className="bg-white rounded-xl border border-stone-200 p-5">
                            <h3 className="text-sm font-semibold text-brand-dark mb-4">How would you like to receive your order?</h3>

                            <div className="space-y-3">

                                {/* Option 1: Nairobi Delivery */}
                                <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${deliveryOption === 'nairobi' ? 'border-brand-gold bg-brand-gold/5' : 'border-stone-200 hover:border-brand-gold/50'}`}>
                                    <input type="radio" name="delivery" value="nairobi" checked={deliveryOption === 'nairobi'} onChange={() => setDeliveryOption('nairobi')} className="mt-1 h-4 w-4 text-brand-gold border-stone-300 focus:ring-brand-gold" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-brand-gold shrink-0" />
                                            <span className="font-medium text-brand-dark">Deliver within Nairobi</span>
                                        </div>
                                        <p className="text-xs text-brand-grey mt-1 ml-6">Our riders bring it to your door. Flat fee: <span className="font-semibold">KSh 300</span>.</p>
                                    </div>
                                </label>

                                {/* Option 2: Outside Nairobi (Courier) */}
                                <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${deliveryOption === 'outside' ? 'border-brand-gold bg-brand-gold/5' : 'border-stone-200 hover:border-brand-gold/50'}`}>
                                    <input type="radio" name="delivery" value="outside" checked={deliveryOption === 'outside'} onChange={() => setDeliveryOption('outside')} className="mt-1 h-4 w-4 text-brand-gold border-stone-300 focus:ring-brand-gold" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-brand-gold shrink-0" />
                                            <span className="font-medium text-brand-dark">Send via Courier</span>
                                        </div>
                                        <p className="text-xs text-brand-grey mt-1 ml-6">We arrange a trusted courier. You&apos;ll be contacted for details after payment.</p>
                                    </div>
                                </label>

                                {/* Option 3: Pick Up In-Store */}
                                <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${deliveryOption === 'pickup' ? 'border-brand-gold bg-brand-gold/5' : 'border-stone-200 hover:border-brand-gold/50'}`}>
                                    <input type="radio" name="delivery" value="pickup" checked={deliveryOption === 'pickup'} onChange={() => setDeliveryOption('pickup')} className="mt-1 h-4 w-4 text-brand-gold border-stone-300 focus:ring-brand-gold" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4 text-brand-gold shrink-0" />
                                            <span className="font-medium text-brand-dark">I&apos;ll Pick Up</span>
                                        </div>
                                        <p className="text-xs text-brand-grey mt-1 ml-6">Collect from our store at no extra cost. We&apos;ll notify you when ready.</p>
                                    </div>
                                </label>

                            </div>
                        </div>

                        {/* ✅ Pure OrderSummary Component */}
                        <OrderSummary
                            subtotal={subtotal}
                            itemCount={itemCount}
                            deliveryLabel={deliveryLabel}
                            deliveryFee={deliveryFee}
                            total={total}
                            hideDeliveryRow={hideDeliveryRow}
                            note={deliveryOption === 'outside'
                                ? '🔒 Secure checkout • M-Pesa • Courier quote after payment'
                                : deliveryOption === 'pickup'
                                    ? '🔒 Secure checkout • M-Pesa • Pick up when ready'
                                    : '🔒 Secure checkout • M-Pesa • Delivery after payment'
                            }
                        >
                            <Button onClick={handleCheckout} className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11">
                                <CreditCard className="h-4 w-4 mr-2" /> Proceed to Checkout
                            </Button>
                            <Link href="/shop">
                                <Button variant="outline" className="w-full h-11 border-brand-gold text-brand-gold hover:bg-brand-gold/5">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </OrderSummary>

                    </div>
                </div>
            </div>
        </div>
    );
}