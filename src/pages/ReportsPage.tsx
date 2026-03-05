import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppData } from "@/contexts/AppContext";
import { ShieldCheck, AlertTriangle, XCircle, FileText } from "lucide-react";

const statusConfig = {
  green: { label: "SAFE", icon: ShieldCheck, color: "text-success", bg: "bg-success/10" },
  yellow: { label: "WARNING", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  red: { label: "CRITICAL", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const ReportsPage = () => {
  const { reports } = useAppData();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Inspection Reports</h1>
          <p className="text-muted-foreground font-heading">Historical inspection data</p>
        </div>

        <div className="space-y-4">
          {reports.map((rpt, i) => {
            const cfg = statusConfig[rpt.status];
            const Icon = cfg.icon;
            return (
              <motion.div key={rpt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass border-border hover:glow-cyan-sm transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cfg.bg}`}><Icon className={`h-5 w-5 ${cfg.color}`} /></div>
                        <div>
                          <CardTitle className="font-heading text-lg">{rpt.aircraftModel}</CardTitle>
                          <p className="text-xs text-muted-foreground">{rpt.date}</p>
                        </div>
                      </div>
                      <Badge className={`${cfg.bg} ${cfg.color} font-display text-xs`}>{cfg.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-4">
                      <div><span className="text-muted-foreground text-xs">Eng. Pressure</span><p className="font-heading font-semibold">{rpt.enginePressure} PSI</p></div>
                      <div><span className="text-muted-foreground text-xs">Eng. Temp</span><p className="font-heading font-semibold">{rpt.engineTemp} °C</p></div>
                      <div><span className="text-muted-foreground text-xs">Vibration</span><p className="font-heading font-semibold">{rpt.vibrationLevel} mm/s</p></div>
                      <div><span className="text-muted-foreground text-xs">Hydraulic</span><p className="font-heading font-semibold">{rpt.hydraulicPressure} PSI</p></div>
                      <div><span className="text-muted-foreground text-xs">Fuel Flow</span><p className="font-heading font-semibold">{rpt.fuelFlow}</p></div>
                    </div>
                    {rpt.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-heading text-muted-foreground mb-1">Issues & Recommendations</p>
                        <div className="flex flex-wrap gap-1">
                          {rpt.issues.map((iss, j) => <Badge key={j} variant="outline" className="text-xs">{iss}</Badge>)}
                        </div>
                      </div>
                    )}
                    {rpt.recommendations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rpt.recommendations.map((rec, j) => <Badge key={j} variant="secondary" className="text-xs"><FileText className="h-3 w-3 mr-1" />{rec}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ReportsPage;
