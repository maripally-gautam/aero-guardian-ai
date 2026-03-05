import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Plane, FileText, ClipboardCheck, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { healthChartData, inspectionActivityData } from "@/data/mockData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

const darkGradients = [
  "bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700",
  "bg-gradient-to-br from-slate-400 via-gray-400 to-slate-500",
  "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600",
];

const lightGradients = [
  "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600",
  "bg-gradient-to-br from-amber-500 via-orange-500 to-red-400",
  "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
  "bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500",
];

const StatCard = ({ title, value, change, icon: Icon, gradient, index }: { title: string; value: string | number; change?: string; icon: any; gradient: string; index: number }) => (
  <motion.div variants={item}>
    <div className="premium-card p-6 group hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${gradient} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-0.5 text-xs font-heading text-success"
          >
            <ArrowUpRight className="h-3 w-3" />{change}
          </motion.span>
        )}
      </div>
      <p className="text-sm text-muted-foreground font-heading mb-1">{title}</p>
      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
        className="text-3xl font-display font-bold text-foreground tracking-tight"
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { aircraft, documents, reports } = useAppData();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gradients = isDark ? darkGradients : lightGradients;

  const chartColors = {
    grid: isDark ? "hsl(220 12% 16%)" : "hsl(40 15% 88%)",
    text: isDark ? "hsl(220 8% 50%)" : "hsl(220 10% 45%)",
    tooltip: {
      bg: isDark ? "hsl(220 14% 11%)" : "hsl(0 0% 100%)",
      border: isDark ? "hsl(220 12% 22%)" : "hsl(40 15% 85%)",
      text: isDark ? "hsl(40 10% 90%)" : "hsl(220 25% 15%)",
    },
    bar1Start: isDark ? "#C9A84C" : "#2D9C6F",
    bar1End: isDark ? "#8B6914" : "#1A6B4A",
    bar2: isDark ? "hsl(220 12% 18%)" : "hsl(40 15% 90%)",
    line: isDark ? "#C9A84C" : "#C0703A",
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Welcome back, <span className="gradient-text-rainbow">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground font-heading mt-1">Here's your fleet overview for today</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Aircraft" value={aircraft.length} change="+1" icon={Plane} gradient={gradients[0]} index={0} />
          <StatCard title="Documents" value={documents.length} icon={FileText} gradient={gradients[1]} index={1} />
          <StatCard title="Inspections" value={reports.length} change="+2" icon={ClipboardCheck} gradient={gradients[2]} index={2} />
          <StatCard title="System Status" value="Online" icon={Activity} gradient={gradients[3]} index={3} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="premium-card hover-lift">
              <CardHeader><CardTitle className="font-heading text-lg flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Aircraft Health Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={healthChartData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: chartColors.text, fontSize: 12, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: chartColors.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: chartColors.tooltip.bg, border: `1px solid ${chartColors.tooltip.border}`, borderRadius: 12, color: chartColors.tooltip.text, fontFamily: "Space Grotesk" }}
                      cursor={{ fill: "hsl(var(--primary) / 0.05)" }}
                    />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.bar1Start} />
                        <stop offset="100%" stopColor={chartColors.bar1End} />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="health" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill={chartColors.bar2} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="premium-card hover-lift">
              <CardHeader><CardTitle className="font-heading text-lg flex items-center gap-2"><Activity className="h-4 w-4 text-accent" />Inspection Activity</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={inspectionActivityData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.line} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={chartColors.line} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: chartColors.text, fontSize: 12, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: chartColors.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: chartColors.tooltip.bg, border: `1px solid ${chartColors.tooltip.border}`, borderRadius: 12, color: chartColors.tooltip.text, fontFamily: "Space Grotesk" }}
                    />
                    <Area type="monotone" dataKey="inspections" stroke={chartColors.line} strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: chartColors.line, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 2, stroke: chartColors.line }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
