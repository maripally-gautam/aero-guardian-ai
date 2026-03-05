import { useEffect, useState } from "react";

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

const FlyingAirplanes = () => {
    const [planes, setPlanes] = useState<FlyingPlane[]>([]);

    useEffect(() => {
        const generatePlanes = (): FlyingPlane[] => {
            const count = 6;
            return Array.from({ length: count }, (_, i) => ({
                id: i,
                top: 8 + Math.random() * 80,
                duration: 18 + Math.random() * 22,
                delay: i * 4 + Math.random() * 5,
                size: 16 + Math.random() * 20,
                opacity: 0.06 + Math.random() * 0.1,
                direction: (i % 2 === 0 ? "ltr" : "rtl") as "ltr" | "rtl",
                yOffset: -15 + Math.random() * 30,
            }));
        };

        setPlanes(generatePlanes());
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
                    <svg
                        width={plane.size}
                        height={plane.size}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            transform: plane.direction === "rtl" ? "scaleX(-1)" : "none",
                        }}
                    >
                        <path
                            d="M21.5 14.0002L13 17.5002V21.0002L10.5 19.0002L8 21.0002V17.5002L2.5 14.0002L8 11.5002V4.50024C8 3.83724 8.26 3.23724 8.75 2.75024C9.24 2.26024 9.84 2.00024 10.5 2.00024C11.16 2.00024 11.76 2.26024 12.25 2.75024C12.74 3.24024 13 3.84024 13 4.50024V11.5002L21.5 14.0002Z"
                            fill="currentColor"
                            className="text-primary"
                        />
                    </svg>
                </div>
            ))}

            {/* Contrails / vapor trails */}
            {planes.slice(0, 3).map((plane) => (
                <div
                    key={`trail-${plane.id}`}
                    className={`flying-contrail ${plane.direction}`}
                    style={{
                        top: `${plane.top + 0.5}%`,
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
