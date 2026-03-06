import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

/* ──────────────────────────────────────────────
   SVG Path Data for 3 aircraft types
   ────────────────────────────────────────────── */

// Each draw function renders centred at (0,0)
function drawAirplane(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    glowAlpha: number,
) {
    const s = size / 64;
    ctx.save();
    ctx.scale(s, s);
    ctx.fillStyle = color;

    // Fuselage
    ctx.globalAlpha = 0.75 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.globalAlpha = 0.85 + glowAlpha * 0.1;
    ctx.beginPath();
    ctx.moveTo(28, 0);
    ctx.lineTo(34, -1.5);
    ctx.lineTo(34, 1.5);
    ctx.closePath();
    ctx.fill();

    // Wings
    ctx.globalAlpha = 0.6 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(4, -22);
    ctx.lineTo(8, -22);
    ctx.lineTo(2, -4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(4, 22);
    ctx.lineTo(8, 22);
    ctx.lineTo(2, 4);
    ctx.closePath();
    ctx.fill();

    // Tail
    ctx.globalAlpha = 0.55 + glowAlpha * 0.15;
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(-28, -12);
    ctx.lineTo(-24, -12);
    ctx.lineTo(-22, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(-28, 12);
    ctx.lineTo(-24, 12);
    ctx.lineTo(-22, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawHelicopter(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    glowAlpha: number,
    time: number,
) {
    const s = size / 64;
    ctx.save();
    ctx.scale(s, s);
    ctx.fillStyle = color;

    // Body
    ctx.globalAlpha = 0.7 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cockpit
    ctx.globalAlpha = 0.85 + glowAlpha * 0.1;
    ctx.beginPath();
    ctx.ellipse(12, -2, 7, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail boom
    ctx.globalAlpha = 0.6 + glowAlpha * 0.15;
    ctx.beginPath();
    ctx.moveTo(-18, -2);
    ctx.lineTo(-36, -4);
    ctx.lineTo(-36, 0);
    ctx.lineTo(-18, 2);
    ctx.closePath();
    ctx.fill();

    // Tail rotor
    ctx.globalAlpha = 0.5 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.ellipse(-36, -2, 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main rotor (animated)
    const rotorAngle = time * 8;
    ctx.globalAlpha = 0.35 + glowAlpha * 0.15;
    ctx.save();
    ctx.translate(0, -10);
    ctx.rotate(rotorAngle);
    ctx.fillRect(-28, -1, 56, 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-28, -1, 56, 2);
    ctx.restore();

    // Rotor hub
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(0, -10, 2, 0, Math.PI * 2);
    ctx.fill();

    // Skids
    ctx.globalAlpha = 0.45 + glowAlpha * 0.1;
    ctx.fillRect(-12, 8, 24, 1.5);
    ctx.fillRect(-10, 6, 1.5, 3);
    ctx.fillRect(8, 6, 1.5, 3);

    ctx.restore();
}

function drawFighterJet(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    glowAlpha: number,
) {
    const s = size / 64;
    ctx.save();
    ctx.scale(s, s);
    ctx.fillStyle = color;

    // Fuselage
    ctx.globalAlpha = 0.75 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(10, -3);
    ctx.lineTo(-24, -3);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-24, 3);
    ctx.lineTo(10, 3);
    ctx.closePath();
    ctx.fill();

    // Nose cone
    ctx.globalAlpha = 0.9 + glowAlpha * 0.08;
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(38, -0.5);
    ctx.lineTo(38, 0.5);
    ctx.closePath();
    ctx.fill();

    // Delta wings
    ctx.globalAlpha = 0.6 + glowAlpha * 0.2;
    ctx.beginPath();
    ctx.moveTo(4, -3);
    ctx.lineTo(-8, -24);
    ctx.lineTo(-16, -24);
    ctx.lineTo(-14, -3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, 3);
    ctx.lineTo(-8, 24);
    ctx.lineTo(-16, 24);
    ctx.lineTo(-14, 3);
    ctx.closePath();
    ctx.fill();

    // Tail fins
    ctx.globalAlpha = 0.55 + glowAlpha * 0.15;
    ctx.beginPath();
    ctx.moveTo(-22, -3);
    ctx.lineTo(-28, -14);
    ctx.lineTo(-24, -14);
    ctx.lineTo(-20, -3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-22, 3);
    ctx.lineTo(-28, 14);
    ctx.lineTo(-24, 14);
    ctx.lineTo(-20, 3);
    ctx.closePath();
    ctx.fill();

    // Engine glow
    ctx.globalAlpha = 0.3 + glowAlpha * 0.4;
    ctx.fillStyle = "#90caf9";
    ctx.beginPath();
    ctx.ellipse(-28, 0, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

/* ──────────────────────────────────────────────
   Aircraft Data Type
   ────────────────────────────────────────────── */
interface Aircraft {
    type: "airplane" | "helicopter" | "fighter_jet";
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    rotation: number;
    baseRotation: number;
    size: number;
    depth: number; // 0.4–1.0 for parallax
    color: string;
    opacity: number;
    // Smooth path params
    phaseX: number;
    phaseY: number;
    freqX: number;
    freqY: number;
    ampX: number;
    ampY: number;
    // Cursor interaction state
    dodgeX: number;
    dodgeY: number;
    dodgeRotation: number;
    glow: number;
    speedBoost: number;
}

const TRIGGER_DISTANCE = 120;

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
const FlyingAirplanes = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const aircraftRef = useRef<Aircraft[]>([]);
    const { theme } = useTheme();
    const themeRef = useRef(theme);

    // Keep theme ref in sync
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    const initAircraft = useCallback((w: number, h: number): Aircraft[] => {
        const configs: { type: Aircraft["type"]; color: string }[] = [
            { type: "airplane", color: "#ffffff" },
            { type: "airplane", color: "#ffffff" },
            { type: "helicopter", color: "#cfd8dc" },
            { type: "helicopter", color: "#cfd8dc" },
            { type: "fighter_jet", color: "#90caf9" },
            { type: "fighter_jet", color: "#90caf9" },
        ];

        // Sparse positions — divide screen into zones
        const zones = [
            { x: 0.15, y: 0.2 },
            { x: 0.8, y: 0.15 },
            { x: 0.25, y: 0.7 },
            { x: 0.75, y: 0.75 },
            { x: 0.5, y: 0.35 },
            { x: 0.6, y: 0.85 },
        ];

        return configs.map((cfg, i) => {
            const zone = zones[i];
            const x = zone.x * w + (Math.random() - 0.5) * w * 0.1;
            const y = zone.y * h + (Math.random() - 0.5) * h * 0.1;
            const depth = 0.4 + Math.random() * 0.6;
            const size = (30 + Math.random() * 20) * depth;

            return {
                type: cfg.type,
                x,
                y,
                baseX: x,
                baseY: y,
                vx: 0,
                vy: 0,
                rotation: (Math.random() - 0.5) * 0.6,
                baseRotation: (Math.random() - 0.5) * 0.4,
                size,
                depth,
                color: cfg.color,
                opacity: (0.1 + depth * 0.15),
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                freqX: 0.0002 + Math.random() * 0.0003,
                freqY: 0.0003 + Math.random() * 0.0002,
                ampX: 30 + Math.random() * 50,
                ampY: 20 + Math.random() * 40,
                dodgeX: 0,
                dodgeY: 0,
                dodgeRotation: 0,
                glow: 0,
                speedBoost: 0,
            };
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Re-initialise aircraft if empty or on resize
            if (aircraftRef.current.length === 0) {
                aircraftRef.current = initAircraft(window.innerWidth, window.innerHeight);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        // Mouse tracking
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseleave", onMouseLeave);

        // Initialise
        aircraftRef.current = initAircraft(window.innerWidth, window.innerHeight);

        let lastTime = performance.now();

        const animate = (now: number) => {
            const dt = Math.min(now - lastTime, 32); // cap at ~30fps worth of dt
            lastTime = now;
            const t = now * 0.001; // seconds

            const w = window.innerWidth;
            const h = window.innerHeight;
            const mouse = mouseRef.current;

            ctx.clearRect(0, 0, w, h);

            const isDark = themeRef.current === "dark";
            const glowColor = isDark
                ? "hsla(42, 75%, 55%,"
                : "hsla(160, 60%, 38%,";

            for (const craft of aircraftRef.current) {
                // ── Smooth floating motion ──
                const targetX =
                    craft.baseX + Math.sin(t * craft.freqX * 1000 + craft.phaseX) * craft.ampX;
                const targetY =
                    craft.baseY + Math.cos(t * craft.freqY * 1000 + craft.phaseY) * craft.ampY;

                // Smoothly interpolate position
                const lerpSpeed = 0.002 * (1 + craft.speedBoost);
                craft.x += (targetX - craft.x + craft.dodgeX) * lerpSpeed * dt;
                craft.y += (targetY - craft.y + craft.dodgeY) * lerpSpeed * dt;

                // Small rotation oscillation
                const targetRot =
                    craft.baseRotation +
                    Math.sin(t * 0.5 + craft.phaseX) * 0.15 +
                    craft.dodgeRotation;
                craft.rotation += (targetRot - craft.rotation) * 0.003 * dt;

                // ── Cursor interaction ──
                const dx = craft.x - mouse.x;
                const dy = craft.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const triggerDist = TRIGGER_DISTANCE * craft.depth;

                if (dist < triggerDist && dist > 0) {
                    const force = (1 - dist / triggerDist) * 80;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Push away
                    craft.dodgeX += (nx * force - craft.dodgeX) * 0.08;
                    craft.dodgeY += (ny * force - craft.dodgeY) * 0.08;

                    // Rotation from cursor
                    craft.dodgeRotation +=
                        (Math.atan2(ny, nx) * 0.3 - craft.dodgeRotation) * 0.06;

                    // Glow
                    craft.glow += (1 - dist / triggerDist - craft.glow) * 0.1;

                    // Speed boost
                    craft.speedBoost += (2 - craft.speedBoost) * 0.05;
                } else {
                    // Decay back to normal
                    craft.dodgeX *= 0.96;
                    craft.dodgeY *= 0.96;
                    craft.dodgeRotation *= 0.95;
                    craft.glow *= 0.94;
                    craft.speedBoost *= 0.97;
                }

                // ── Keep in bounds ──
                const margin = craft.size;
                if (craft.x < margin) craft.baseX += 1;
                if (craft.x > w - margin) craft.baseX -= 1;
                if (craft.y < margin) craft.baseY += 1;
                if (craft.y > h - margin) craft.baseY -= 1;

                // ── Draw ──
                ctx.save();
                ctx.translate(craft.x, craft.y);
                ctx.rotate(craft.rotation);
                ctx.globalAlpha = craft.opacity + craft.glow * 0.15;

                // Glow effect
                if (craft.glow > 0.05) {
                    ctx.shadowColor = `${glowColor} ${craft.glow * 0.6})`;
                    ctx.shadowBlur = 20 * craft.glow;
                }

                switch (craft.type) {
                    case "airplane":
                        drawAirplane(ctx, craft.size, craft.color, craft.glow);
                        break;
                    case "helicopter":
                        drawHelicopter(ctx, craft.size, craft.color, craft.glow, t);
                        break;
                    case "fighter_jet":
                        drawFighterJet(ctx, craft.size, craft.color, craft.glow);
                        break;
                }

                ctx.restore();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
        };
    }, [initAircraft]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 2,
            }}
        />
    );
};

export default FlyingAirplanes;
