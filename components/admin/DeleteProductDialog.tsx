'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteProductDialog({ productId, productName }: { productId: string; productName: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteProduct(productId);
        setLoading(false);

        if (result.success) {
            toast.success(result.message);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-semibold text-brand-dark">&quot;{productName}&quot;</span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}