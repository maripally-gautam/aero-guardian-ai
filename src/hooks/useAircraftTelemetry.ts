import { useState, useEffect, useRef, useCallback } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */
export type MaintenanceStatus = "healthy" | "check_required" | "urgent";
export type AircraftType = "commercial" | "cargo" | "private";

export interface AircraftTelemetry {
    aircraft_id: string;
    aircraft_type: AircraftType;
    model: string;
    altitude: number;       // feet
    speed: number;          // knots
    engine_temperature: number; // °C percentage (0–120+)
    fuel_level: number;     // percentage
    maintenance_status: MaintenanceStatus;
    flight_hours: number;
    location_lat: number;
    location_long: number;
    heading: number;        // degrees
    is_airborne: boolean;
}

/* ──────────────────────────────────────────────
   Seeds — initial aircraft fleet
   ────────────────────────────────────────────── */
const FLEET_SEED: AircraftTelemetry[] = [
    {
        aircraft_id: "AG-001",
        aircraft_type: "commercial",
        model: "Boeing 737-800",
        altitude: 35000,
        speed: 460,
        engine_temperature: 72,
        fuel_level: 68,
        maintenance_status: "healthy",
        flight_hours: 12450,
        location_lat: 28.6139,
        location_long: 77.209,
        heading: 45,
        is_airborne: true,
    },
    {
        aircraft_id: "AG-002",
        aircraft_type: "commercial",
        model: "Airbus A320neo",
        altitude: 38000,
        speed: 480,
        engine_temperature: 88,
        fuel_level: 42,
        maintenance_status: "check_required",
        flight_hours: 5820,
        location_lat: 19.076,
        location_long: 72.8777,
        heading: 120,
        is_airborne: true,
    },
    {
        aircraft_id: "AG-003",
        aircraft_type: "cargo",
        model: "ATR 72-600",
        altitude: 0,
        speed: 0,
        engine_temperature: 105,
        fuel_level: 15,
        maintenance_status: "urgent",
        flight_hours: 8930,
        location_lat: 13.0827,
        location_long: 80.2707,
        heading: 0,
        is_airborne: false,
    },
    {
        aircraft_id: "AG-004",
        aircraft_type: "private",
        model: "Cessna Citation X",
        altitude: 41000,
        speed: 520,
        engine_temperature: 65,
        fuel_level: 82,
        maintenance_status: "healthy",
        flight_hours: 3200,
        location_lat: 12.9716,
        location_long: 77.5946,
        heading: 270,
        is_airborne: true,
    },
    {
        aircraft_id: "AG-005",
        aircraft_type: "commercial",
        model: "Boeing 777-300ER",
        altitude: 37000,
        speed: 490,
        engine_temperature: 79,
        fuel_level: 55,
        maintenance_status: "healthy",
        flight_hours: 18700,
        location_lat: 25.2532,
        location_long: 55.3657,
        heading: 190,
        is_airborne: true,
    },
    {
        aircraft_id: "AG-006",
        aircraft_type: "cargo",
        model: "Airbus A330F",
        altitude: 33000,
        speed: 450,
        engine_temperature: 91,
        fuel_level: 33,
        maintenance_status: "check_required",
        flight_hours: 9400,
        location_lat: 1.3521,
        location_long: 103.8198,
        heading: 310,
        is_airborne: true,
    },
];

/* ──────────────────────────────────────────────
   Activity history seed
   ────────────────────────────────────────────── */
export interface ActivityPoint {
    time: string;
    active: number;
    alerts: number;
}

const HOURS = [
    "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
    "12:00", "14:00", "16:00", "18:00", "20:00", "22:00",
];

function seedActivity(): ActivityPoint[] {
    return HOURS.map((time) => ({
        time,
        active: 2 + Math.floor(Math.random() * 4),
        alerts: Math.floor(Math.random() * 3),
    }));
}

/* ──────────────────────────────────────────────
   Simulate live telemetry changes
   ────────────────────────────────────────────── */
function jitter(val: number, range: number, min = 0, max = Infinity): number {
    return Math.max(min, Math.min(max, val + (Math.random() - 0.5) * range));
}

function simulateUpdate(craft: AircraftTelemetry): AircraftTelemetry {
    const updated = { ...craft };

    if (updated.is_airborne) {
        updated.altitude = Math.round(jitter(updated.altitude, 600, 25000, 43000));
        updated.speed = Math.round(jitter(updated.speed, 20, 380, 560));
        updated.fuel_level = Math.max(5, +(updated.fuel_level - Math.random() * 0.4).toFixed(1));
        updated.heading = (updated.heading + (Math.random() - 0.5) * 6 + 360) % 360;
        updated.location_lat = +(updated.location_lat + (Math.random() - 0.5) * 0.02).toFixed(4);
        updated.location_long = +(updated.location_long + (Math.random() - 0.5) * 0.02).toFixed(4);
    }

    updated.engine_temperature = +jitter(updated.engine_temperature, 3, 55, 120).toFixed(1);
    updated.flight_hours = +(updated.flight_hours + 0.01).toFixed(2);

    // Update maintenance status based on engine temp and fuel
    if (updated.engine_temperature > 100 || updated.fuel_level < 20) {
        updated.maintenance_status = "urgent";
    } else if (updated.engine_temperature > 85 || updated.fuel_level < 40) {
        updated.maintenance_status = "check_required";
    } else {
        updated.maintenance_status = "healthy";
    }

    return updated;
}

/* ──────────────────────────────────────────────
   Hook
   ────────────────────────────────────────────── */
export function useAircraftTelemetry(refreshInterval = 3000) {
    const [fleet, setFleet] = useState<AircraftTelemetry[]>(FLEET_SEED);
    const [activity, setActivity] = useState<ActivityPoint[]>(seedActivity);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const intervalRef = useRef<ReturnType<typeof setInterval>>();

    const update = useCallback(() => {
        setFleet((prev) => prev.map(simulateUpdate));
        setLastUpdated(new Date());

        // Occasionally push a new activity point
        setActivity((prev) => {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
            const newPoint: ActivityPoint = {
                time: timeStr,
                active: 3 + Math.floor(Math.random() * 3),
                alerts: Math.floor(Math.random() * 3),
            };
            const next = [...prev, newPoint];
            return next.length > 16 ? next.slice(next.length - 16) : next;
        });
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(update, refreshInterval);
        return () => clearInterval(intervalRef.current);
    }, [update, refreshInterval]);

    // Derived stats
    const airborne = fleet.filter((c) => c.is_airborne).length;
    const healthyCnt = fleet.filter((c) => c.maintenance_status === "healthy").length;
    const warningCnt = fleet.filter((c) => c.maintenance_status === "check_required").length;
    const criticalCnt = fleet.filter((c) => c.maintenance_status === "urgent").length;
    const avgFuel = +(fleet.reduce((s, c) => s + c.fuel_level, 0) / fleet.length).toFixed(1);
    const avgTemp = +(fleet.reduce((s, c) => s + c.engine_temperature, 0) / fleet.length).toFixed(1);

    return {
        fleet,
        activity,
        lastUpdated,
        stats: { total: fleet.length, airborne, healthyCnt, warningCnt, criticalCnt, avgFuel, avgTemp },
    };
}
