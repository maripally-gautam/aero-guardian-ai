import { useEffect, useState, useMemo } from "react";

interface FlyingPlane {
    id: number;
    top: number;
    duration: number;
    delay: number;
    size: number;
    opacity: number;
    direction: "ltr" | "rtl";
    yOffset: number;
}

const AirplaneSVG = ({ size, direction }: { size: number; direction: "ltr" | "rtl" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            transform: direction === "rtl" ? "scaleX(-1)" : "none",
        }}
    >
        {/* Fuselage */}
        <ellipse cx="32" cy="32" rx="28" ry="4" fill="currentColor" opacity="0.7" />
        {/* Nose cone */}
        <path d="M60 32 L64 31 L64 33 Z" fill="currentColor" opacity="0.8" />
        {/* Wings */}
        <path d="M24 28 L32 12 L36 12 L32 28 Z" fill="currentColor" opacity="0.6" />
        <path d="M24 36 L32 52 L36 52 L32 36 Z" fill="currentColor" opacity="0.6" />
        {/* Tail fin vertical */}
        <path d="M6 32 L4 20 L8 20 L10 32 Z" fill="currentColor" opacity="0.55" />
        {/* Tail fin horizontal */}
        <path d="M6 30 L10 24 L12 24 L10 30 Z" fill="currentColor" opacity="0.45" />
        <path d="M6 34 L10 40 L12 40 L10 34 Z" fill="currentColor" opacity="0.45" />
        {/* Engine pods */}
        <ellipse cx="28" cy="22" rx="3" ry="1.5" fill="currentColor" opacity="0.5" />
        <ellipse cx="28" cy="42" rx="3" ry="1.5" fill="currentColor" opacity="0.5" />
    </svg>
);

const FlyingAirplanes = () => {
    const planes = useMemo<FlyingPlane[]>(() => {
        const count = 6;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            top: 5 + Math.random() * 85,
            duration: 14 + Math.random() * 20,
            delay: Math.random() * 15,
            size: 28 + Math.random() * 20,
            opacity: 0.12 + Math.random() * 0.16,
            direction: (Math.random() > 0.5 ? "ltr" : "rtl") as "ltr" | "rtl",
            yOffset: -25 + Math.random() * 50,
        }));
    }, []);

    return (
        <div className="flying-airplanes-container">
            {planes.map((plane) => (
                <div
                    key={plane.id}
                    className={`flying-plane ${plane.direction}`}
                    style={{
                        top: `${plane.top}%`,
                        animationDuration: `${plane.duration}s`,
                        animationDelay: `${plane.delay}s`,
                        opacity: plane.opacity,
                        "--y-offset": `${plane.yOffset}px`,
                    } as React.CSSProperties}
                >
                    <div className="text-primary">
                        <AirplaneSVG size={plane.size} direction={plane.direction} />
                    </div>
                </div>
            ))}

            {/* Contrails */}
            {planes.slice(0, 3).map((plane) => (
                <div
                    key={`trail-${plane.id}`}
                    className={`flying-contrail ${plane.direction}`}
                    style={{
                        top: `${plane.top + 0.3}%`,
                        animationDuration: `${plane.duration}s`,
                        animationDelay: `${plane.delay + 0.3}s`,
                        opacity: plane.opacity * 0.4,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

export default FlyingAirplanes;
