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
          <SidebarGroupLabel className="px-3 py-5">
            {!collapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Plane className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display text-xs font-bold gradient-text tracking-wide">AEROGUARDIAN</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary font-medium glow-primary-sm border border-primary/20"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="font-heading text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-all duration-200">
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="font-heading text-sm">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
