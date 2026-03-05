import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AircraftPage from "./pages/AircraftPage";
import DocumentsPage from "./pages/DocumentsPage";
import PreFlightPage from "./pages/PreFlightPage";
import AssistantPage from "./pages/AssistantPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import { Loader2, Plane } from "lucide-react";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse at 50% 50%, hsl(250 85% 65% / 0.05) 0%, transparent 70%)"
    }} />
    <div className="text-center space-y-6 relative z-10">
      <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center glow-primary">
        <Plane className="w-10 h-10 text-primary-foreground animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="font-heading text-muted-foreground">Initializing AeroGuardian...</span>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/aircraft" element={<ProtectedRoute><AircraftPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/preflight" element={<ProtectedRoute><PreFlightPage /></ProtectedRoute>} />
      <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
