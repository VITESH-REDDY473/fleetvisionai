"use client";

import React from "react";
import { Truck, Navigation, AlertTriangle, Award, Zap, Gauge } from "lucide-react";
import { FleetSummary } from "../lib/types";

interface FleetStatsProps {
  summary: FleetSummary;
}

export const FleetStats: React.FC<FleetStatsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* Total Fleet */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Total Assets</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{summary.totalVehicles}</span>
          <span className="text-xs text-emerald-400 font-medium">100% online</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-500 h-full w-full"></div>
        </div>
      </div>

      {/* Moving In-Transit */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">In Transit</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{summary.movingVehicles}</span>
          <span className="text-xs text-gray-400">active routes</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(summary.movingVehicles / (summary.totalVehicles || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Idle / Unloading */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Idle / Loading</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-400 tracking-tight">{summary.idleVehicles}</span>
          <span className="text-xs text-gray-400">vehicles</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${(summary.idleVehicles / (summary.totalVehicles || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Driver Safety Score */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Safety Score</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{summary.averageSafetyScore}</span>
          <span className="text-xs text-purple-400 font-medium">/ 100 avg</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-purple-500 h-full transition-all duration-500"
            style={{ width: `${summary.averageSafetyScore}%` }}
          ></div>
        </div>
      </div>

      {/* EV / Clean Energy Fleet */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">EV Electrification</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-400 tracking-tight">33%</span>
          <span className="text-xs text-gray-400">EV powertrains</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-cyan-500 h-full w-1/3"></div>
        </div>
      </div>

      {/* Critical Incidents */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden group hover:border-red-900/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Active Incidents</span>
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-red-400 tracking-tight">{summary.activeAlertsCount}</span>
          <span className="text-xs text-red-400/80 font-medium">real-time flags</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-red-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, summary.activeAlertsCount * 25)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
