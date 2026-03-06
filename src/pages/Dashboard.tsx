import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Plane, Activity, Fuel, Thermometer, AlertTriangle,
  TrendingUp, Shield, ChevronUp, ChevronDown, ArrowUpRight,
  Gauge, Radio,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useAircraftTelemetry,
  type AircraftTelemetry,
  type MaintenanceStatus,
} from "@/hooks/useAircraftTelemetry";
import { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────
   Animation variants
   ────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

/* ──────────────────────────────────
   Animated counter
   ────────────────────────────────── */
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (Math.abs(diff) < 0.01) { setDisplay(value); prev.current = value; return; }
    const dur = 600;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(+(start + diff * ease).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = value;
    };
    requestAnimationFrame(tick);
  }, [value, decimals]);

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</>;
}

/* ──────────────────────────────────
   Status helpers
   ────────────────────────────────── */
function statusColor(s: MaintenanceStatus) {
  return s === "healthy" ? "#00c853" : s === "check_required" ? "#ffab00" : "#ff1744";
}
function statusLabel(s: MaintenanceStatus) {
  return s === "healthy" ? "Healthy" : s === "check_required" ? "Check Required" : "Urgent";
}
function tempStatus(t: number) {
  return t < 85 ? "safe" : t <= 100 ? "warning" : "critical";
}
function fuelStatus(f: number) {
  return f > 40 ? "safe" : f >= 20 ? "warning" : "critical";
}
function riskColor(level: "safe" | "warning" | "critical") {
  return level === "safe" ? "#00c853" : level === "warning" ? "#ffab00" : "#ff1744";
}

/* ──────────────────────────────────
   Gauge Component (SVG)
   ────────────────────────────────── */
function EngineGauge({ temp, label }: { temp: number; label: string }) {
  const max = 120;
  const pct = Math.min(temp / max, 1);
  const angle = -135 + pct * 270;
  const status = tempStatus(temp);
  const color = riskColor(status);

  const r = 40;
  const cx = 50, cy = 52;
  const startAngle = -135 * (Math.PI / 180);
  const endAngle = angle * (Math.PI / 180);

  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleX = cx + (r - 8) * Math.cos(endAngle);
  const needleY = cy + (r - 8) * Math.sin(endAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 75" className="w-full max-w-[120px]">
        {/* Track */}
        <path
          d={arcPath(-135 * (Math.PI / 180), 135 * (Math.PI / 180))}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ transition: "all 0.6s ease" }}
        />
        {/* Needle dot */}
        <circle cx={needleX} cy={needleY} r="3" fill={color} style={{ transition: "all 0.6s ease" }}>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Value text */}
        <text x={cx} y={cy + 2} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">
          {Math.round(temp)}°
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="currentColor" fontSize="5" opacity="0.5" fontFamily="Space Grotesk">
          {status.toUpperCase()}
        </text>
      </svg>
      <span className="text-xs text-muted-foreground font-heading mt-1 truncate max-w-full">{label}</span>
    </div>
  );
}

/* ──────────────────────────────────
   Fuel Bar
   ────────────────────────────────── */
