import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppData } from "@/contexts/AppContext";
import { ShieldCheck, AlertTriangle, XCircle, FileText, BarChart3 } from "lucide-react";

const statusConfig = {
  green: { label: "SAFE", icon: ShieldCheck, color: "text-success", bg: "bg-success/10 border-success/20" },
  yellow: { label: "WARNING", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  red: { label: "CRITICAL", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

const ReportsPage = () => {
  const { reports } = useAppData();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            Inspection Reports
          </h1>
          <p className="text-muted-foreground font-heading mt-1">Historical inspection data</p>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {reports.map((rpt) => {
            const cfg = statusConfig[rpt.status];
            const Icon = cfg.icon;
            return (
              <motion.div key={rpt.id} variants={item}>
                <div className="premium-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${cfg.bg} border`}><Icon className={`h-5 w-5 ${cfg.color}`} /></div>
                        <div>
                          <CardTitle className="font-heading text-lg">{rpt.aircraftModel}</CardTitle>
                          <p className="text-xs text-muted-foreground font-heading">{rpt.date}</p>
                        </div>
                      </div>
                      <Badge className={`${cfg.bg} ${cfg.color} border font-display text-xs`}>{cfg.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                      {[
                        { label: "Eng. Pressure", val: `${rpt.enginePressure} PSI` },
                        { label: "Eng. Temp", val: `${rpt.engineTemp} °C` },
                        { label: "Vibration", val: `${rpt.vibrationLevel} mm/s` },
                        { label: "Hydraulic", val: `${rpt.hydraulicPressure} PSI` },
                        { label: "Fuel Flow", val: rpt.fuelFlow },
                      ].map(({ label, val }) => (
                        <div key={label} className="bg-secondary/20 rounded-lg p-2.5">
                          <span className="text-muted-foreground text-xs font-heading">{label}</span>
                          <p className="font-display font-semibold text-sm mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                    {rpt.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-heading text-muted-foreground mb-1.5">Issues</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rpt.issues.map((iss, j) => <Badge key={j} variant="outline" className="text-xs font-heading border-border/50">{iss}</Badge>)}
                        </div>
                      </div>
                    )}
                    {rpt.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-heading text-muted-foreground mb-1.5">Recommendations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rpt.recommendations.map((rec, j) => <Badge key={j} className="bg-primary/10 text-primary border border-primary/20 text-xs font-heading"><FileText className="h-3 w-3 mr-1" />{rec}</Badge>)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ReportsPage;
