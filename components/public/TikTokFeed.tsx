'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TikTokFeedProps {
    widgetId?: string;
    onLoaded?: () => void;
    onError?: () => void;
}

export function TikTokFeed({
    widgetId = '65c4ad60-d1f6-49f1-96f4-83faf5bd5003',
    onLoaded,
    onError
}: TikTokFeedProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);

    // Check if feed has rendered by looking for Elfsight's iframe/container
    const checkFeedLoaded = useCallback(() => {
        const container = document.querySelector(`.elfsight-app-${widgetId}`);
        if (!container) return false;

        // Look for signs the widget has rendered
        const hasIframe = container.querySelector('iframe') !== null;
        const hasContent = container.innerHTML.includes('tiktok') || container.children.length > 1;

        return hasIframe || hasContent;
    }, [widgetId]);

    // Load or reload the Elfsight script
    const loadElfsight = useCallback(() => {
        setStatus('loading');

        // Remove any existing script to force reload
        const existingScript = document.querySelector('script[src*="elfsightcdn.com/platform.js"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Clear previous widget content (but keep container)
        const container = document.querySelector(`.elfsight-app-${widgetId}`);
        if (container) {
            // Preserve the container, clear dynamic content
            container.innerHTML = `<div class="elfsight-app-${widgetId}" data-elfsight-app-lazy></div>`;
        }

        // Create new script
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;

        script.onload = () => {
            // Give Elfsight a moment to render
            setTimeout(() => {
                if (checkFeedLoaded()) {
                    setStatus('loaded');
                    onLoaded?.();
                } else {
                    setStatus('error');
                    onError?.();
                }
            }, 2000);
        };

        script.onerror = () => {
            setStatus('error');
            onError?.();
        };

        document.body.appendChild(script);
    }, [widgetId, checkFeedLoaded, onLoaded, onError]);

    // Initial load
    useEffect(() => {
        loadElfsight();

        // Timeout fallback: if not loaded after 8 seconds, show error
        const timeout = setTimeout(() => {
            if (status === 'loading' && !checkFeedLoaded()) {
                setStatus('error');
                onError?.();
            }
        }, 8000);

        return () => clearTimeout(timeout);
    }, [loadElfsight, status, checkFeedLoaded, onError]);

    // Handle manual refresh
    const handleRefresh = () => {
        setAttempt(prev => prev + 1);
        loadElfsight();
    };

    // Loading state
    if (status === 'loading') {
        return (
            <div className="w-full min-h-[400px] bg-stone-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-stone-600 p-6">
                <Loader2 className="h-8 w-8 text-brand-gold animate-spin mb-4" />
                <p className="text-stone-300 text-sm text-center">Loading TikTok feed...</p>
                <p className="text-stone-500 text-xs mt-2">This may take a few seconds</p>
            </div>
        );
    }

    // Error state with refresh button
    if (status === 'error') {
        return (
            <div className="w-full min-h-[400px] bg-stone-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-stone-600 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <RefreshCw className="h-6 w-6 text-red-400" />
                </div>
                <p className="text-stone-300 font-medium mb-2">Feed didn&apos;t load</p>
                <p className="text-stone-500 text-sm mb-4 max-w-xs">
                    This can happen due to ad blockers or slow connections.
                </p>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
                <p className="text-stone-600 text-xs mt-3">
                    Attempt {attempt + 1}
                </p>
            </div>
        );
    }

    // Success: Render the Elfsight widget container
    return (
        <div
            className="elfsight-app-65c4ad60-d1f6-49f1-96f4-83faf5bd5003"
            data-elfsight-app-lazy
        />
    );
}