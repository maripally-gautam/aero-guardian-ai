import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, FileText, ClipboardCheck, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { healthChartData, inspectionActivityData } from "@/data/mockData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

const gradientBgs = [
  "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700",
  "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600",
  "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600",
  "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
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
          <StatCard title="Total Aircraft" value={aircraft.length} change="+1" icon={Plane} gradient={gradientBgs[0]} index={0} />
          <StatCard title="Documents" value={documents.length} icon={FileText} gradient={gradientBgs[1]} index={1} />
          <StatCard title="Inspections" value={reports.length} change="+2" icon={ClipboardCheck} gradient={gradientBgs[2]} index={2} />
          <StatCard title="System Status" value="Online" icon={Activity} gradient={gradientBgs[3]} index={3} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="premium-card hover-lift">
              <CardHeader><CardTitle className="font-heading text-lg flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-400" />Aircraft Health Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={healthChartData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 20% 16%)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "hsl(225 15% 50%)", fontSize: 12, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(225 15% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 20% 20%)", borderRadius: 12, color: "hsl(220 20% 95%)", fontFamily: "Space Grotesk" }}
                      cursor={{ fill: "hsl(250 85% 65% / 0.05)" }}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(250 85% 65%)" />
                        <stop offset="100%" stopColor="hsl(200 80% 55%)" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="health" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="hsl(230 20% 18%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="premium-card hover-lift">
              <CardHeader><CardTitle className="font-heading text-lg flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-400" />Inspection Activity</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={inspectionActivityData}>
                    <defs>
                      <linearGradient id="inspGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(200 80% 55%)" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="hsl(250 85% 65%)" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="hsl(200 80% 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 20% 16%)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "hsl(225 15% 50%)", fontSize: 12, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(225 15% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 20% 20%)", borderRadius: 12, color: "hsl(220 20% 95%)", fontFamily: "Space Grotesk" }}
                    />
                    <Area type="monotone" dataKey="inspections" stroke="hsl(200 80% 55%)" strokeWidth={2.5} fill="url(#inspGradient)" dot={{ fill: "hsl(200 80% 55%)", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(200 80% 55%)" }} />
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
