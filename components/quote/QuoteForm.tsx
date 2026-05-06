'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { createQuotation } from '@/lib/actions/quotations';

const PRODUCT_CATEGORIES = [
  'Warm Duvets',
  'Mosquito Nets', 
  'Bedside & Furniture',
  'Carpets & Rugs',
  'Smart Home Gadgets',
  'Dinner Sets',
  'Custom/Other',
];

export function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productInterest: '',
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
      toast.error('Please enter a valid Kenyan phone number (e.g., 0720151058)');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please tell us what you need');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    console.info('[QuoteForm] Submitting quotation request', { formData });

    // ✅ Matches your action signature exactly
    const result = await createQuotation({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      productInterest: formData.productInterest || undefined,
      message: formData.message,
      source: 'quote-page',
    });

    setLoading(false);

    if (result.success && result.id) {
      console.info('[QuoteForm] Quotation submitted', { id: result.id });
      toast.success('Request received!');
      router.replace(`/quote?success=true&quoteId=${result.id}`);
    } else {
      console.error('[QuoteForm] Submission failed', result);
      toast.error('Failed to submit. Please try again.');
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
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          className="focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
        />
      </div>

      {/* Product Interest */}
      <div className="space-y-2">
        <Label htmlFor="productInterest">What are you interested in?</Label>
        <Select 
          value={formData.productInterest} 
          onValueChange={(val) => handleChange(val, 'productInterest')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[11px] text-brand-grey">Or describe in the message below</p>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Tell us what you need *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="e.g., I need 5 queen-size warm duvets in beige for a hotel project. Please share pricing and delivery timeline."
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
            <MessageCircle className="h-4 w-4 mr-2" />
            Request Quote via WhatsApp
          </>
        )}
      </Button>

      {/* Trust Note */}
      <p className="text-xs text-brand-grey text-center pt-2">
        🔒 We never share your info • Response within 1 hour • No obligation
      </p>
    </form>
  );
}