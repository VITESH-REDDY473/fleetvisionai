"use client";

import React, { useState } from "react";
import { VisionEvent } from "../lib/types";
import { ShieldAlert, AlertTriangle, Info, Clock, ExternalLink, Filter } from "lucide-react";

interface AlertsFeedProps {
  alerts: VisionEvent[];
  onSelectAlertVehicle: (vehicleId: string) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts, onSelectAlertVehicle }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "ALL") return true;
    return a.severity === filterSeverity;
  });

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col h-[520px]">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Live Incident Feed</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
            {alerts.length}
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 bg-gray-800/80 p-0.5 rounded-lg border border-gray-700 text-[11px]">
          <button
            onClick={() => setFilterSeverity("ALL")}
            className={`px-2 py-1 rounded font-medium transition-all ${
              filterSeverity === "ALL" ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity("CRITICAL")}
            className={`px-2 py-1 rounded font-medium transition-all ${
              filterSeverity === "CRITICAL" ? "bg-red-700 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity("WARNING")}
            className={`px-2 py-1 rounded font-medium transition-all ${
              filterSeverity === "WARNING" ? "bg-amber-700 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Warning
          </button>
        </div>
      </div>

      {/* Scrollable Feed List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs font-medium">No safety incidents logged yet.</p>
            <p className="text-[11px] text-gray-600">Simulate an incident above or wait for live stream.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === "CRITICAL";
            const isWarning = alert.severity === "WARNING";

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-all duration-200 hover:border-gray-600 bg-gray-950/60 ${
                  isCritical
                    ? "border-red-900/60 bg-red-950/15"
                    : isWarning
                    ? "border-amber-900/60 bg-amber-950/15"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <span className="p-1 rounded-md bg-red-500/20 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    ) : isWarning ? (
                      <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                        <Info className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <span className="text-xs font-bold text-white tracking-tight">{alert.title}</span>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {formatTime(alert.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{alert.description}</p>

                <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-gray-800 text-cyan-400 font-mono font-bold">
                      {alert.vehicleId}
                    </span>
                    <span className="text-gray-400 truncate max-w-[110px]">{alert.driverName}</span>
                  </div>

                  <button
                    onClick={() => onSelectAlertVehicle(alert.vehicleId)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
