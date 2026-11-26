"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "../lib/auth";
import { LoginPage } from "../components/LoginPage";
import { useTelematicsSocket } from "../lib/socket";
import { Header } from "../components/Header";
import { FleetStats } from "../components/FleetStats";
import { Module1VehicleDriver } from "../components/Module1VehicleDriver";
import { Module2TrackingTrips } from "../components/Module2TrackingTrips";
import { Module3AlertsMaintenanceReports } from "../components/Module3AlertsMaintenanceReports";
import { DriverPortal } from "../components/DriverPortal";
import { VehicleDetailsModal } from "../components/VehicleDetailsModal";
import { Vehicle } from "../lib/types";
import { Truck, Navigation, AlertTriangle, ShieldCheck, User, Eye, Layers } from "lucide-react";

type ActiveModule = "MODULE_1" | "MODULE_2" | "MODULE_3" | "DRIVER_PORTAL";

function CommandCenterContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    isConnected,
    vehicles,
    geofences,
    recentEvents,
    selectedVehicle,
    setSelectedVehicle,
    triggerAiEvent,
    summary
  } = useTelematicsSocket();

  // Active module tab: Drivers default to DRIVER_PORTAL, Admins & Managers default to MODULE_2 (Live Tracking)
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    return user?.role === "DRIVER" ? "DRIVER_PORTAL" : "MODULE_2";
  });

  const [inspectingVehicle, setInspectingVehicle] = useState<Vehicle | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A11] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-xl shadow-blue-500/30 animate-pulse mb-4">
          <Truck className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-gray-300">Initializing FleetVisionAI Secure Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setInspectingVehicle(v);
  };

  const handleSelectAlertVehicle = (vehicleId: string) => {
    const v = vehicles.find((item) => item.id === vehicleId);
    if (v) {
      setSelectedVehicle(v);
      setInspectingVehicle(v);
    }
  };

  const handleQuickSimulate = () => {
    triggerAiEvent();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        isConnected={isConnected}
        activeAlertsCount={summary.activeAlertsCount}
        onQuickSimulate={handleQuickSimulate}
      />

      {/* Main Operations Dashboard Container */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1720px] w-full mx-auto space-y-5">
        {/* Fleet KPI Metric Cards */}
        <FleetStats summary={summary} />

        {/* 3-MODULE ARCHITECTURE NAVIGATION BAR (Matches Architecture Diagram) */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Module 1 Tab */}
            <button
              onClick={() => setActiveModule("MODULE_1")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeModule === "MODULE_1"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Module 1: Vehicle & Driver Management</span>
            </button>

            {/* Module 2 Tab */}
            <button
              onClick={() => setActiveModule("MODULE_2")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeModule === "MODULE_2"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Module 2: Real-Time Tracking & Trips</span>
            </button>

            {/* Module 3 Tab */}
            <button
              onClick={() => setActiveModule("MODULE_3")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeModule === "MODULE_3"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Module 3: Alerts, Maintenance & Reports</span>
            </button>

            {/* Driver Portal Tab (Only shown if Driver or Admin) */}
            {(user?.role === "DRIVER" || user?.role === "ADMIN") && (
              <button
                onClick={() => setActiveModule("DRIVER_PORTAL")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeModule === "DRIVER_PORTAL"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Driver Portal</span>
              </button>
            )}
          </div>

          {/* User Role Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs">
            <span className="text-gray-400">Current Role:</span>
            <span className="font-bold text-cyan-400 font-mono uppercase">{user?.role}</span>
          </div>
        </div>

        {/* ACTIVE MODULE VIEW CONTAINER */}
        <div>
          {/* Module 1: Vehicle & Driver Management */}
          {activeModule === "MODULE_1" && (
            <Module1VehicleDriver
              vehicles={vehicles}
              onSelectVehicle={handleSelectVehicle}
            />
          )}

          {/* Module 2: Real-Time Tracking & Trip Management */}
          {activeModule === "MODULE_2" && (
            <Module2TrackingTrips
              vehicles={vehicles}
              geofences={geofences}
              selectedVehicle={selectedVehicle}
              recentEvents={recentEvents}
              onSelectVehicle={handleSelectVehicle}
              onTriggerAiEvent={triggerAiEvent}
            />
          )}

          {/* Module 3: Alerts, Maintenance and Reports */}
          {activeModule === "MODULE_3" && (
            <Module3AlertsMaintenanceReports
              alerts={recentEvents}
              onSelectAlertVehicle={handleSelectAlertVehicle}
            />
          )}

          {/* Dedicated Driver Portal */}
          {activeModule === "DRIVER_PORTAL" && (
            <DriverPortal vehicles={vehicles} />
          )}
        </div>
      </main>

      {/* Vehicle Deep Diagnostics Modal */}
      {inspectingVehicle && (
        <VehicleDetailsModal
          vehicle={inspectingVehicle}
          onClose={() => setInspectingVehicle(null)}
        />
      )}
    </div>
  );
}

export default function FleetDashboard() {
  return (
    <AuthProvider>
      <CommandCenterContent />
    </AuthProvider>
  );
}
