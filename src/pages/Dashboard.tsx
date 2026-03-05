import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, FileText, ClipboardCheck, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { healthChartData, inspectionActivityData } from "@/data/mockData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <motion.div variants={item}>
    <Card className="glass border-border hover:glow-cyan-sm transition-all duration-300 hover:scale-[1.02] cursor-default">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-heading">{title}</p>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const { aircraft, documents, reports } = useAppData();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-muted-foreground font-heading">Here's your fleet overview</p>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Aircraft" value={aircraft.length} icon={Plane} color="bg-primary/10 text-primary" />
          <StatCard title="Documents" value={documents.length} icon={FileText} color="bg-accent/20 text-accent" />
          <StatCard title="Inspections" value={reports.length} icon={ClipboardCheck} color="bg-success/10 text-success" />
          <StatCard title="System Status" value="Online" icon={Activity} color="bg-warning/10 text-warning" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass border-border">
              <CardHeader><CardTitle className="font-heading text-lg">Aircraft Health Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={healthChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 40% 18%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(220 40% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }} />
                    <Bar dataKey="health" fill="hsl(190 95% 50%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" fill="hsl(220 40% 18%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass border-border">
              <CardHeader><CardTitle className="font-heading text-lg">Inspection Activity</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={inspectionActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 40% 18%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(220 40% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }} />
                    <Line type="monotone" dataKey="inspections" stroke="hsl(190 95% 50%)" strokeWidth={2} dot={{ fill: "hsl(190 95% 50%)", r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
