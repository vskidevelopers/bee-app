"use client"
import { useEffect } from "react";

export default function TestColors() {
    // Debug: Check if Tailwind is processing
    useEffect(() => {
        const el = document.createElement('div');
        el.className = 'text-brand-gold';
        document.body.appendChild(el);

        const computed = window.getComputedStyle(el);
        const styles = document.styleSheets;

        console.log('=== Tailwind Debug ===');
        console.log('1. Computed color:', computed.color);
        console.log('2. ClassList:', el.classList.toString());

        // Check if Tailwind generated the class
        let foundClass = false;
        try {
            for (const sheet of Array.from(styles)) {
                if (!sheet.cssRules) continue;
                for (const rule of Array.from(sheet.cssRules)) {
                    if (rule instanceof CSSStyleRule && rule.selectorText?.includes('text-brand-gold')) {
                        console.log('3. ✅ Found in stylesheet:', rule.cssText);
                        foundClass = true;
                        break;
                    }
                }
                if (foundClass) break;
            }
            if (!foundClass) {
                console.warn('3. ❌ text-brand-gold NOT found in any stylesheet');
            }
        } catch (e) {
            console.warn('3. Could not inspect stylesheets (CORS restriction):', e);
        }

        document.body.removeChild(el);
    }, []);
    return (
        <div className="p-8 space-y-4">
            <p className="text-brand-gold text-2xl">text-brand-gold</p>
            <p className="bg-brand-gold text-white p-2">bg-brand-gold</p>
            <p className="border-2 border-brand-gold p-2">border-brand-gold</p>
            <p className="text-brand-dark">text-brand-dark</p>
            <p className="text-brand-grey">text-brand-grey</p>
            <p className="bg-brand-bg p-2">bg-brand-bg</p>
        </div>
    );
}