'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { createContactInquiry } from '@/lib/actions/contacts';

export function ContactForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
        field?: string
    ) => {
        if (typeof e === 'string' && field) {
            setFormData(prev => ({ ...prev, [field]: e }));
        } else if (typeof e !== 'string') {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }
        if (!formData.phone.trim() || !/^254\d{9}$|^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            toast.error('Please enter a valid Kenyan phone number');
            return false;
        }
        if (!formData.subject.trim()) {
            toast.error('Please enter a subject');
            return false;
        }
        if (!formData.message.trim()) {
            toast.error('Please tell us how we can help');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        console.info('[ContactForm] Submitting inquiry', { formData });

        const result = await createContactInquiry({
            ...formData,
            source: 'contact-page',
        });

        setLoading(false);

        if (result.success && result.id) {
            console.info('[ContactForm] Inquiry submitted', { id: result.id });
            toast.success('Message sent!');
            router.replace(`/contact?success=true&inquiryId=${result.id}`);
        } else {
            console.error('[ContactForm] Submission failed', result);
            toast.error('Failed to send. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Jane Doe"
                    required
                    className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                />
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0720 151 058"
                        required
                        pattern="^(\+254|254|0)?[79]\d{8}$"
                        className="pl-9 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold font-mono"
                    />
                </div>
                <p className="text-[11px] text-brand-grey">We&apos;ll respond via WhatsApp or call</p>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="pl-9 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                    />
                </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Question about delivery, Custom order request"
                    required
                    className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
                />
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?"
                    required
                    rows={4}
                    className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold resize-y"
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-brand-gold hover:bg-[#b88a35] text-white font-medium h-11"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                    </>
                )}
            </Button>


        </form>
    );
}