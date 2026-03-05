import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlyingAirplanes from "@/components/FlyingAirplanes";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden noise-bg">
      <FlyingAirplanes />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, hsl(250 85% 65% / 0.05) 0%, transparent 70%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center"
        >
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-4 text-7xl font-display font-bold gradient-text"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-xl text-foreground font-heading"
        >
          Flight path not found
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-muted-foreground font-heading"
        >
          The route <code className="text-primary px-2 py-0.5 rounded bg-primary/10">{location.pathname}</code> doesn't exist
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/">
            <Button className="gradient-primary text-primary-foreground glow-primary font-heading hover:opacity-90 transition-all duration-300 hover:scale-[1.02] rounded-xl px-6">
              <Home className="h-4 w-4 mr-2" />
              Return to Base
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
