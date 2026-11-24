"use client";

import React from "react";
import { Vehicle } from "../lib/types";
import { X, Truck, Gauge, BatteryCharging, Fuel, ShieldCheck, Wrench, AlertCircle, Phone, Calendar } from "lucide-react";

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const isEV = vehicle.powertrain === "EV";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-800">
          <div className="w-14 h-14 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-lg">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">{vehicle.makeModel}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold border border-gray-700">
                {vehicle.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                {vehicle.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              VIN: <span className="font-mono text-gray-300">{vehicle.vin}</span> • Plate:{" "}
              <span className="font-mono text-gray-300">{vehicle.plate}</span>
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Driver Profile Card */}
          <div className="bg-gray-950/70 rounded-xl p-4 border border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Assigned Driver & Safety Score
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
                <img
                  src={vehicle.driver.avatar}
                  alt={vehicle.driver.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{vehicle.driver.name}</h4>
                <p className="text-xs text-gray-400">License: {vehicle.driver.licenseNumber}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {vehicle.driver.phone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Score</span>
                <p className="text-xl font-black text-purple-400">{vehicle.driver.safetyScore}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/80 flex justify-between text-xs text-gray-400">
              <span>Shift Started: {vehicle.driver.shiftStart}</span>
              <span>Driven Today: {vehicle.driver.hoursDrivenToday} hrs</span>
            </div>
          </div>

          {/* Powertrain & Energy State */}
          <div className="bg-gray-950/70 rounded-xl p-4 border border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              {isEV ? (
                <>
                  <BatteryCharging className="w-4 h-4 text-cyan-400" />
                  EV High-Voltage Battery Telematics
                </>
              ) : (
                <>
                  <Fuel className="w-4 h-4 text-amber-400" />
                  Fuel & Engine Combustion Diagnostics
                </>
              )}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">{isEV ? "State of Charge (SOC)" : "Fuel Tank Level"}</span>
                <p className="text-2xl font-bold font-mono text-emerald-400">
                  {isEV ? `${vehicle.batteryPct}%` : `${vehicle.fuelLevelPct}%`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Odometer</span>
                <p className="text-lg font-bold font-mono text-white">
                  {vehicle.odometerKm.toLocaleString()} km
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${isEV ? "bg-cyan-500" : "bg-amber-500"}`}
                style={{ width: `${isEV ? vehicle.batteryPct : vehicle.fuelLevelPct}%` }}
              ></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/80 flex justify-between text-xs text-gray-400 font-mono">
              <span>Engine Hours: {vehicle.engineHours} hrs</span>
              <span>Speed: {Math.round(vehicle.speedKmh)} km/h</span>
            </div>
          </div>
        </div>

        {/* OBD-II Real-Time Diagnostics & Tire Matrix */}
        <div className="bg-gray-950/70 rounded-xl p-4 border border-gray-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            OBD-II CAN Bus Telemetry & Tire Pressure (TPMS)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
              <span className="text-[11px] text-gray-400">Engine / Motor</span>
              <p className="text-sm font-bold text-white font-mono mt-1">
                {vehicle.diagnostics.engineRpm || vehicle.diagnostics.motorRpm || 1400} RPM
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
              <span className="text-[11px] text-gray-400">Coolant / Temp</span>
              <p className="text-sm font-bold text-white font-mono mt-1">
                {vehicle.diagnostics.coolantTempC || vehicle.diagnostics.batteryTempC || 85}°C
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
              <span className="text-[11px] text-gray-400">Front TPMS</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                {vehicle.diagnostics.tirePressurePsi[0]} / {vehicle.diagnostics.tirePressurePsi[1]} PSI
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
              <span className="text-[11px] text-gray-400">Rear TPMS</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                {vehicle.diagnostics.tirePressurePsi[2]} / {vehicle.diagnostics.tirePressurePsi[3]} PSI
              </p>
            </div>
          </div>

          {/* DTC Fault Codes */}
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">OBD-II Faults (DTC):</span>
            </div>
            <div>
              {vehicle.diagnostics.dtcCodes.length > 0 ? (
                vehicle.diagnostics.dtcCodes.map((code, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold text-[11px] border border-red-500/30"
                  >
                    {code}
                  </span>
                ))
              ) : (
                <span className="text-emerald-400 font-medium">All Systems Normal (0 DTCs)</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
          >
            Close Telematics View
          </button>
        </div>
      </div>
    </div>
  );
};
