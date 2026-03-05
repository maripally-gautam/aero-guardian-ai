import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import FlyingAirplanes from "@/components/FlyingAirplanes";
import AuroraBackground from "@/components/AuroraBackground";
import ThemeToggle from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background grid-bg noise-bg relative">
        {/* Background effects */}
        <AuroraBackground />
        <FlyingAirplanes />

        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-[5]">
          <header className="h-16 flex items-center justify-between border-b border-border/50 px-6 glass-strong z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30 text-muted-foreground text-sm w-64">
                <Search className="h-4 w-4" />
                <span className="font-heading text-xs">Search systems...</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </button>

              {/* Theme Toggle - between bell and avatar */}
              <ThemeToggle />

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-heading font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "Technician"}</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-primary/30 glow-primary-sm">
                  {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.name} />}
                  <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-display font-bold">
                    {user?.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto relative z-[1]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
