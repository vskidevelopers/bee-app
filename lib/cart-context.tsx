/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { logger } from '@/lib/utils';

export interface CartItem extends Product {
    quantity: number;
    selectedSpecs: Record<string, string>;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, specs: Record<string, string>, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'beehouseholds_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [initialized, setInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
                logger.info('Cart', 'Loaded from localStorage', { count: JSON.parse(stored).length });
            }
        } catch (error) {
            logger.error('Cart', 'Failed to load cart from localStorage', error);
        }
        setInitialized(true);
    }, []);

    // Persist cart to localStorage on change
    useEffect(() => {
        if (!initialized) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            logger.error('Cart', 'Failed to save cart to localStorage', error);
        }
    }, [items, initialized]);

    const addItem = (product: Product, specs: Record<string, string>, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                logger.info('Cart', 'Updated existing item quantity', { productId: product.id });
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, selectedSpecs: specs }
                        : item
                );
            }

            logger.info('Cart', 'Added new item', { productId: product.id, quantity });
            return [...prev, { ...product, quantity, selectedSpecs: specs }];
        });
    };

    const removeItem = (productId: string) => {
        setItems((prev) => {
            logger.info('Cart', 'Removed item', { productId });
            return prev.filter((item) => item.id !== productId);
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        logger.info('Cart', 'Cart cleared');
    };

    const getTotal = () => {
        return items.reduce((sum, item) => {
            // Use min price for dynamic pricing display
            const price = item?.discountPrice ? item?.discountPrice : item.price
            return sum + price * item.quantity;
        }, 0);
    };

    const getItemCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotal,
                getItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};