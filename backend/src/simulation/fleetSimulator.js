// Smooth geospatial interpolation and telemetry simulation engine

import { INITIAL_VEHICLES, GEOFENCES } from "../data/mockData.js";

function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

function interpolatePoint(p1, p2, fraction) {
  return {
    lat: p1.lat + (p2.lat - p1.lat) * fraction,
    lng: p1.lng + (p2.lng - p1.lng) * fraction
  };
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class FleetSimulationEngine {
  constructor() {
    this.vehicles = JSON.parse(JSON.stringify(INITIAL_VEHICLES));
    this.geofences = GEOFENCES;
    this.historyBreadcrumbs = new Map(); // vehicleId -> array of recent [lat, lng]
    this.listeners = [];

    // Initialize initial positions and breadcrumbs
    this.vehicles.forEach((v) => {
      const p1 = v.routeWaypoints[v.routeIndex];
      const p2 = v.routeWaypoints[(v.routeIndex + 1) % v.routeWaypoints.length];
      const pos = interpolatePoint(p1, p2, v.routeProgress);
      v.latitude = pos.lat;
      v.longitude = pos.lng;
      v.heading = Math.round(calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng));
      this.historyBreadcrumbs.set(v.id, [{ lat: pos.lat, lng: pos.lng }]);
    });
  }

  onTelemetryUpdate(cb) {
    this.listeners.push(cb);
  }

  start(intervalMs = 1000) {
    this.timer = setInterval(() => {
      this.step();
    }, intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  step() {
    const timestamp = new Date().toISOString();
    const updates = [];
    const triggeredAlerts = [];

    this.vehicles.forEach((v) => {
      if (v.status === "STOPPED") return;

      if (v.status === "IDLE") {
        // Vehicle is temporarily idle (e.g., unloading)
        v.diagnostics.idleDurationMinutes = (v.diagnostics.idleDurationMinutes || 0) + 0.05;
        // 5% chance to resume moving
        if (Math.random() < 0.08) {
          v.status = "MOVING";
          v.speedKmh = 35;
        }
        return;
      }

      // Progress along route
      const wp = v.routeWaypoints;
      const nextIndex = (v.routeIndex + 1) % wp.length;
      const p1 = wp[v.routeIndex];
      const p2 = wp[nextIndex];

      // Speed step: step progression based on speed
      const speedKmPerSec = (v.speedKmh || 60) / 3600;
      const legDistanceKm = calculateDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng) || 1.0;
      const stepFraction = (speedKmPerSec * 1.5) / legDistanceKm;

      v.routeProgress += stepFraction;

      if (v.routeProgress >= 1.0) {
        v.routeProgress = 0.0;
        v.routeIndex = nextIndex;
      }

      const currentP1 = wp[v.routeIndex];
      const currentP2 = wp[(v.routeIndex + 1) % wp.length];
      const newPos = interpolatePoint(currentP1, currentP2, v.routeProgress);

      v.latitude = Number(newPos.lat.toFixed(6));
      v.longitude = Number(newPos.lng.toFixed(6));
      v.heading = Math.round(calculateBearing(currentP1.lat, currentP1.lng, currentP2.lat, currentP2.lng));

      // Realistic speed fluctuation (+/- 2 km/h)
      v.speedKmh = Math.max(20, Math.min(105, Math.round(v.speedKmh + (Math.random() * 4 - 2))));

      // Battery or Fuel consumption
      if (v.powertrain === "EV") {
        v.batteryPct = Math.max(5, Number((v.batteryPct - 0.01).toFixed(2)));
      } else {
        v.fuelLevelPct = Math.max(5, Number((v.fuelLevelPct - 0.01).toFixed(2)));
      }
      v.odometerKm = Number((v.odometerKm + speedKmPerSec * 1.5).toFixed(2));

      // Keep recent breadcrumb trail (last 40 points)
      let trail = this.historyBreadcrumbs.get(v.id) || [];
      trail.push({ lat: v.latitude, lng: v.longitude });
      if (trail.length > 40) trail.shift();
      this.historyBreadcrumbs.set(v.id, trail);

      // Check Geofence violations (e.g. speeding in downtown or port)
      this.geofences.forEach((geo) => {
        if (geo.type === "CIRCLE") {
          const dist = calculateDistanceKm(v.latitude, v.longitude, geo.center[0], geo.center[1]) * 1000;
          if (dist <= geo.radiusMeters && v.speedKmh > geo.speedLimitKmh + 10) {
            triggeredAlerts.push({
              id: `ALT-${Date.now()}-${v.id}`,
              vehicleId: v.id,
              driverName: v.driver.name,
              type: "GEOFENCE_SPEEDING",
              severity: "WARNING",
              message: `Vehicle ${v.id} exceeded geofence speed limit (${v.speedKmh} km/h in ${geo.speedLimitKmh} km/h zone: ${geo.name})`,
              timestamp,
              coords: [v.latitude, v.longitude]
            });
          }
        }
      });

      updates.push({
        id: v.id,
        latitude: v.latitude,
        longitude: v.longitude,
        heading: v.heading,
        speedKmh: v.speedKmh,
        status: v.status,
        fuelLevelPct: v.fuelLevelPct,
        batteryPct: v.batteryPct,
        odometerKm: v.odometerKm,
        diagnostics: v.diagnostics,
        trail: this.historyBreadcrumbs.get(v.id)
      });
    });

    const payload = {
      timestamp,
      vehicles: updates,
      alerts: triggeredAlerts
    };

    this.listeners.forEach((cb) => cb(payload));
  }

  getVehicleById(id) {
    const v = this.vehicles.find((veh) => veh.id === id);
    if (!v) return null;
    return {
      ...v,
      trail: this.historyBreadcrumbs.get(v.id) || []
    };
  }

  getAllVehicles() {
    return this.vehicles.map((v) => ({
      ...v,
      trail: this.historyBreadcrumbs.get(v.id) || []
    }));
  }

  getGeofences() {
    return this.geofences;
  }
}
