"use client";

import React, { useState } from "react";
import { Vehicle, Trip, Driver } from "../lib/types";
import { useAuth } from "../lib/auth";
import { Truck, Navigation, Award, AlertTriangle, ShieldCheck, Clock, MapPin, Fuel, Wrench, CheckCircle } from "lucide-react";

interface DriverPortalProps {
  vehicles: Vehicle[];
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ vehicles }) => {
  const { user } = useAuth();
  const assignedVehicle = vehicles.find((v) => v.id === "VEH-101") || vehicles[0];

  const [tripStatus, setTripStatus] = useState<string>("IN_TRANSIT");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [reportedMessage, setReportedMessage] = useState("");

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIssueModal(false);
    setReportedMessage("Issue successfully dispatched to Fleet Operations Maintenance Queue!");
    setTimeout(() => setReportedMessage(""), 5000);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto">
      {/* Driver Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-gray-900 to-cyan-950/50 border border-blue-500/30 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
            alt={user?.name || "Driver"}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                Driver Duty Portal
              </span>
              <span className="text-xs text-gray-400">Shift Started: 06:00 AM</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">Welcome back, {user?.name || "Marcus"}!</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Assigned Vehicle: <strong className="text-cyan-400 font-mono">{assignedVehicle?.id}</strong> ({assignedVehicle?.makeModel})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all"
        >
          <Wrench className="w-4 h-4" />
          <span>Report Maintenance Issue</span>
        </button>
      </div>

      {reportedMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{reportedMessage}</span>
        </div>
      )}

      {/* Driver Telematics & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Assigned Vehicle Telematics */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Vehicle Telematics
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-cyan-400 font-bold">
              {assignedVehicle.plate}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-400 font-sans">Current Speed</span>
              <span className="text-lg font-bold text-cyan-400">{Math.round(assignedVehicle.speedKmh)} km/h</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-400 font-sans">Fuel Level</span>
              <span className="text-lg font-bold text-emerald-400">{assignedVehicle.fuelLevelPct}%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-400 font-sans">Odometer</span>
              <span className="text-sm font-bold text-white">{assignedVehicle.odometerKm.toLocaleString()} km</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Active Trip */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Current Dispatch Trip
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
              TRIP-801
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Origin</span>
              <p className="font-semibold text-white">San Francisco Freight Depot</p>
            </div>
            <div className="pt-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Destination</span>
              <p className="font-semibold text-cyan-400">San Jose Tech Distribution Park</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
              <span className="text-gray-400">ETA Arrival:</span>
              <span className="font-bold text-white font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                02:45 PM
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Driver Safety Scorecard */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Safety Performance
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                TOP TIER
              </span>
            </div>

            <div className="text-center py-2">
              <span className="text-4xl font-black text-purple-400 font-mono">94</span>
              <span className="text-xs text-gray-400 block mt-1">Safety Index (out of 100)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 text-xs text-gray-400 flex justify-between">
            <span>Hours Driven: <strong>5.4 hrs</strong></span>
            <span>Violations: <strong className="text-emerald-400">0 today</strong></span>
          </div>
        </div>
      </div>

      {/* REPORT ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Report Vehicle / Mechanical Issue
            </h3>
            <form onSubmit={handleReportIssue} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Issue Category</label>
                <select className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white">
                  <option value="BRAKES">Brake System / Air Pressure Warning</option>
                  <option value="TIRE">Low Tire Pressure / TPMS Warning</option>
                  <option value="ENGINE">Engine Temperature / Check Engine DTC</option>
                  <option value="LIGHTING">Headlight / Turn Signal Malfunction</option>
                  <option value="OTHER">Other Telematics Anomaly</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe abnormal sounds, vibration, or warning indicators..."
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Submit Maintenance Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
