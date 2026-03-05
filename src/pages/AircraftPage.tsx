import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppData } from "@/contexts/AppContext";
import { Plus, Plane, Calendar, Gauge, Clock, ChevronRight } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

const AircraftPage = () => {
  const { aircraft, addAircraft, documents } = useAppData();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ model: "", manufacturer: "", engineType: "", year: 2024 });

  const handleAdd = () => {
    if (!form.model || !form.manufacturer) return;
    addAircraft(form);
    setForm({ model: "", manufacturer: "", engineType: "", year: 2024 });
    setOpen(false);
  };

  const selected = aircraft.find(a => a.id === selectedId);
  const statusColor: Record<string, string> = { operational: "bg-success/15 text-success border-success/20", maintenance: "bg-warning/15 text-warning border-warning/20", grounded: "bg-destructive/15 text-destructive border-destructive/20" };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Aircraft Management</h1>
            <p className="text-muted-foreground font-heading mt-1">Manage your fleet</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground glow-primary font-heading hover:opacity-90 transition-all duration-300 hover:scale-[1.02]">
                <Plus className="h-4 w-4 mr-2" />Add Aircraft
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border/50 rounded-2xl">
              <DialogHeader><DialogTitle className="font-heading text-xl gradient-text">Add New Aircraft</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label className="font-heading text-sm">Aircraft Model</Label><Input value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Boeing 787" className="bg-secondary/30 border-border/50 mt-1.5 rounded-lg" /></div>
                <div><Label className="font-heading text-sm">Manufacturer</Label><Input value={form.manufacturer} onChange={e => setForm(p => ({ ...p, manufacturer: e.target.value }))} placeholder="e.g. Boeing" className="bg-secondary/30 border-border/50 mt-1.5 rounded-lg" /></div>
                <div><Label className="font-heading text-sm">Engine Type</Label><Input value={form.engineType} onChange={e => setForm(p => ({ ...p, engineType: e.target.value }))} placeholder="e.g. GEnx-1B" className="bg-secondary/30 border-border/50 mt-1.5 rounded-lg" /></div>
                <div><Label className="font-heading text-sm">Year</Label><Input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) }))} className="bg-secondary/30 border-border/50 mt-1.5 rounded-lg" /></div>
                <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground glow-primary font-heading rounded-lg">Add Aircraft</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aircraft.map((ac) => (
            <motion.div key={ac.id} variants={item}>
              <div
                className="premium-card cursor-pointer group"
                onClick={() => setSelectedId(selectedId === ac.id ? null : ac.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="font-heading text-lg">{ac.model}</CardTitle>
                  <Badge className={`${statusColor[ac.status]} border text-xs font-display`}>{ac.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5"><Plane className="h-4 w-4 text-primary" /><span className="font-heading">{ac.manufacturer}</span></div>
                  <div className="flex items-center gap-2.5"><Gauge className="h-4 w-4 text-accent" /><span className="font-heading">{ac.engineType}</span></div>
                  <div className="flex items-center gap-2.5"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="font-heading">Year: {ac.year}</span></div>
                  <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-muted-foreground" /><span className="font-heading">{ac.totalFlightHours.toLocaleString()} hrs</span></div>
                  <div className="flex justify-end pt-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <div className="premium-card glow-primary-sm p-6">
                <h3 className="font-heading text-xl font-bold gradient-text mb-4">{selected.model} — Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div><span className="text-muted-foreground text-xs font-heading">Manufacturer</span><p className="font-heading font-semibold mt-1">{selected.manufacturer}</p></div>
                  <div><span className="text-muted-foreground text-xs font-heading">Engine</span><p className="font-heading font-semibold mt-1">{selected.engineType}</p></div>
                  <div><span className="text-muted-foreground text-xs font-heading">Last Inspection</span><p className="font-heading font-semibold mt-1">{selected.lastInspection}</p></div>
                  <div><span className="text-muted-foreground text-xs font-heading">Flight Hours</span><p className="font-heading font-semibold mt-1">{selected.totalFlightHours.toLocaleString()}</p></div>
                  <div className="col-span-full">
                    <span className="text-muted-foreground text-xs font-heading">Associated Documents</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {documents.filter(d => d.aircraftId === selected.id).map(d => (
                        <Badge key={d.id} className="bg-primary/10 text-primary border border-primary/20 font-heading">{d.fileName}</Badge>
                      ))}
                      {documents.filter(d => d.aircraftId === selected.id).length === 0 && <p className="text-xs text-muted-foreground">No documents uploaded</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default AircraftPage;
