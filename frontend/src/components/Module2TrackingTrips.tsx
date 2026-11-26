"use client";

import React, { useState } from "react";
import { Vehicle, Geofence, Trip, VisionEvent } from "../lib/types";
import { FleetMap } from "./FleetMap";
import { VisionAIDashcam } from "./VisionAIDashcam";
import { Navigation, Plus, MapPin, Clock, CheckCircle2, AlertTriangle, ArrowRight, Compass } from "lucide-react";

interface Module2Props {
  vehicles: Vehicle[];
  geofences: Geofence[];
  selectedVehicle: Vehicle | null;
  recentEvents: VisionEvent[];
  onSelectVehicle: (v: Vehicle) => void;
  onTriggerAiEvent: (vehicleId: string, eventType: string) => void;
}

const DEFAULT_TRIPS: Trip[] = [
  {
    id: "TRIP-801",
    vehicleId: "VEH-101",
    driverId: "DRV-001",
    driverName: "Marcus Vance",
    vehicleModel: "Freightliner Cascadia Semi",
    origin: "San Francisco Freight Depot",
    destination: "San Jose Tech Distribution Park",
    distanceKm: 78.4,
    etaTime: "02:45 PM",
    status: "IN_TRANSIT",
    startTime: "11:30 AM",
    progressPct: 62
  },
  {
    id: "TRIP-802",
    vehicleId: "VEH-102",
    driverId: "DRV-002",
    driverName: "Elena Rostova",
    vehicleModel: "Tesla Semi Commercial",
    origin: "Bay Bridge Port Hub",
    destination: "Oakland Intermodal Terminal",
    distanceKm: 34.2,
    etaTime: "01:15 PM",
    status: "IN_TRANSIT",
    startTime: "12:10 PM",
    progressPct: 45
  },
  {
    id: "TRIP-803",
    vehicleId: "VEH-103",
    driverId: "DRV-003",
    driverName: "Darius Miller",
    vehicleModel: "Ford Transit Cargo 350",
    origin: "Downtown SF Sorting Center",
    destination: "Mission District Retail Hub",
    distanceKm: 18.0,
    etaTime: "03:30 PM",
    status: "IN_TRANSIT",
    startTime: "01:00 PM",
    progressPct: 80
  },
  {
    id: "TRIP-804",
    vehicleId: "VEH-104",
    driverId: "DRV-004",
    driverName: "Chloe Chen",
    vehicleModel: "Mercedes Sprinter Pharma Van",
    origin: "South SF Biotech Campus",
    destination: "Palo Alto Medical Center",
    distanceKm: 42.6,
    etaTime: "04:00 PM",
    status: "SCHEDULED",
    startTime: "02:00 PM",
    progressPct: 15
  },
  {
    id: "TRIP-805",
    vehicleId: "VEH-105",
    driverId: "DRV-005",
    driverName: "Jamal Wilson",
    vehicleModel: "Rivian EDV 700 Delivery Van",
    origin: "Sunset District Parcel Center",
    destination: "Richmond Delivery Sector",
    distanceKm: 12.5,
    etaTime: "01:50 PM",
    status: "COMPLETED",
    startTime: "10:00 AM",
    progressPct: 100
  }
];

