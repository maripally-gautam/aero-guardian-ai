import { useTheme } from "@/contexts/ThemeContext";

const AuroraBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="aurora-bg">
            {/* Gold/Emerald blob - top left */}
            <div
                className="aurora-blob"
                style={{
                    top: "-10%",
                    left: "-5%",
                    width: "600px",
                    height: "600px",
                    background: isDark
                        ? "radial-gradient(circle, hsl(42 75% 55% / 0.07) 0%, transparent 70%)"
                        : "radial-gradient(circle, hsl(160 60% 38% / 0.06) 0%, transparent 70%)",
                    animation: "aurora-1 25s ease-in-out infinite",
                }}
            />
            {/* Silver/Copper blob - top right */}
            <div
                className="aurora-blob"
                style={{
                    top: "10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    background: isDark
                        ? "radial-gradient(circle, hsl(220 15% 70% / 0.05) 0%, transparent 70%)"
                        : "radial-gradient(circle, hsl(25 75% 50% / 0.05) 0%, transparent 70%)",
                    animation: "aurora-2 20s ease-in-out infinite",
                }}
            />
            {/* Warm glow - bottom center */}
            <div
                className="aurora-blob"
                style={{
                    bottom: "5%",
                    left: "30%",
                    width: "450px",
                    height: "450px",
                    background: isDark
                        ? "radial-gradient(circle, hsl(32 85% 45% / 0.04) 0%, transparent 70%)"
                        : "radial-gradient(circle, hsl(155 65% 40% / 0.04) 0%, transparent 70%)",
                    animation: "aurora-3 22s ease-in-out infinite",
                }}
            />
            {/* Extra glow - mid right */}
            <div
                className="aurora-blob"
                style={{
                    top: "40%",
                    right: "10%",
                    width: "400px",
                    height: "400px",
                    background: isDark
                        ? "radial-gradient(circle, hsl(42 75% 55% / 0.04) 0%, transparent 70%)"
                        : "radial-gradient(circle, hsl(170 65% 30% / 0.03) 0%, transparent 70%)",
                    animation: "aurora-2 28s ease-in-out infinite",
                    animationDelay: "5s",
                }}
            />
        </div>
    );
};

export default AuroraBackground;
