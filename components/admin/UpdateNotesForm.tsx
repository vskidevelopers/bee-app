'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface UpdateNotesFormProps {
    customerId: string;
    initialNotes: string;
    onUpdate: (id: string, notes: string) => Promise<{ success: boolean; message: string }>;
}

export function UpdateNotesForm({ customerId, initialNotes, onUpdate }: UpdateNotesFormProps) {
    const router = useRouter();
    const [notes, setNotes] = useState(initialNotes);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.info('[UpdateNotesForm] Saving notes', { customerId, notesLength: notes.length });

        const result = await onUpdate(customerId, notes);

        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Add internal notes: delivery preferences, customer feedback, special requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
            />
            <Button
                type="submit"
                className="bg-brand-gold hover:bg-[#b88a35] text-white w-full sm:w-auto"
                disabled={loading || notes === initialNotes}
                size="sm"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                    </>
                )}
            </Button>
            {notes !== initialNotes && (
                <p className="text-xs text-brand-grey">Changes will be saved to this customer&apos;s profile</p>
            )}
        </form>
    );
}