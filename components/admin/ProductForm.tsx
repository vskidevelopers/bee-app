'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Image as ImageIcon, Upload, Loader2, X, CheckCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { uploadToCloudinary, UploadProgress, validateImageFile } from '@/lib/cloudinary';

interface ProductFormProps {
    product?: Product;
    onSubmit: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    submitLabel: string;
}

const CATEGORIES = [
    'Warm Duvets', 'Mosquito Nets', 'Bedside & Furniture',
    'Carpets & Rugs', 'Smart Home Gadgets', 'Dinner Sets', 'others'
];

export function ProductForm({ product, onSubmit, submitLabel }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Log component mount
    console.log('[BeeHouseholds:ProductForm] Mounted', {
        mode: product ? 'edit' : 'create',
        productId: product?.id
    });

    // Form state
    const [images, setImages] = useState<{ url: string; alt: string; cloudinaryId?: string }[]>(
        product?.images || [{ url: '', alt: '' }]
    );
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
        product?.specifications
            ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: String(v) }))
            : [{ key: '', value: '' }]
    );

    // Upload state
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

    // Image handlers
    const handleAddImage = () => {
        console.log('[BeeHouseholds:ProductForm] Adding image slot');
        setImages([...images, { url: '', alt: '' }]);
    };

    const handleRemoveImage = (idx: number) => {
        console.log('[BeeHouseholds:ProductForm] Removing image at index', idx);
        setImages(images.filter((_, i) => i !== idx));
        toast.info('Image removed');
    };

    const handleImageAltChange = (idx: number, alt: string) => {
        const updated = [...images];
        updated[idx].alt = alt;
        setImages(updated);
    };

    const handleFileSelect = async (idx: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('[BeeHouseholds:ProductForm] File selected for upload', {
            index: idx,
            name: file.name,
            size: file.size,
            type: file.type
        });

        const validation = validateImageFile(file);
        if (!validation.valid) {
            console.warn('[BeeHouseholds:ProductForm] File validation failed', validation.error);
            toast.error(validation.error || 'Invalid file');
            e.target.value = '';
            return;
        }

        setUploadingIndex(idx);
        setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

        try {
            const category = (document.querySelector('select[name="category"]') as HTMLSelectElement)?.value || 'general';
            console.log('[BeeHouseholds:ProductForm] Starting Cloudinary upload', { category, file: file.name });

            const result = await uploadToCloudinary(file, category, (progress) => {
                setUploadProgress(progress);
                if (progress.percentage % 25 === 0) {
                    console.log(`[BeeHouseholds:ProductForm] Upload progress: ${progress.percentage}%`);
                }
            });

            const updated = [...images];
            updated[idx] = {
                url: result.secure_url,
                alt: updated[idx].alt || file.name.replace(/\.[^/.]+$/, ''),
                cloudinaryId: result.public_id,
            };
            setImages(updated);

            console.log('[BeeHouseholds:ProductForm] Image uploaded successfully', {
                url: result.secure_url,
                publicId: result.public_id
            });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('[BeeHouseholds:ProductForm] Upload failed', { error, file: file.name });
            toast.error(error instanceof Error ? error.message : 'Upload failed');
            const updated = [...images];
            updated[idx] = { url: '', alt: '' };
            setImages(updated);
        } finally {
            setUploadingIndex(null);
            setUploadProgress(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Specs handlers
    const handleAddSpec = () => {
        console.log('[BeeHouseholds:ProductForm] Adding specification slot');
        setSpecs([...specs, { key: '', value: '' }]);
    };
    const handleRemoveSpec = (idx: number) => {
        console.log('[BeeHouseholds:ProductForm] Removing specification at index', idx);
        setSpecs(specs.filter((_, i) => i !== idx));
    };
    const handleSpecChange = (idx: number, field: 'key' | 'value', value: string) => {
        const updated = [...specs];
        updated[idx][field] = value;
        setSpecs(updated);
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('[BeeHouseholds:ProductForm] Form submission started');
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const validImages = images.filter(img => img.url.trim());
        formData.set('images', JSON.stringify(validImages));
        console.log('[BeeHouseholds:ProductForm] Prepared images for submission', { count: validImages.length });

        const validSpecs = specs.filter(s => s.key.trim());
        formData.set('specifications', JSON.stringify(validSpecs));
        console.log('[BeeHouseholds:ProductForm] Prepared specifications for submission', { count: validSpecs.length });

        try {
            console.log('[BeeHouseholds:ProductForm] Calling onSubmit Server Action');
            const result = await onSubmit(formData);

            if (result.success) {
                console.log('[BeeHouseholds:ProductForm] Submission successful', {
                    message: result.message,
                    nextAction: 'redirect to /admin/products'
                });
                toast.success(result.message);
                router.push('/admin/products');
                router.refresh();
            } else {
                console.warn('[BeeHouseholds:ProductForm] Submission failed', { message: result.message });
                toast.error(result.message);
            }
        } catch (error) {
            console.error('[BeeHouseholds:ProductForm] Unexpected submission error', { error });
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
            console.log('[BeeHouseholds:ProductForm] Form submission completed, loading state reset');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

            {/* ===== Basic Information ===== */}
            <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-dark mb-4 pb-3 border-b border-stone-100">
                    Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-brand-dark">
                            Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={product?.name}
                            required
                            placeholder="e.g., Premium Queen Duvet"
                            className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-brand-dark">
                            Category <span className="text-red-500">*</span>
                        </Label>
                        <Select name="category" defaultValue={product?.category}>
                            <SelectTrigger className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2 mt-5">
                    <Label htmlFor="shortDescription" className="text-sm font-medium text-brand-dark">
                        Short Description <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="shortDescription"
                        name="shortDescription"
                        defaultValue={product?.shortDescription}
                        required
                        placeholder="Brief product summary for listings"
                        className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                    />
                </div>

                <div className="space-y-2 mt-5">
                    <Label htmlFor="description" className="text-sm font-medium text-brand-dark">
                        Full Description
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product?.description}
                        rows={4}
                        placeholder="Detailed product information, materials, care instructions, etc."
                        className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition resize-y"
                    />
                </div>
            </section>

            {/* ===== Product Images ===== */}
            <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <h2 className="text-lg font-semibold text-brand-dark">Product Images</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddImage}
                        className="gap-1.5"
                    >
                        <Plus className="h-4 w-4" /> Add Slot
                    </Button>
                </div>

                <div className="space-y-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-stone-200 bg-stone-50/50"
                        >
                            <div className="w-full md:w-40 shrink-0">
                                {img.url ? (
                                    <div className="relative group">
                                        <img
                                            src={img.url}
                                            alt={img.alt || 'Preview'}
                                            className="w-full h-32 object-cover rounded-md border border-stone-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...images];
                                                updated[idx] = { url: '', alt: '', cloudinaryId: '' };
                                                setImages(updated);
                                                toast.info('Image cleared');
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            title="Remove image"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : uploadingIndex === idx ? (
                                    <div className="w-full h-32 rounded-md border-2 border-dashed border-brand-gold/50 bg-stone-100 flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-6 w-6 text-brand-gold animate-spin" />
                                        <span className="text-xs text-brand-grey">{uploadProgress?.percentage}%</span>
                                    </div>
                                ) : (
                                    <label className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-stone-300 hover:border-brand-gold hover:bg-brand-gold/5 cursor-pointer transition">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            onChange={(e) => handleFileSelect(idx, e)}
                                            className="hidden"
                                        />
                                        <Upload className="h-5 w-5 text-stone-400" />
                                        <span className="text-xs text-stone-500">Click to upload</span>
                                    </label>
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label className="text-xs font-medium text-brand-grey">Alt Text</Label>
                                <Input
                                    placeholder="e.g., Queen-size warm duvet in beige"
                                    value={img.alt}
                                    onChange={(e) => handleImageAltChange(idx, e.target.value)}
                                    disabled={uploadingIndex === idx}
                                    className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                                />
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveImage(idx)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 h-8 w-8"
                                title="Remove"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Pricing ===== */}
            <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-dark mb-4 pb-3 border-b border-stone-100">
                    Pricing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-brand-dark">
                            Price (KES) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-stone-400 text-sm">KSh</span>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                defaultValue={product?.price}
                                required
                                min="0"
                                className="pl-12 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discountPrice" className="text-sm font-medium text-brand-dark flex items-center gap-1.5">
                            Discount Price (KES)
                            <Tag className="h-3.5 w-3.5 text-brand-gold" />
                            <span className="text-xs font-normal text-brand-grey">(Optional)</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-stone-400 text-sm">KSh</span>
                            <Input
                                id="discountPrice"
                                name="discountPrice"
                                type="number"
                                defaultValue={product?.discountPrice ? product.discountPrice : undefined}
                                min="0"
                                placeholder="Enter sale price"
                                className="pl-12 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Specifications ===== */}
            <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <h2 className="text-lg font-semibold text-brand-dark">Specifications</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSpec}
                        className="gap-1.5"
                    >
                        <Plus className="h-4 w-4" /> Add Spec
                    </Button>
                </div>

                <div className="space-y-3">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="flex gap-3">
                            <Input
                                placeholder="Key (e.g., Size)"
                                value={spec.key}
                                onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                                className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                            />
                            <Input
                                placeholder="Value (e.g., Queen)"
                                value={spec.value}
                                onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                                className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSpec(idx)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 h-8 w-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Visibility ===== */}
            <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                    <Switch
                        id="featured"
                        name="featured"
                        defaultChecked={product?.featured}
                        className="data-[state=checked]:bg-brand-gold"
                    />
                    <Label htmlFor="featured" className="font-medium text-brand-dark cursor-pointer">
                        Featured Product
                    </Label>
                </div>
            </section>

            {/* ===== Action Buttons ===== */}
            <div className="flex gap-3 pt-6 border-t border-stone-200">
                <Button
                    type="submit"
                    className="bg-brand-gold border-[#b88a35] hover:bg-[#b88a35] text-[#b88a35] hover:text-white font-medium border-2 border-brand-gold hover:border-[#b88a35] transition-all min-w-[140px]"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {submitLabel}
                        </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        console.log('[BeeHouseholds:ProductForm] Cancel clicked, navigating back');
                        router.back();
                    }}
                    disabled={loading}
                    className="min-w-[140px] border-2 border-stone-300 text-brand-dark hover:bg-stone-50 hover:text-brand-dark transition-all"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}