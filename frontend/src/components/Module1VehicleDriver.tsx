"use client";

import React, { useState } from "react";
import { Vehicle, Driver } from "../lib/types";
import { Truck, UserCheck, Plus, Edit2, Shield, Phone, Award, Zap, Fuel, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface Module1Props {
  vehicles: Vehicle[];
  onSelectVehicle: (v: Vehicle) => void;
  onRefreshData?: () => void;
}

export const Module1VehicleDriver: React.FC<Module1Props> = ({ vehicles, onSelectVehicle }) => {
  const [activeTab, setActiveTab] = useState<"VEHICLES" | "DRIVERS" | "ASSIGNMENT">("VEHICLES");
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(vehicles);

  // Driver state
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return vehicles.map((v) => v.driver);
  });

  // Modal states
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  // Form states for new vehicle
  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    makeModel: "",
    type: "DELIVERY_VAN",
    powertrain: "DIESEL",
    odometerKm: 25000
  });

  // Form states for new driver
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    safetyScore: 95
  });

  // Assignment states
  const [selectedAssignVehicleId, setSelectedAssignVehicleId] = useState(vehicles[0]?.id || "");
  const [selectedAssignDriverId, setSelectedAssignDriverId] = useState(drivers[0]?.id || "");
  const [assignmentMessage, setAssignmentMessage] = useState("");

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      id: `VEH-${100 + vehicleList.length + 1}`,
      vin: `1FUJ${Date.now().toString().slice(-8)}`,
      plate: newVehicle.plate || `CA-${Math.floor(1000 + Math.random() * 9000)}-TR`,
      makeModel: newVehicle.makeModel || "Freightliner Cascadia",
      type: newVehicle.type as any,
      powertrain: newVehicle.powertrain as any,
      fuelLevelPct: newVehicle.powertrain === "EV" ? null : 100,
      batteryPct: newVehicle.powertrain === "EV" ? 100 : null,
      odometerKm: Number(newVehicle.odometerKm) || 12000,
      engineHours: 120,
      status: "IDLE",
      driver: {
        id: "DRV-UNASSIGNED",
        name: "Unassigned",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        licenseNumber: "N/A",
        phone: "N/A",
        safetyScore: 100,
        shiftStart: "N/A",
        hoursDrivenToday: 0,
        status: "AVAILABLE"
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
        { lat: 37.7505, lng: -122.4042 }
      ],
      routeIndex: 0,
      routeProgress: 0,
      speedKmh: 0,
      heading: 0,
      latitude: 37.7749,
      longitude: -122.4194
    };

    setVehicleList([created, ...vehicleList]);
    setShowAddVehicleModal(false);
    setNewVehicle({ plate: "", makeModel: "", type: "DELIVERY_VAN", powertrain: "DIESEL", odometerKm: 25000 });
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Driver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, "0")}`,
      name: newDriver.name || "Alex Taylor",
      licenseNumber: newDriver.licenseNumber || `CDL-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: newDriver.phone || "+1 (415) 555-0199",
      safetyScore: Number(newDriver.safetyScore) || 96,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      shiftStart: "08:00 AM",
      hoursDrivenToday: 0.0,
      status: "AVAILABLE"
    };

    setDrivers([created, ...drivers]);
    setShowAddDriverModal(false);
    setNewDriver({ name: "", licenseNumber: "", phone: "", safetyScore: 95 });
  };

  const handleAssignDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDriver = drivers.find((d) => d.id === selectedAssignDriverId);
    if (!targetDriver) return;

    setVehicleList((prev) =>
      prev.map((v) => {
        if (v.id === selectedAssignVehicleId) {
          return {
            ...v,
            driverId: targetDriver.id,
            driver: { ...targetDriver, status: "ON_TRIP" }
          };
        }
        return v;
      })
    );

    setAssignmentMessage(`Successfully assigned ${targetDriver.name} to Vehicle ${selectedAssignVehicleId}!`);
    setTimeout(() => setAssignmentMessage(""), 4000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner: Module 1 Identity */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
              Module 1
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Vehicle & Driver Management</h2>
          </div>
          <p className="text-xs text-gray-400">
            Maintain vehicle fleet inventory, driver personnel profiles, and dynamic duty assignments.
          </p>
        </div>

        {/* Tab Controls & Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("VEHICLES")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "VEHICLES" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Vehicles Inventory ({vehicleList.length})
            </button>
            <button
              onClick={() => setActiveTab("DRIVERS")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "DRIVERS" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Manage Drivers ({drivers.length})
            </button>
            <button
              onClick={() => setActiveTab("ASSIGNMENT")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "ASSIGNMENT" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Assign Drivers
            </button>
          </div>

          {activeTab === "VEHICLES" && (
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          )}

          {activeTab === "DRIVERS" && (
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Register Driver</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-PANEL 1: VEHICLE INVENTORY */}
      {activeTab === "VEHICLES" && (
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Active Fleet Assets ({vehicleList.length})
            </h3>
            <span className="text-xs text-gray-400">Real-time status synced with telematics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950/80 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Make & Model</th>
                  <th className="py-3 px-4">Type / Powertrain</th>
                  <th className="py-3 px-4">Assigned Driver</th>
                  <th className="py-3 px-4">Energy / Fuel</th>
                  <th className="py-3 px-4">Odometer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
                {vehicleList.map((veh) => (
                  <tr key={veh.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan-400">{veh.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      <div>{veh.makeModel}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{veh.plate}</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[11px] font-medium border border-gray-700">
                        {veh.powertrain}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-white">
                      <div className="flex items-center gap-2">
                        <img
                          src={veh.driver.avatar}
                          alt={veh.driver.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{veh.driver.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {veh.powertrain === "EV" ? `${veh.batteryPct}% (EV)` : `${veh.fuelLevelPct}%`}
                    </td>
                    <td className="py-3 px-4">{veh.odometerKm.toLocaleString()} km</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          veh.status === "MOVING"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : veh.status === "IDLE"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {veh.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => onSelectVehicle(veh)}
                        className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-400 text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: DRIVER ROSTER */}
      {activeTab === "DRIVERS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((drv) => (
            <div
              key={drv.id}
              className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={drv.avatar}
                  alt={drv.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white truncate">{drv.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                      {drv.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">License: {drv.licenseNumber}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-500" />
                    {drv.phone}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400">Safety Score</span>
                  <p className="text-lg font-black text-purple-400 font-mono">{drv.safetyScore}/100</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400">Status</span>
                  <p className="font-bold text-emerald-400">{drv.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-PANEL 3: ASSIGN DRIVERS */}
      {activeTab === "ASSIGNMENT" && (
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800 mb-5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Assign Driver to Vehicle</h3>
              <p className="text-xs text-gray-400">Link a commercial driver to an active vehicle asset</p>
            </div>
          </div>

          {assignmentMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{assignmentMessage}</span>
            </div>
          )}

          <form onSubmit={handleAssignDriver} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Fleet Vehicle</label>
              <select
                value={selectedAssignVehicleId}
                onChange={(e) => setSelectedAssignVehicleId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {vehicleList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} - {v.makeModel} ({v.plate}) [Currently: {v.driver?.name}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Commercial Driver</label>
              <select
                value={selectedAssignDriverId}
                onChange={(e) => setSelectedAssignDriverId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} - {d.name} (Score: {d.safetyScore}/100)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Assign Driver</span>
            </button>
          </form>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Add New Vehicle to Fleet
            </h3>
            <form onSubmit={handleCreateVehicle} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Make & Model</label>
                <input
                  type="text"
                  placeholder="e.g. Freightliner Cascadia"
                  value={newVehicle.makeModel}
                  onChange={(e) => setNewVehicle({ ...newVehicle, makeModel: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. CA-4921-TR"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Powertrain</label>
                  <select
                    value={newVehicle.powertrain}
                    onChange={(e) => setNewVehicle({ ...newVehicle, powertrain: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="DIESEL">Diesel</option>
                    <option value="EV">Electric (EV)</option>
                    <option value="GASOLINE">Gasoline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Initial Odometer (km)</label>
                  <input
                    type="number"
                    value={newVehicle.odometerKm}
                    onChange={(e) => setNewVehicle({ ...newVehicle, odometerKm: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DRIVER MODAL */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Register New Commercial Driver
            </h3>
            <form onSubmit={handleCreateDriver} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Hayes"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">CDL / Commercial License Number</label>
                <input
                  type="text"
                  placeholder="e.g. CDL-584910"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (415) 555-0188"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
