'use client';

import { useEffect, useState } from 'react';

export function TikTokFeed() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;

        script.onload = () => {
            setLoaded(true);
        };

        if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            document.body.appendChild(script);
        }

        return () => { };
    }, []);

    if (!loaded) {
        return (
            <div className="w-full h-96 bg-stone-800 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-600">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-stone-400 text-sm">Loading TikTok feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="elfsight-app-65c4ad60-d1f6-49f1-96f4-83faf5bd5003"
            data-elfsight-app-lazy
        />
    );
}