function FuelBar({ craft }: { craft: AircraftTelemetry }) {
  const status = fuelStatus(craft.fuel_level);
  const color = riskColor(status);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-heading text-foreground/80 truncate max-w-[60%]">{craft.model}</span>
        <span className="text-xs font-display font-bold" style={{ color }}>{craft.fuel_level.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${craft.fuel_level}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────
   Maintenance Alert Card
   ────────────────────────────────── */
function AlertCard({ craft }: { craft: AircraftTelemetry }) {
  const color = statusColor(craft.maintenance_status);
  const reasons: string[] = [];
  if (craft.engine_temperature > 100) reasons.push("Engine temp critical");
  else if (craft.engine_temperature > 85) reasons.push("Engine temp elevated");
  if (craft.fuel_level < 20) reasons.push("Fuel critically low");
  else if (craft.fuel_level < 40) reasons.push("Fuel below threshold");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
      style={{ borderColor: `${color}33`, background: `${color}08` }}
    >
      <div className="mt-0.5 p-1.5 rounded-lg" style={{ background: `${color}20` }}>
        <AlertTriangle className="h-4 w-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-semibold text-foreground truncate">{craft.aircraft_id}</span>
          <span
            className="text-[10px] font-display px-2 py-0.5 rounded-full font-bold"
            style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
          >
            {statusLabel(craft.maintenance_status)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-heading mt-0.5">{craft.model}</p>
        {reasons.length > 0 && (
          <ul className="mt-1.5 space-y-0.5">
            {reasons.map((r) => (
              <li key={r} className="text-[11px] font-heading" style={{ color }}> • {r}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────
   Live pulse dot
   ────────────────────────────────── */
function LivePulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
}

/* ══════════════════════════════════
   DASHBOARD
   ══════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { fleet, activity, lastUpdated, stats } = useAircraftTelemetry(3000);

  const [sortBy, setSortBy] = useState<"risk" | "fuel" | "temp">("risk");
  const [filterType, setFilterType] = useState<string>("all");

  // Filtered + sorted fleet
  const displayed = fleet
    .filter((c) => filterType === "all" || c.aircraft_type === filterType)
    .sort((a, b) => {
      if (sortBy === "risk") {
        const order: Record<MaintenanceStatus, number> = { urgent: 0, check_required: 1, healthy: 2 };
        return order[a.maintenance_status] - order[b.maintenance_status];
      }
      if (sortBy === "fuel") return a.fuel_level - b.fuel_level;
      return b.engine_temperature - a.engine_temperature;
    });

  const alertCraft = displayed.filter((c) => c.maintenance_status !== "healthy");

  // Chart colors
  const chartColors = {
    grid: isDark ? "hsl(220 12% 16%)" : "hsl(40 15% 88%)",
    text: isDark ? "hsl(220 8% 50%)" : "hsl(220 10% 45%)",
    tooltip: {
      bg: isDark ? "hsl(220 14% 11%)" : "hsl(0 0% 100%)",
      border: isDark ? "hsl(220 12% 22%)" : "hsl(40 15% 85%)",
      text: isDark ? "hsl(40 10% 90%)" : "hsl(220 25% 15%)",
    },
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Welcome back, <span className="gradient-text-rainbow">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground font-heading mt-1 text-sm">Aviation Control Center — Fleet Monitoring</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 text-xs font-heading text-muted-foreground"
          >
            <LivePulse />
            <span>Live — {lastUpdated.toLocaleTimeString()}</span>
          </motion.div>
        </div>

        {/* ── Stat Cards Row ── */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Aircraft */}
          <motion.div variants={fadeUp}>
            <div className="premium-card p-5 hover-lift group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-heading text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />{stats.airborne} in air
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-heading mb-0.5">Active Fleet</p>
              <p className="text-3xl font-display font-bold text-foreground">
                <AnimatedNumber value={stats.total} />
              </p>
            </div>
          </motion.div>

          {/* Avg Engine Temp */}
          <motion.div variants={fadeUp}>
            <div className="premium-card p-5 hover-lift group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20">
                  <Thermometer className="h-4 w-4 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-heading" style={{ color: riskColor(tempStatus(stats.avgTemp)) }}>
                  {stats.avgTemp < 85 ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                  {tempStatus(stats.avgTemp)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-heading mb-0.5">Avg Engine Temp</p>
              <p className="text-3xl font-display font-bold text-foreground">
                <AnimatedNumber value={stats.avgTemp} decimals={1} />°
              </p>
            </div>
          </motion.div>

          {/* Avg Fuel */}
          <motion.div variants={fadeUp}>
            <div className="premium-card p-5 hover-lift group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <Fuel className="h-4 w-4 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-heading" style={{ color: riskColor(fuelStatus(stats.avgFuel)) }}>
                  {fuelStatus(stats.avgFuel)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-heading mb-0.5">Avg Fuel Level</p>
              <p className="text-3xl font-display font-bold text-foreground">
                <AnimatedNumber value={stats.avgFuel} decimals={1} />%
              </p>
            </div>
          </motion.div>

          {/* Health Distribution */}
          <motion.div variants={fadeUp}>
            <div className="premium-card p-5 hover-lift group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-heading mb-2">Fleet Health</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-display font-bold" style={{ color: "#00c853" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#00c853" }} />{stats.healthyCnt}
                </span>
                <span className="flex items-center gap-1 text-xs font-display font-bold" style={{ color: "#ffab00" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#ffab00" }} />{stats.warningCnt}
                </span>
                <span className="flex items-center gap-1 text-xs font-display font-bold" style={{ color: "#ff1744" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#ff1744" }} />{stats.criticalCnt}
                </span>
              </div>
              {/* Mini bar */}
              <div className="flex h-1.5 rounded-full overflow-hidden mt-2 gap-0.5">
                <div className="rounded-full" style={{ width: `${(stats.healthyCnt / stats.total) * 100}%`, background: "#00c853" }} />
                <div className="rounded-full" style={{ width: `${(stats.warningCnt / stats.total) * 100}%`, background: "#ffab00" }} />
                <div className="rounded-full" style={{ width: `${(stats.criticalCnt / stats.total) * 100}%`, background: "#ff1744" }} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Filter controls ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-heading mr-1">Filter:</span>
          {["all", "commercial", "cargo", "private"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-xs font-heading transition-all duration-300 border ${filterType === t
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
            >
              {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <span className="text-xs text-muted-foreground font-heading ml-4 mr-1">Sort:</span>
          {(["risk", "fuel", "temp"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded-full text-xs font-heading transition-all duration-300 border ${sortBy === s
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
            >
              {s === "risk" ? "Risk Level" : s === "fuel" ? "Fuel Low→High" : "Temp High→Low"}
            </button>
          ))}
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Engine Health Gauges — 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <div className="premium-card hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-orange-400" />Engine Health Monitor
                  <LivePulse />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {displayed.map((craft) => (
                    <EngineGauge key={craft.aircraft_id} temp={craft.engine_temperature} label={craft.aircraft_id} />
                  ))}
                </div>
              </CardContent>
            </div>
          </motion.div>

          {/* Maintenance Alerts — 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="premium-card hover-lift h-full">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />Maintenance Alerts
                  <span className="ml-auto text-xs font-display px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    {alertCraft.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[280px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {alertCraft.length === 0 ? (
                    <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground font-heading text-center py-6">
                      ✅ All aircraft healthy
                    </motion.p>
                  ) : (
                    alertCraft.map((craft) => <AlertCard key={craft.aircraft_id} craft={craft} />)
                  )}
                </AnimatePresence>
              </CardContent>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Fuel Monitor */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="premium-card hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-emerald-400" />Fuel Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayed.map((craft) => (
                  <FuelBar key={craft.aircraft_id} craft={craft} />
                ))}
              </CardContent>
            </div>
          </motion.div>

          {/* Flight Activity Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="premium-card hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <Radio className="h-4 w-4 text-cyan-400" />Flight Activity
                  <LivePulse />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={activity}>
                    <defs>
                      <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff1744" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#ff1744" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: chartColors.text, fontSize: 11, fontFamily: "Space Grotesk" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartColors.text, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: chartColors.tooltip.bg,
                        border: `1px solid ${chartColors.tooltip.border}`,
                        borderRadius: 12,
                        color: chartColors.tooltip.text,
                        fontFamily: "Space Grotesk",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stroke="#00e5ff"
                      strokeWidth={2}
                      fill="url(#activeGrad)"
                      dot={false}
                      animationDuration={800}
                      name="Active"
                    />
                    <Area
                      type="monotone"
                      dataKey="alerts"
                      stroke="#ff1744"
                      strokeWidth={2}
                      fill="url(#alertGrad)"
                      dot={false}
                      animationDuration={800}
                      name="Alerts"
                    />
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
