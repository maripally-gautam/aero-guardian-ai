import { LayoutDashboard, Plane, Upload, ClipboardCheck, MessageSquare, FileText, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Aircraft", url: "/aircraft", icon: Plane },
  { title: "Documents", url: "/documents", icon: Upload },
  { title: "Pre-Flight", url: "/preflight", icon: ClipboardCheck },
  { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-7 mb-4">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Plane className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-sm font-bold gradient-text tracking-wide">AEROGUARDIAN</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary font-medium glow-primary-sm border border-primary/20"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="font-heading text-[0.9rem]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-4 px-4 py-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer transition-all duration-200">
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-heading text-[0.9rem]">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
