import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={className}>
            {/* SVG Logo */}
            <svg
                width="180"
                height="60"
                viewBox="0 0 400 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Icon Part */}
                <g transform="translate(20, 10)">
                    {/* Left Room (Living) */}
                    <rect x="0" y="30" width="30" height="40" stroke="#1A1A1A" strokeWidth="3" />
                    <path d="M10 45 Q15 35 20 45" stroke="#D4A348" strokeWidth="2" fill="none" /> {/* Lamp */}
                    <rect x="10" y="50" width="10" height="15" fill="#1A1A1A" rx="2" /> {/* Chair */}

                    {/* Center Room (Bed) - Overlapping */}
                    <rect x="25" y="10" width="40" height="60" stroke="#1A1A1A" strokeWidth="3" />
                    <rect x="30" y="35" width="30" height="10" fill="#D4A348" rx="2" /> {/* Bed */}
                    <circle cx="50" cy="20" r="10" fill="#D4A348" /> {/* Sun/Circle */}

                    {/* Right Room (Plant) - Overlapping */}
                    <rect x="55" y="30" width="30" height="40" stroke="#1A1A1A" strokeWidth="3" />
                    <path d="M70 45 L70 35 M65 35 L75 35" stroke="#D4A348" strokeWidth="2" /> {/* Plant */}
                </g>

                {/* Text Part */}
                <text x="110" y="60" fontFamily="sans-serif" fontSize="32" fontWeight="bold" fill="#1A1A1A">
                    BEEHOUSEHOLDS
                </text>
                <text x="112" y="85" fontFamily="sans-serif" fontSize="16" fill="#4B5563" letterSpacing="2">
                    SMART HOME & DECO
                </text>
            </svg>
        </Link>
    );
}