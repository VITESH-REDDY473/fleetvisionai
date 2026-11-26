"use client";

import React, { useState } from "react";
import { MaintenanceRecord, VisionEvent } from "../lib/types";
import { AlertTriangle, Wrench, FileText, Download, Printer, ShieldAlert, CheckCircle, Clock, Calendar, Plus } from "lucide-react";

interface Module3Props {
  alerts: VisionEvent[];
  onSelectAlertVehicle: (vehicleId: string) => void;
}

const DEFAULT_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: "MNT-501",
    vehicleId: "VEH-101",
    vehicleModel: "Freightliner Cascadia Semi",
    serviceType: "BRAKE_INSPECTION",
    serviceDate: "2026-11-28",
    costUsd: 480.00,
    status: "DUE_SOON",
    technicianNotes: "Routine 150k km air brake pad thickness check and rotor alignment.",
    priority: "HIGH"
  },
  {
    id: "MNT-502",
    vehicleId: "VEH-103",
    vehicleModel: "Ford Transit Cargo 350",
    serviceType: "CATALYST_DIAGNOSTIC",
    serviceDate: "2026-11-26",
    costUsd: 320.00,
    status: "IN_PROGRESS",
    technicianNotes: "Resolving OBD-II DTC P0420 (Catalyst system efficiency sensor).",
    priority: "CRITICAL"
  },
  {
    id: "MNT-503",
    vehicleId: "VEH-102",
    vehicleModel: "Tesla Semi Commercial",
    serviceType: "BATTERY_HEALTH_AUDIT",
    serviceDate: "2026-11-20",
    costUsd: 150.00,
    status: "COMPLETED",
    technicianNotes: "High-voltage megawatt battery cell balancing verified. SOH at 97.4%.",
    priority: "ROUTINE"
  },
  {
    id: "MNT-504",
    vehicleId: "VEH-104",
    vehicleModel: "Mercedes Sprinter Pharma Van",
    serviceType: "COLD_CHAIN_CALIBRATION",
    serviceDate: "2026-12-05",
    costUsd: 290.00,
    status: "DUE_SOON",
    technicianNotes: "Pharma cargo refrigeration compressor temperature sensor certification.",
    priority: "MEDIUM"
  }
];

