import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Shield, Zap, Brain } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/dashboard");
  };

  const features = [
    { icon: Brain, label: "RAG-Powered AI" },
    { icon: Shield, label: "Fault Detection" },
    { icon: Zap, label: "Real-time Analysis" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden noise-bg">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(250 85% 65% / 0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 80% 55% / 0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1.15, 1, 1.15], rotate: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(250 85% 65% / 0.04) 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Floating aircraft silhouettes */}
      <motion.div
        className="absolute top-16 right-24 text-primary/10"
        animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plane className="w-40 h-40" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-12 text-accent/8"
        animate={{ y: [12, -12, 12], x: [-8, 8, -8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plane className="w-24 h-24 rotate-[30deg]" />
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="premium-card p-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl gradient-primary flex items-center justify-center glow-primary"
          >
            <Plane className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl font-bold gradient-text mb-3 tracking-tight"
          >
            AeroGuardian AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-heading text-lg text-muted-foreground mb-8"
          >
            AI-Powered Aircraft Maintenance Assistant
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-3 mb-8 flex-wrap"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-heading text-muted-foreground"
              >
                <feat.icon className="h-3.5 w-3.5 text-primary" />
                {feat.label}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full font-heading text-base h-13 gradient-primary text-primary-foreground hover:opacity-90 glow-primary transition-all duration-500 hover:scale-[1.02] rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground/60 mt-6 font-heading"
          >
            Enterprise-grade security • Powered by RAG AI
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
