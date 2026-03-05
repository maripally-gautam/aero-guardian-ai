import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppData } from "@/contexts/AppContext";
import { Plus, Plane, Calendar, Gauge, Clock } from "lucide-react";

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
  const statusColor = { operational: "bg-success/20 text-success", maintenance: "bg-warning/20 text-warning", grounded: "bg-destructive/20 text-destructive" };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Aircraft Management</h1>
            <p className="text-muted-foreground font-heading">Manage your fleet</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="glow-cyan font-heading"><Plus className="h-4 w-4 mr-2" />Add Aircraft</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border">
              <DialogHeader><DialogTitle className="font-display text-primary">Add New Aircraft</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label className="font-heading">Aircraft Model</Label><Input value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Boeing 787" className="bg-muted/50 border-border" /></div>
                <div><Label className="font-heading">Manufacturer</Label><Input value={form.manufacturer} onChange={e => setForm(p => ({ ...p, manufacturer: e.target.value }))} placeholder="e.g. Boeing" className="bg-muted/50 border-border" /></div>
                <div><Label className="font-heading">Engine Type</Label><Input value={form.engineType} onChange={e => setForm(p => ({ ...p, engineType: e.target.value }))} placeholder="e.g. GEnx-1B" className="bg-muted/50 border-border" /></div>
                <div><Label className="font-heading">Year</Label><Input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) }))} className="bg-muted/50 border-border" /></div>
                <Button onClick={handleAdd} className="w-full glow-cyan font-heading">Add Aircraft</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aircraft.map((ac, i) => (
            <motion.div key={ac.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                className="glass border-border hover:glow-cyan-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedId(selectedId === ac.id ? null : ac.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="font-heading text-lg">{ac.model}</CardTitle>
                  <Badge className={statusColor[ac.status]}>{ac.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Plane className="h-4 w-4 text-primary" />{ac.manufacturer}</div>
                  <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-primary" />{ac.engineType}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Year: {ac.year}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{ac.totalFlightHours.toLocaleString()} flight hours</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card className="glass border-primary/30 glow-cyan-sm">
                <CardHeader><CardTitle className="font-display text-primary">{selected.model} — Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Manufacturer</span><p className="font-heading font-semibold">{selected.manufacturer}</p></div>
                  <div><span className="text-muted-foreground">Engine</span><p className="font-heading font-semibold">{selected.engineType}</p></div>
                  <div><span className="text-muted-foreground">Last Inspection</span><p className="font-heading font-semibold">{selected.lastInspection}</p></div>
                  <div><span className="text-muted-foreground">Flight Hours</span><p className="font-heading font-semibold">{selected.totalFlightHours.toLocaleString()}</p></div>
                  <div className="col-span-full">
                    <span className="text-muted-foreground">Associated Documents</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {documents.filter(d => d.aircraftId === selected.id).map(d => (
                        <Badge key={d.id} variant="secondary" className="font-heading">{d.fileName}</Badge>
                      ))}
                      {documents.filter(d => d.aircraftId === selected.id).length === 0 && <p className="text-xs text-muted-foreground">No documents uploaded</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default AircraftPage;
