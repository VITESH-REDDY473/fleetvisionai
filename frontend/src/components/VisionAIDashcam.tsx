"use client";

import React, { useState } from "react";
import { Vehicle, VisionEvent } from "../lib/types";
import { Eye, ShieldAlert, Cpu, AlertTriangle, PhoneCall, Zap, Play, CheckCircle2 } from "lucide-react";

interface VisionAIDashcamProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  recentEvents: VisionEvent[];
  onTriggerAiEvent: (vehicleId: string, eventType: string) => void;
  onSelectVehicle: (v: Vehicle) => void;
}

export const VisionAIDashcam: React.FC<VisionAIDashcamProps> = ({
  vehicles,
  selectedVehicle,
  recentEvents,
  onTriggerAiEvent,
  onSelectVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<"DUAL" | "CABIN_DMS" | "ROAD_ADAS">("DUAL");

  const currentVehicle = selectedVehicle || vehicles[0];
  const latestVehicleEvent = recentEvents.find((e) => e.vehicleId === currentVehicle?.id);

  // Check if current event is active in DMS or ADAS
  const isDrowsy = latestVehicleEvent?.type === "DMS_DROWSINESS";
  const isPhoneDistracted = latestVehicleEvent?.type === "DMS_DISTRACTION_PHONE";
  const isCollisionWarning = latestVehicleEvent?.type === "ADAS_FORWARD_COLLISION";
  const isLaneDeparture = latestVehicleEvent?.type === "ADAS_LANE_DEPARTURE";

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shadow-xl">
      {/* Top Bar / Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              VisionAI Live Telematics & Edge Dashcam
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                30 FPS • 22ms Latency
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Dual-Stream Neural Inference (Driver Cabin DMS + Forward Road ADAS)
            </p>
          </div>
        </div>

        {/* Vehicle Selector & Tab Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={currentVehicle?.id || ""}
            onChange={(e) => {
              const target = vehicles.find((v) => v.id === e.target.value);
              if (target) onSelectVehicle(target);
            }}
            className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} - {v.makeModel} ({v.driver.name})
              </option>
            ))}
          </select>

          <div className="flex bg-gray-800/80 p-0.5 rounded-lg border border-gray-700 text-xs">
            <button
              onClick={() => setActiveTab("DUAL")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "DUAL" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Dual Feed
            </button>
            <button
              onClick={() => setActiveTab("CABIN_DMS")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "CABIN_DMS" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              In-Cabin DMS
            </button>
            <button
              onClick={() => setActiveTab("ROAD_ADAS")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "ROAD_ADAS" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Forward ADAS
            </button>
          </div>
        </div>
      </div>

      {/* Video / AI Canvas View Area */}
      <div
        className={`grid gap-4 mb-4 ${
          activeTab === "DUAL" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Stream 1: In-Cabin Driver Monitoring System (DMS) */}
        {(activeTab === "DUAL" || activeTab === "CABIN_DMS") && (
          <div className="relative rounded-xl overflow-hidden bg-gray-950 border border-gray-800 aspect-video flex flex-col justify-between p-3 select-none">
            {/* Background Simulated Driver Visual */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-950 to-gray-900 flex items-center justify-center">
              {/* Animated HUD Grid */}
              <div
                className="w-full h-full opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }}
              ></div>
            </div>

            {/* AI Bounding Box & Facial Landmark HUD */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Simulated Face Bounding Box */}
              <div
                className={`relative w-44 h-56 rounded-xl border-2 transition-all duration-300 ${
                  isDrowsy
                    ? "border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                    : isPhoneDistracted
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    : "border-cyan-400/80 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                }`}
              >
                {/* Corner Accents */}
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></span>
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></span>

                {/* Face Label */}
                <div className="absolute -top-6 left-0 bg-gray-900/90 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
                  Face_ID: {currentVehicle?.driver.name.split(" ")[0]} • 98.4%
                </div>

                {/* Eye Landmark Indicators */}
                <div className="absolute top-16 left-6 right-6 flex justify-between px-2">
                  <div
                    className={`w-6 h-3 rounded-full border flex items-center justify-center ${
                      isDrowsy ? "border-red-400 bg-red-500/40" : "border-cyan-400 bg-cyan-400/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div
                    className={`w-6 h-3 rounded-full border flex items-center justify-center ${
                      isDrowsy ? "border-red-400 bg-red-500/40" : "border-cyan-400 bg-cyan-400/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                </div>

                {/* Gaze Vector / Crosshair */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-4 h-4 border border-cyan-400/60 rounded-full flex items-center justify-center">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                  </div>
                </div>

                {/* Phone Detection Box if Distracted */}
                {isPhoneDistracted && (
                  <div className="absolute -bottom-8 -right-8 w-20 h-28 border-2 border-amber-400 bg-amber-500/20 rounded-lg p-1 animate-pulse">
                    <span className="text-[9px] font-bold text-amber-300 font-mono uppercase">
                      PHONE (93%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Top HUD Overlay Info */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-1 rounded bg-black/70 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                CAM-01: IN-CABIN DMS
              </span>
              <span className="px-2 py-1 rounded bg-black/70 text-gray-300 border border-gray-800">
                EAR: {isDrowsy ? "0.14 (DROWSY)" : "0.32 (NORMAL)"}
              </span>
            </div>

            {/* Bottom HUD State Banner */}
            <div className="relative z-10 flex items-center justify-between">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border ${
                  isDrowsy
                    ? "bg-red-950/90 text-red-300 border-red-500 alert-pulse"
                    : isPhoneDistracted
                    ? "bg-amber-950/90 text-amber-300 border-amber-500"
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isDrowsy ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>CRITICAL: DROWSINESS / MICROSLEEP DETECTED</span>
                  </>
                ) : isPhoneDistracted ? (
                  <>
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>WARNING: CELL PHONE USAGE IN MOTION</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>STATUS: ATTENTIVE • GAZE ALIGNED</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
                DRIVER: {currentVehicle?.driver.name}
              </span>
            </div>
          </div>
        )}

        {/* Stream 2: Forward Road ADAS (Collision & Lane Hazard) */}
        {(activeTab === "DUAL" || activeTab === "ROAD_ADAS") && (
          <div className="relative rounded-xl overflow-hidden bg-gray-950 border border-gray-800 aspect-video flex flex-col justify-between p-3 select-none">
            {/* Animated Road Perspective Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden flex items-center justify-center">
              {/* Road Lane Lines */}
              <svg className="w-full h-full opacity-40" viewBox="0 0 400 220" preserveAspectRatio="none">
                {/* Left Lane Boundary */}
                <line
                  x1="180"
                  y1="100"
                  x2="40"
                  y2="220"
                  stroke={isLaneDeparture ? "#EF4444" : "#06B6D4"}
                  strokeWidth="3"
                  strokeDasharray={isLaneDeparture ? "6, 4" : "none"}
                />
                {/* Center Road Dash */}
                <line x1="200" y1="100" x2="200" y2="220" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8, 8" />
                {/* Right Lane Boundary */}
                <line x1="220" y1="100" x2="360" y2="220" stroke="#06B6D4" strokeWidth="3" />
              </svg>
            </div>

            {/* Forward Object Detection Bounding Box */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`relative transition-all duration-500 rounded-lg border-2 flex flex-col items-center justify-between p-1.5 ${
                  isCollisionWarning
                    ? "w-44 h-36 border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.7)] alert-pulse"
                    : "w-28 h-22 border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                }`}
              >
                <div className="w-full flex justify-between text-[9px] font-mono font-bold bg-black/80 px-1 py-0.5 rounded text-white">
                  <span>VEHICLE_LEAD</span>
                  <span className={isCollisionWarning ? "text-red-400" : "text-emerald-400"}>
                    {isCollisionWarning ? "14m (TTC: 1.4s)" : "42m (SAFE)"}
                  </span>
                </div>
                <div className="text-center font-mono text-[10px] font-extrabold text-white">
                  {isCollisionWarning ? "COLLISION RISK" : "SPEED: 74 km/h"}
                </div>
              </div>
            </div>

            {/* Top HUD Overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-1 rounded bg-black/70 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                CAM-02: FORWARD ROAD ADAS
              </span>
              <span className="px-2 py-1 rounded bg-black/70 text-gray-300 border border-gray-800">
                FOV: 120° • 4K HDR
              </span>
            </div>

            {/* Bottom HUD State Banner */}
            <div className="relative z-10 flex items-center justify-between">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border ${
                  isCollisionWarning
                    ? "bg-red-950/90 text-red-300 border-red-500 alert-pulse"
                    : isLaneDeparture
                    ? "bg-amber-950/90 text-amber-300 border-amber-500"
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isCollisionWarning ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>FCW: AUTONOMOUS EMERGENCY BRAKING PRIMED</span>
                  </>
                ) : isLaneDeparture ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>LDW: UNSIGNALED LANE DRIFT RIGHT</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>LANE POSITION CENTERED • DISTANCE SECURE</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
                SPEED: {Math.round(currentVehicle?.speedKmh || 0)} KM/H
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Edge Simulation Control Panel */}
      <div className="bg-gray-950/80 rounded-xl p-3 border border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-gray-200">Interactive Vision AI Simulation Triggers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTriggerAiEvent(currentVehicle.id, "DMS_DROWSINESS")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-700/50 transition-all active:scale-95"
          >
            <Play className="w-3 h-3 text-red-400" />
            <span>Simulate Drowsiness</span>
          </button>

          <button
            onClick={() => onTriggerAiEvent(currentVehicle.id, "DMS_DISTRACTION_PHONE")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-700/50 transition-all active:scale-95"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>Simulate Phone Usage</span>
          </button>

          <button
            onClick={() => onTriggerAiEvent(currentVehicle.id, "ADAS_FORWARD_COLLISION")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 transition-all active:scale-95"
          >
            <Play className="w-3 h-3 text-purple-400" />
            <span>Simulate Forward Collision</span>
          </button>
        </div>
      </div>
    </div>
  );
};