export const Module2TrackingTrips: React.FC<Module2Props> = ({
  vehicles,
  geofences,
  selectedVehicle,
  recentEvents,
  onSelectVehicle,
  onTriggerAiEvent
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"MAP_DASHCAM" | "TRIPS_DISPATCH">("MAP_DASHCAM");
  const [trips, setTrips] = useState<Trip[]>(DEFAULT_TRIPS);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // New trip form state
  const [newTrip, setNewTrip] = useState({
    vehicleId: vehicles[0]?.id || "VEH-101",
    origin: "",
    destination: "",
    distanceKm: 45,
    etaTime: "05:00 PM"
  });

  const handleDispatchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === newTrip.vehicleId) || vehicles[0];
    const createdTrip: Trip = {
      id: `TRIP-${800 + trips.length + 1}`,
      vehicleId: veh.id,
      driverId: veh.driver.id,
      driverName: veh.driver.name,
      vehicleModel: veh.makeModel,
      origin: newTrip.origin || "SF Central Logistics",
      destination: newTrip.destination || "Silicon Valley Hub",
      distanceKm: Number(newTrip.distanceKm) || 45,
      etaTime: newTrip.etaTime || "05:00 PM",
      status: "IN_TRANSIT",
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      progressPct: 10
    };

    setTrips([createdTrip, ...trips]);
    setShowDispatchModal(false);
    setNewTrip({ vehicleId: vehicles[0]?.id || "VEH-101", origin: "", destination: "", distanceKm: 45, etaTime: "05:00 PM" });
  };

  const handleUpdateTripStatus = (tripId: string, newStatus: Trip["status"]) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            status: newStatus,
            progressPct: newStatus === "COMPLETED" ? 100 : t.progressPct
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner: Module 2 Identity */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              Module 2
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Real-Time Tracking & Trip Management</h2>
          </div>
          <p className="text-xs text-gray-400">
            Live GPS telemetry streaming, Vision AI Edge Dashcam, route dispatching, and trip lifecycle status.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab("MAP_DASHCAM")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "MAP_DASHCAM" ? "bg-cyan-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Live Tracking Map & Dashcam
            </button>
            <button
              onClick={() => setActiveSubTab("TRIPS_DISPATCH")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "TRIPS_DISPATCH" ? "bg-cyan-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Trips & Dispatch ({trips.length})
            </button>
          </div>

          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch New Trip</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE MAP & VISION AI DASHCAM */}
      {activeSubTab === "MAP_DASHCAM" && (
        <div className="space-y-5">
          <FleetMap
            vehicles={vehicles}
            geofences={geofences}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={onSelectVehicle}
          />

          <VisionAIDashcam
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            recentEvents={recentEvents}
            onTriggerAiEvent={onTriggerAiEvent}
            onSelectVehicle={onSelectVehicle}
          />
        </div>
      )}

      {/* VIEW 2: TRIPS & DISPATCH MANAGEMENT */}
      {activeSubTab === "TRIPS_DISPATCH" && (
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Active Trip Dispatch Schedule ({trips.length})
            </h3>
            <span className="text-xs text-gray-400">Track and update trip delivery status in real time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950/80 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Vehicle & Driver</th>
                  <th className="py-3 px-4">Origin → Destination</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">ETA</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan-400">{trip.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      <div>{trip.driverName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{trip.vehicleId} • {trip.vehicleModel}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400">●</span>
                        <span>{trip.origin}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[11px]">
                        <span>↓</span>
                        <span>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{trip.distanceKm} km</td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {trip.etaTime}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full transition-all"
                          style={{ width: `${trip.progressPct}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{trip.progressPct}% completed</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          trip.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : trip.status === "IN_TRANSIT"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : trip.status === "DELAYED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <select
                        value={trip.status}
                        onChange={(e) => handleUpdateTripStatus(trip.id, e.target.value as any)}
                        className="bg-gray-950 border border-gray-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_TRANSIT">In-Transit</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DELAYED">Delayed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISPATCH NEW TRIP MODAL */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Dispatch New Commercial Trip
            </h3>
            <form onSubmit={handleDispatchTrip} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Select Vehicle & Driver</label>
                <select
                  value={newTrip.vehicleId}
                  onChange={(e) => setNewTrip({ ...newTrip, vehicleId: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.makeModel} (Driver: {v.driver?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Origin Address / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco Port Depot"
                  value={newTrip.origin}
                  onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Destination Address / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. San Jose Distribution Center"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={newTrip.distanceKm}
                    onChange={(e) => setNewTrip({ ...newTrip, distanceKm: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Estimated Arrival (ETA)</label>
                  <input
                    type="text"
                    value={newTrip.etaTime}
                    onChange={(e) => setNewTrip({ ...newTrip, etaTime: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Dispatch Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
