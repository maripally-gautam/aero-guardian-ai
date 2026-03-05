import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden group transition-all duration-500 hover:scale-105"
            style={{
                background: isDark
                    ? "linear-gradient(135deg, hsl(230 20% 14%), hsl(230 25% 18%))"
                    : "linear-gradient(135deg, hsl(40 100% 92%), hsl(35 100% 85%))",
                border: isDark
                    ? "1px solid hsl(45 80% 55% / 0.2)"
                    : "1px solid hsl(35 90% 60% / 0.3)",
            }}
            aria-label="Toggle theme"
        >
            <motion.div
                key={theme}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {isDark ? (
                    <Moon className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                    <Sun className="h-4.5 w-4.5 text-amber-600" />
                )}
            </motion.div>

            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    boxShadow: isDark
                        ? "0 0 15px hsl(45 80% 55% / 0.15), inset 0 0 10px hsl(45 80% 55% / 0.05)"
                        : "0 0 15px hsl(35 90% 60% / 0.2), inset 0 0 10px hsl(35 90% 60% / 0.05)",
                }}
            />
        </button>
    );
};

export default ThemeToggle;
