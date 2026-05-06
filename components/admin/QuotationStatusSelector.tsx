'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Quotation } from '@/types';
import { updateQuotationStatus } from '@/lib/actions/quotations';

interface QuotationStatusSelectorProps {
    quotationId: string;
    defaultStatus: Quotation['status'];
}

export function QuotationStatusSelector({ quotationId, defaultStatus }: QuotationStatusSelectorProps) {
    return (
        <Select
            defaultValue={defaultStatus}
            onValueChange={(val) => updateQuotationStatus(quotationId, val as Quotation['status'])}
        >
            <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
        </Select>
    );
}