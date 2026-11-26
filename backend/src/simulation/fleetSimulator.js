// Smooth geospatial interpolation, telemetry simulation, trips, and maintenance engine

import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_TRIPS, INITIAL_MAINTENANCE, GEOFENCES } from "../data/mockData.js";

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
    this.drivers = JSON.parse(JSON.stringify(INITIAL_DRIVERS));
    this.trips = JSON.parse(JSON.stringify(INITIAL_TRIPS));
    this.maintenanceRecords = JSON.parse(JSON.stringify(INITIAL_MAINTENANCE));
    this.geofences = GEOFENCES;
    this.historyBreadcrumbs = new Map();
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
      if (v.status === "STOPPED" || v.status === "IN_MAINTENANCE") return;

      if (v.status === "IDLE") {
        v.diagnostics.idleDurationMinutes = (v.diagnostics.idleDurationMinutes || 0) + 0.05;
        if (Math.random() < 0.08) {
          v.status = "MOVING";
          v.speedKmh = 35;
        }
        return;
      }

      const wp = v.routeWaypoints;
      const nextIndex = (v.routeIndex + 1) % wp.length;
      const p1 = wp[v.routeIndex];
      const p2 = wp[nextIndex];

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

      v.speedKmh = Math.max(20, Math.min(105, Math.round(v.speedKmh + (Math.random() * 4 - 2))));

      // Battery / Fuel draw
      if (v.powertrain === "EV") {
        v.batteryPct = Math.max(5, Number((v.batteryPct - 0.01).toFixed(2)));
      } else {
        v.fuelLevelPct = Math.max(5, Number((v.fuelLevelPct - 0.01).toFixed(2)));
      }
      v.odometerKm = Number((v.odometerKm + speedKmPerSec * 1.5).toFixed(2));

      // Breadcrumb trail
      let trail = this.historyBreadcrumbs.get(v.id) || [];
      trail.push({ lat: v.latitude, lng: v.longitude });
      if (trail.length > 40) trail.shift();
      this.historyBreadcrumbs.set(v.id, trail);

      // Overspeed & Geofence checks
      if (v.speedKmh > 90) {
        triggeredAlerts.push({
          id: `ALT-SPD-${Date.now()}-${v.id}`,
          vehicleId: v.id,
          driverName: v.driver?.name || "Unassigned",
          type: "OVERSPEED",
          severity: "WARNING",
          message: `Vehicle ${v.id} exceeded highway speed threshold (${v.speedKmh} km/h recorded)`,
          timestamp,
          coords: [v.latitude, v.longitude]
        });
      }

      this.geofences.forEach((geo) => {
        if (geo.type === "CIRCLE") {
          const dist = calculateDistanceKm(v.latitude, v.longitude, geo.center[0], geo.center[1]) * 1000;
          if (dist <= geo.radiusMeters && v.speedKmh > geo.speedLimitKmh + 10) {
            triggeredAlerts.push({
              id: `ALT-GEO-${Date.now()}-${v.id}`,
              vehicleId: v.id,
              driverName: v.driver?.name || "Unassigned",
              type: "GEOFENCE_SPEEDING",
              severity: "CRITICAL",
              message: `Overspeed Violation: ${v.speedKmh} km/h in ${geo.speedLimitKmh} km/h zone (${geo.name})`,
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

  // --- VEHICLE OPERATIONS (MODULE 1) ---
  getAllVehicles() {
    return this.vehicles.map((v) => ({
      ...v,
      trail: this.historyBreadcrumbs.get(v.id) || []
    }));
  }

  getVehicleById(id) {
    const v = this.vehicles.find((veh) => veh.id === id);
    if (!v) return null;
    return {
      ...v,
      trail: this.historyBreadcrumbs.get(v.id) || []
    };
  }

  addVehicle(vehicleData) {
    const newId = `VEH-${100 + this.vehicles.length + 1}`;
    const newVehicle = {
      id: newId,
      vin: vehicleData.vin || `1FUJ${Date.now()}`,
      plate: vehicleData.plate || "CA-NEW-01",
      makeModel: vehicleData.makeModel || "Standard Fleet Cargo",
      type: vehicleData.type || "DELIVERY_VAN",
      powertrain: vehicleData.powertrain || "DIESEL",
      fuelLevelPct: vehicleData.powertrain === "EV" ? null : 100,
      batteryPct: vehicleData.powertrain === "EV" ? 100 : null,
      odometerKm: Number(vehicleData.odometerKm) || 1000,
      engineHours: 50,
      status: "IDLE",
      driverId: null,
      driver: {
        id: "UNASSIGNED",
        name: "Unassigned",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        licenseNumber: "N/A",
        phone: "N/A",
        safetyScore: 100,
        shiftStart: "N/A",
        hoursDrivenToday: 0
      },
      diagnostics: {
        engineRpm: 1200,
        oilPressurePsi: 45,
        coolantTempC: 85,
        tirePressurePsi: [45, 45, 45, 45],
        dtcCodes: [],
        brakeHealthPct: 100
      },
      routeWaypoints: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.7505, lng: -122.4042 },
        { lat: 37.7126, lng: -122.3999 }
      ],
      routeIndex: 0,
      routeProgress: 0.0,
      speedKmh: 0,
      heading: 0,
      latitude: 37.7749,
      longitude: -122.4194
    };

    this.vehicles.push(newVehicle);
    this.historyBreadcrumbs.set(newId, [{ lat: 37.7749, lng: -122.4194 }]);
    return newVehicle;
  }

  updateVehicle(id, updates) {
    const v = this.vehicles.find((item) => item.id === id);
    if (!v) return null;
    Object.assign(v, updates);
    return v;
  }

  // --- DRIVER OPERATIONS (MODULE 1) ---
  getAllDrivers() {
    return this.drivers;
  }

  addDriver(driverData) {
    const newId = `DRV-${String(this.drivers.length + 1).padStart(3, "0")}`;
    const newDriver = {
      id: newId,
      name: driverData.name,
      avatar: driverData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      licenseNumber: driverData.licenseNumber || `CDL-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: driverData.phone || "+1 (555) 010-0000",
      safetyScore: Number(driverData.safetyScore) || 95,
      shiftStart: driverData.shiftStart || "08:00 AM",
      hoursDrivenToday: 0.0,
      status: "AVAILABLE",
      assignedVehicleId: null
    };
    this.drivers.push(newDriver);
    return newDriver;
  }

  assignDriverToVehicle(vehicleId, driverId) {
    const vehicle = this.vehicles.find((v) => v.id === vehicleId);
    const driver = this.drivers.find((d) => d.id === driverId);

    if (!vehicle || !driver) return null;

    // Unassign previous assignments
    this.drivers.forEach((d) => {
      if (d.assignedVehicleId === vehicleId) d.assignedVehicleId = null;
    });

    vehicle.driverId = driver.id;
    vehicle.driver = driver;
    driver.assignedVehicleId = vehicle.id;
    driver.status = "ON_TRIP";

    return { vehicle, driver };
  }

  // --- TRIP OPERATIONS (MODULE 2) ---
  getAllTrips() {
    return this.trips;
  }

  addTrip(tripData) {
    const vehicle = this.vehicles.find((v) => v.id === tripData.vehicleId) || this.vehicles[0];
    const driver = this.drivers.find((d) => d.id === tripData.driverId) || vehicle.driver;

    const newTrip = {
      id: `TRIP-${800 + this.trips.length + 1}`,
      vehicleId: vehicle.id,
      driverId: driver.id,
      driverName: driver.name,
      vehicleModel: vehicle.makeModel,
      origin: tripData.origin || "Regional Depot",
      destination: tripData.destination || "Destination Hub",
      distanceKm: Number(tripData.distanceKm) || 45.0,
      etaTime: tripData.etaTime || "04:30 PM",
      status: tripData.status || "IN_TRANSIT",
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      progressPct: 10
    };

    this.trips.unshift(newTrip);
    return newTrip;
  }

  updateTripStatus(tripId, status) {
    const trip = this.trips.find((t) => t.id === tripId);
    if (!trip) return null;
    trip.status = status;
    if (status === "COMPLETED") trip.progressPct = 100;
    return trip;
  }

  // --- MAINTENANCE OPERATIONS (MODULE 3) ---
  getAllMaintenance() {
    return this.maintenanceRecords;
  }

  addMaintenanceRecord(record) {
    const vehicle = this.vehicles.find((v) => v.id === record.vehicleId);
    const newRecord = {
      id: `MNT-${500 + this.maintenanceRecords.length + 1}`,
      vehicleId: record.vehicleId,
      vehicleModel: vehicle ? vehicle.makeModel : "Fleet Vehicle",
      serviceType: record.serviceType || "ROUTINE_INSPECTION",
      serviceDate: record.serviceDate || new Date().toISOString().split("T")[0],
      costUsd: Number(record.costUsd) || 250.0,
      status: record.status || "DUE_SOON",
      technicianNotes: record.technicianNotes || "Scheduled maintenance checkpoint.",
      priority: record.priority || "MEDIUM"
    };

    this.maintenanceRecords.unshift(newRecord);
    return newRecord;
  }

  getGeofences() {
    return this.geofences;
  }
}
