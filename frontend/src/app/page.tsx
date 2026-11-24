"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { LoginPage } from "@/components/LoginPage";
import { useTelematicsSocket } from "@/lib/socket";
import { Header } from "@/components/Header";
import { FleetStats } from "@/components/FleetStats";
import { FleetMap } from "@/components/FleetMap";
import { VisionAIDashcam } from "@/components/VisionAIDashcam";
import { AlertsFeed } from "@/components/AlertsFeed";
import { VehicleDetailsModal } from "@/components/VehicleDetailsModal";
import { Vehicle } from "@/lib/types";
import { Eye } from "lucide-react";

function CommandCenterContent() {
  const { isAuthenticated, isLoading } = useAuth();
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

  const [inspectingVehicle, setInspectingVehicle] = useState<Vehicle | null>(null);

  // If session state is still restoring from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A11] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-xl shadow-blue-500/30 animate-pulse mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-gray-300">Initializing FleetVisionAI Secure Session...</p>
      </div>
    );
  }

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
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
      {/* Top Application Header with User Account & Sign Out */}
      <Header
        isConnected={isConnected}
        activeAlertsCount={summary.activeAlertsCount}
        onQuickSimulate={handleQuickSimulate}
      />

      {/* Main Operations Dashboard Container */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1720px] w-full mx-auto space-y-5">
        {/* Fleet KPI Metric Cards */}
        <FleetStats summary={summary} />

        {/* Live Tracking Map & Real-Time Incident Stream Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <FleetMap
              vehicles={vehicles}
              geofences={geofences}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={handleSelectVehicle}
            />
          </div>

          <div className="lg:col-span-1">
            <AlertsFeed
              alerts={recentEvents}
              onSelectAlertVehicle={handleSelectAlertVehicle}
            />
          </div>
        </div>

        {/* VisionAI In-Cabin DMS & Road ADAS Edge Monitor */}
        <VisionAIDashcam
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          recentEvents={recentEvents}
          onTriggerAiEvent={triggerAiEvent}
          onSelectVehicle={handleSelectVehicle}
        />
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