export const Module3AlertsMaintenanceReports: React.FC<Module3Props> = ({ alerts, onSelectAlertVehicle }) => {
  const [activeSubTab, setActiveSubTab] = useState<"OVERSPEED" | "MAINTENANCE" | "REPORTS">("OVERSPEED");
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>(DEFAULT_MAINTENANCE);
  const [showLogMaintenanceModal, setShowLogMaintenanceModal] = useState(false);

  // New maintenance form state
  const [newMnt, setNewMnt] = useState({
    vehicleId: "VEH-101",
    serviceType: "OIL_CHANGE",
    costUsd: 220,
    technicianNotes: "Scheduled preventative oil & filter replacement.",
    priority: "MEDIUM"
  });

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MaintenanceRecord = {
      id: `MNT-${500 + maintenanceList.length + 1}`,
      vehicleId: newMnt.vehicleId,
      vehicleModel: "Fleet Vehicle",
      serviceType: newMnt.serviceType,
      serviceDate: new Date().toISOString().split("T")[0],
      costUsd: Number(newMnt.costUsd) || 200,
      status: "DUE_SOON",
      technicianNotes: newMnt.technicianNotes,
      priority: newMnt.priority as any
    };

    setMaintenanceList([created, ...maintenanceList]);
    setShowLogMaintenanceModal(false);
  };

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Vehicle,Service_Type,Cost_USD,Status,Notes\n" +
      maintenanceList.map((m) => `${m.id},${m.vehicleId},${m.serviceType},${m.costUsd},${m.status},"${m.technicianNotes}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fleet_maintenance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Filter overspeed alerts specifically as named in the diagram
  const overspeedAlerts = alerts.filter(
    (a) => a.type === "OVERSPEED" || a.type === "GEOFENCE_SPEEDING" || a.type === "ADAS_FORWARD_COLLISION" || a.severity === "CRITICAL"
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner: Module 3 Identity */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Module 3
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Alerts, Maintenance and Reports</h2>
          </div>
          <p className="text-xs text-gray-400">
            Real-time overspeed violation monitoring, preventative maintenance tracking, and fleet analytics export.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab("OVERSPEED")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "OVERSPEED" ? "bg-amber-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Overspeed & Safety Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveSubTab("MAINTENANCE")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "MAINTENANCE" ? "bg-amber-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Maintenance Records ({maintenanceList.length})
            </button>
            <button
              onClick={() => setActiveSubTab("REPORTS")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "REPORTS" ? "bg-amber-600 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Generate Reports
            </button>
          </div>

          {activeSubTab === "MAINTENANCE" && (
            <button
              onClick={() => setShowLogMaintenanceModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Maintenance</span>
            </button>
          )}

          {activeSubTab === "REPORTS" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUB-PANEL 1: OVERSPEED & SAFETY ALERTS */}
      {activeSubTab === "OVERSPEED" && (
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Overspeed & Driving Infraction Log ({alerts.length})
            </h3>
            <span className="text-xs text-gray-400">Recorded by telematics speed sensors & Edge Vision AI</span>
          </div>

          <div className="divide-y divide-gray-800/60">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No active violations logged. Vehicles are operating within normal safety limits.
              </div>
            ) : (
              alerts.map((alt) => (
                <div key={alt.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <span
                      className={`p-2 rounded-xl ${
                        alt.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : alt.severity === "WARNING"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{alt.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alt.severity === "CRITICAL"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{alt.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400 font-mono">
                        <span>Asset: <strong className="text-white">{alt.vehicleId}</strong></span>
                        <span>Driver: <strong className="text-white">{alt.driverName}</strong></span>
                        <span>Time: {new Date(alt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectAlertVehicle(alt.vehicleId)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-400 text-xs font-semibold transition-colors"
                  >
                    View on Map
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: MAINTENANCE RECORDS */}
      {activeSubTab === "MAINTENANCE" && (
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Vehicle Maintenance Log ({maintenanceList.length})
            </h3>
            <span className="text-xs text-gray-400">Scheduled services, inspections, and repair costs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950/80 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Vehicle Asset</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Cost (USD)</th>
                  <th className="py-3 px-4">Technician Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
                {maintenanceList.map((mnt) => (
                  <tr key={mnt.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-400">{mnt.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      <div>{mnt.vehicleId}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{mnt.vehicleModel}</div>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-gray-200">
                      {mnt.serviceType.replace(/_/g, " ")}
                    </td>
                    <td className="py-3 px-4">{mnt.serviceDate}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${mnt.costUsd.toFixed(2)}</td>
                    <td className="py-3 px-4 font-sans text-gray-400 max-w-xs truncate">{mnt.technicianNotes}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mnt.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : mnt.status === "IN_PROGRESS"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {mnt.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-xs text-white">{mnt.priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: GENERATE REPORTS & ANALYTICS */}
      {activeSubTab === "REPORTS" && (
        <div className="space-y-4">
          {/* Key KPI Summary Card Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">Total Fleet Distance</span>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-1">608,190 km</p>
              <span className="text-[10px] text-emerald-400">+1,420 km today</span>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">Estimated Fuel / Power</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">$170,293</p>
              <span className="text-[10px] text-gray-400">$0.28 / km avg</span>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">Maintenance Expenditure</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-1">$1,240.00</p>
              <span className="text-[10px] text-gray-400">4 work orders</span>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">On-Time Delivery Rate</span>
              <p className="text-xl font-bold font-mono text-purple-400 mt-1">96.4%</p>
              <span className="text-[10px] text-purple-400">Target: 95%+</span>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">Fleet Safety Index</span>
              <p className="text-xl font-bold font-mono text-blue-400 mt-1">94.8 / 100</p>
              <span className="text-[10px] text-emerald-400">Zero major collisions</span>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4">
              <span className="text-[11px] text-gray-400">Carbon Reduction</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">-1,420 kg CO₂</p>
              <span className="text-[10px] text-emerald-400">EV Fleet Segment</span>
            </div>
          </div>

          {/* Printable Report Document Card */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  FleetVisionAI Operational Executive Summary Report
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Generated on {new Date().toLocaleDateString()} • Authorized for Fleet Management & Safety Audits
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                AUDIT VERIFIED
              </span>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                <h4 className="font-bold text-white text-sm mb-2">1. Fleet Utilization & Route Efficiency</h4>
                <p>
                  Over the reporting period, the commercial fleet completed <strong>96.4%</strong> of dispatches on schedule across the California Bay Area network. The introduction of the Tesla Semi and Rivian EDV electric vehicles reduced fuel operating expenditures by an estimated <strong>18.2%</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                <h4 className="font-bold text-white text-sm mb-2">2. Driver Safety & Computer Vision Infractions</h4>
                <p>
                  In-Cabin Driver Monitoring System (DMS) detected 3 instances of transient drowsiness and 2 instances of handheld mobile phone usage, both of which were immediately resolved via audio chime interventions. Overall driver safety score averaged <strong>94.8 / 100</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                <h4 className="font-bold text-white text-sm mb-2">3. Preventative Maintenance & Equipment Health</h4>
                <p>
                  4 maintenance work orders were handled this cycle totaling <strong>$1,240.00</strong>. Air brake inspections forCascasdia Heavy Semi (VEH-101) and refrigeration calibration for Sprinter Pharma Van (VEH-104) are scheduled for execution within 5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG MAINTENANCE MODAL */}
      {showLogMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Log Vehicle Maintenance Service
            </h3>
            <form onSubmit={handleCreateMaintenance} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Select Vehicle Asset</label>
                <select
                  value={newMnt.vehicleId}
                  onChange={(e) => setNewMnt({ ...newMnt, vehicleId: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                >
                  <option value="VEH-101">VEH-101 - Freightliner Cascadia</option>
                  <option value="VEH-102">VEH-102 - Tesla Semi Commercial</option>
                  <option value="VEH-103">VEH-103 - Ford Transit Cargo 350</option>
                  <option value="VEH-104">VEH-104 - Mercedes Sprinter Pharma</option>
                  <option value="VEH-105">VEH-105 - Rivian EDV 700</option>
                  <option value="VEH-106">VEH-106 - Volvo VNL 860 Sleeper</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Service Inspection Type</label>
                <select
                  value={newMnt.serviceType}
                  onChange={(e) => setNewMnt({ ...newMnt, serviceType: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                >
                  <option value="OIL_CHANGE">Oil & Filter Replacement</option>
                  <option value="BRAKE_INSPECTION">Air Brake System Inspection</option>
                  <option value="TIRE_ROTATION">Tire Rotation & Wheel Alignment</option>
                  <option value="BATTERY_DIAGNOSTIC">High-Voltage Battery Diagnostic</option>
                  <option value="SAFETY_AUDIT">Comprehensive Safety Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    value={newMnt.costUsd}
                    onChange={(e) => setNewMnt({ ...newMnt, costUsd: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Priority</label>
                  <select
                    value={newMnt.priority}
                    onChange={(e) => setNewMnt({ ...newMnt, priority: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="ROUTINE">Routine</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Technician Notes</label>
                <textarea
                  value={newMnt.technicianNotes}
                  onChange={(e) => setNewMnt({ ...newMnt, technicianNotes: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogMaintenanceModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
