import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/contexts/AppContext";
import { safeThresholds } from "@/data/mockData";
import { ShieldCheck, AlertTriangle, XCircle, Loader2, FileText, Radar } from "lucide-react";

type Status = "green" | "yellow" | "red";

const PreFlightPage = () => {
  const { aircraft, addReport } = useAppData();
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [values, setValues] = useState({ enginePressure: 40, engineTemp: 600, vibrationLevel: 2.0, hydraulicPressure: 3000 });
  const [fuelFlow, setFuelFlow] = useState("Normal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: Status; issues: string[]; causes: string[]; recommendations: string[]; sources: string[] } | null>(null);

  const runCheck = () => {
    if (!selectedAircraft) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const issues: string[] = [], causes: string[] = [], recommendations: string[] = [];
      const { enginePressure, engineTemp, vibrationLevel, hydraulicPressure } = values;
      if (enginePressure > safeThresholds.enginePressure.max) { issues.push("Engine pressure above safe threshold"); causes.push("Possible fuel pump malfunction"); recommendations.push("Check pressure regulator"); }
      if (enginePressure < safeThresholds.enginePressure.min) { issues.push("Engine pressure below safe threshold"); causes.push("Fuel supply issue"); recommendations.push("Inspect fuel lines"); }
      if (engineTemp > safeThresholds.engineTemp.max) { issues.push("Engine temperature exceeds limit"); causes.push("Cooling system degradation"); recommendations.push("Inspect cooling system"); }
      if (vibrationLevel > safeThresholds.vibrationLevel.max) { issues.push("Vibration level elevated"); causes.push("Turbine blade misalignment"); recommendations.push("Inspect turbine blades"); }
      if (hydraulicPressure < safeThresholds.hydraulicPressure.min) { issues.push("Hydraulic pressure low"); causes.push("Hydraulic leak suspected"); recommendations.push("Replace hydraulic seals"); }
      if (fuelFlow !== "Normal") { issues.push("Irregular fuel flow detected"); causes.push("Fuel injector blockage"); recommendations.push("Fuel system diagnostic"); }

      let status: Status = "green";
      if (issues.length >= 3) status = "red";
      else if (issues.length >= 1) status = "yellow";
      if (issues.length === 0) recommendations.push("Continue routine maintenance schedule");

      const ac = aircraft.find(a => a.id === selectedAircraft);
      addReport({ aircraftId: selectedAircraft, aircraftModel: ac?.model || "", enginePressure, engineTemp, vibrationLevel, hydraulicPressure, fuelFlow, status, issues, causes, recommendations });
      setResult({ status, issues, causes, recommendations, sources: ["engine_manual_737.pdf — Section 7.3", "failure_log_2023.xlsx — Fault Analysis", "hydraulic_system_spec.pdf — Ch. 4"] });
      setLoading(false);
    }, 2500);
  };

  const statusConfig = {
    green: { label: "SAFE", icon: ShieldCheck, color: "text-success", bg: "bg-success/10 border-success/30", glow: "shadow-[0_0_30px_hsl(160_70%_45%/0.2)]" },
    yellow: { label: "WARNING", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10 border-warning/30", glow: "shadow-[0_0_30px_hsl(42_95%_55%/0.2)]" },
    red: { label: "CRITICAL", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30", glow: "shadow-[0_0_30px_hsl(0_72%_55%/0.2)]" },
  };

  const InputField = ({ label, unit, value, field }: { label: string; unit: string; value: number; field: string }) => (
    <div>
      <Label className="font-heading text-xs text-muted-foreground">{label} ({unit})</Label>
      <Input type="number" step={field === "vibrationLevel" ? "0.1" : "1"} value={value} onChange={e => setValues(p => ({ ...p, [field]: +e.target.value }))} className="bg-secondary/30 border-border/50 mt-1 rounded-lg font-display text-sm" />
    </div>
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Pre-Flight Health Check</h1>
          <p className="text-muted-foreground font-heading mt-1">Run AI-assisted aircraft diagnostics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="premium-card">
            <CardHeader><CardTitle className="font-heading text-lg flex items-center gap-2"><Radar className="h-4 w-4 text-primary" />Inspection Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-heading text-sm">Aircraft</Label>
                <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                  <SelectTrigger className="bg-secondary/30 border-border/50 mt-1 rounded-lg"><SelectValue placeholder="Select aircraft" /></SelectTrigger>
                  <SelectContent className="glass-strong border-border/50 rounded-xl">{aircraft.map(ac => <SelectItem key={ac.id} value={ac.id}>{ac.model}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Engine Pressure" unit={safeThresholds.enginePressure.unit} value={values.enginePressure} field="enginePressure" />
                <InputField label="Engine Temp" unit={safeThresholds.engineTemp.unit} value={values.engineTemp} field="engineTemp" />
                <InputField label="Vibration" unit={safeThresholds.vibrationLevel.unit} value={values.vibrationLevel} field="vibrationLevel" />
                <InputField label="Hydraulic" unit={safeThresholds.hydraulicPressure.unit} value={values.hydraulicPressure} field="hydraulicPressure" />
              </div>
              <div>
                <Label className="font-heading text-sm">Fuel Flow Status</Label>
                <Select value={fuelFlow} onValueChange={setFuelFlow}>
                  <SelectTrigger className="bg-secondary/30 border-border/50 mt-1 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-strong border-border/50 rounded-xl">
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Irregular">Irregular</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={runCheck} disabled={loading || !selectedAircraft} className="w-full gradient-primary text-primary-foreground glow-primary font-heading text-base h-12 rounded-xl hover:opacity-90 transition-all duration-300">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Analyzing...</> : "Run Aircraft Health Check"}
              </Button>
            </CardContent>
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                    <Loader2 className="h-10 w-10 text-primary-foreground animate-spin" />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-primary animate-pulse-glow">Running RAG Analysis...</p>
                    <p className="text-sm text-muted-foreground mt-1 font-heading">Comparing with maintenance database</p>
                  </div>
                </div>
              </motion.div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <div className={`premium-card border ${statusConfig[result.status].bg} ${statusConfig[result.status].glow}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {(() => { const Icon = statusConfig[result.status].icon; return <div className={`p-3 rounded-xl ${statusConfig[result.status].bg}`}><Icon className={`h-7 w-7 ${statusConfig[result.status].color}`} /></div>; })()}
                      <div>
                        <p className="text-sm text-muted-foreground font-heading">Aircraft Status</p>
                        <p className={`text-2xl font-display font-bold ${statusConfig[result.status].color}`}>{statusConfig[result.status].label}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.issues.length > 0 && (
                      <div><p className="text-sm font-heading font-semibold text-foreground mb-2">Detected Issues</p>{result.issues.map((iss, i) => <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 text-sm text-muted-foreground py-0.5"><span className={`h-1.5 w-1.5 rounded-full ${statusConfig[result.status].color} bg-current`} />{iss}</motion.div>)}</div>
                    )}
                    {result.causes.length > 0 && (
                      <div><p className="text-sm font-heading font-semibold text-foreground mb-2">Possible Causes</p>{result.causes.map((c, i) => <p key={i} className="text-sm text-muted-foreground py-0.5">• {c}</p>)}</div>
                    )}
                    <div><p className="text-sm font-heading font-semibold text-foreground mb-2">Recommended Actions</p>{result.recommendations.map((r, i) => <p key={i} className="text-sm text-muted-foreground py-0.5">• {r}</p>)}</div>
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground font-heading mb-2">RAG Sources</p>
                      {result.sources.map((s, i) => <div key={i} className="flex items-center gap-1.5 text-xs text-primary py-0.5"><FileText className="h-3 w-3" />{s}</div>)}
                    </div>
                  </CardContent>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PreFlightPage;
