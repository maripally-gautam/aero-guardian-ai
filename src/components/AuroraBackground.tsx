const AuroraBackground = () => {
    return (
        <div className="aurora-bg">
            {/* Purple blob - top left */}
            <div
                className="aurora-blob"
                style={{
                    top: "-10%",
                    left: "-5%",
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, hsl(250 85% 65% / 0.06) 0%, transparent 70%)",
                    animation: "aurora-1 25s ease-in-out infinite",
                }}
            />
            {/* Cyan blob - top right */}
            <div
                className="aurora-blob"
                style={{
                    top: "10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, hsl(200 80% 55% / 0.05) 0%, transparent 70%)",
                    animation: "aurora-2 20s ease-in-out infinite",
                }}
            />
            {/* Pink blob - bottom center */}
            <div
                className="aurora-blob"
                style={{
                    bottom: "5%",
                    left: "30%",
                    width: "450px",
                    height: "450px",
                    background: "radial-gradient(circle, hsl(330 90% 60% / 0.04) 0%, transparent 70%)",
                    animation: "aurora-3 22s ease-in-out infinite",
                }}
            />
            {/* Green blob - mid left */}
            <div
                className="aurora-blob"
                style={{
                    top: "40%",
                    left: "-8%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, hsl(160 95% 50% / 0.03) 0%, transparent 70%)",
                    animation: "aurora-2 30s ease-in-out infinite",
                    animationDelay: "5s",
                }}
            />
            {/* Orange blob - bottom right */}
            <div
                className="aurora-blob"
                style={{
                    bottom: "-10%",
                    right: "10%",
                    width: "350px",
                    height: "350px",
                    background: "radial-gradient(circle, hsl(25 100% 60% / 0.03) 0%, transparent 70%)",
                    animation: "aurora-1 28s ease-in-out infinite",
                    animationDelay: "10s",
                }}
            />
        </div>
    );
};

export default AuroraBackground;
