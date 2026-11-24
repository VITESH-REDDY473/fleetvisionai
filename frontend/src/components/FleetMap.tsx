"use client";

import React, { useEffect, useRef, useState } from "react";
import { Vehicle, Geofence } from "../lib/types";
import { Layers, MapPin, Compass, Shield, Satellite, Map as MapIcon, Moon } from "lucide-react";

interface FleetMapProps {
  vehicles: Vehicle[];
  geofences: Geofence[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle) => void;
}

export type MapTheme = "DARK" | "SATELLITE" | "STREET";

export const FleetMap: React.FC<FleetMapProps> = ({
  vehicles,
  geofences,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayersRef = useRef<any[]>([]);
  const markersRef = useRef<Map<string, any>>(new Map());
  const trailsRef = useRef<Map<string, any>>(new Map());
  const geofenceLayersRef = useRef<any[]>([]);
  
  const [mapTheme, setMapTheme] = useState<MapTheme>("DARK");
  const [showGeofences, setShowGeofences] = useState(true);
  const [showTrails, setShowTrails] = useState(true);

  // Initialize Leaflet Map on client mount
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      // Center around San Francisco Bay Area corridor
      const map = L.map(mapContainerRef.current, {
        center: [37.68, -122.25],
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;
      applyTileTheme(map, L, "DARK");
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Helper to apply tile layers based on theme (No API key needed, high performance)
  const applyTileTheme = (map: any, L: any, theme: MapTheme) => {
    // Remove existing tile layers
    tileLayersRef.current.forEach((layer) => {
      try {
        map.removeLayer(layer);
      } catch {}
    });
    tileLayersRef.current = [];

    if (theme === "DARK") {
      // Esri Dark Gray Base + crisp Highway/Street Reference labels (100% free, no API key)
      const baseLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Esri, HERE, Garmin" }
      ).addTo(map);

      const refLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, pane: "overlayPane", opacity: 0.85 }
      ).addTo(map);

      tileLayersRef.current = [baseLayer, refLayer];
    } else if (theme === "SATELLITE") {
      // Esri World Imagery (High-Resolution Satellite Aerial View)
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Esri, Maxar, Earthstar Geographics" }
      ).addTo(map);

      tileLayersRef.current = [satLayer];
    } else if (theme === "STREET") {
      // Standard OpenStreetMap street map with road names and highways
      const osmLayer = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, attribution: "© OpenStreetMap contributors" }
      ).addTo(map);

      tileLayersRef.current = [osmLayer];
    }
  };

  // Switch Theme effect
  const handleThemeChange = async (newTheme: MapTheme) => {
    setMapTheme(newTheme);
    if (!mapInstanceRef.current) return;
    const L = (await import("leaflet")).default;
    applyTileTheme(mapInstanceRef.current, L, newTheme);
  };

  // Update Geofence Layers
  useEffect(() => {
    async function updateGeofences() {
      if (!mapInstanceRef.current) return;
      const L = (await import("leaflet")).default;

      // Clear existing geofence layers
      geofenceLayersRef.current.forEach((layer) => layer.remove());
      geofenceLayersRef.current = [];

      if (!showGeofences) return;

      geofences.forEach((geo) => {
        let layer;
        if (geo.type === "CIRCLE" && geo.center && geo.radiusMeters) {
          layer = L.circle(geo.center, {
            radius: geo.radiusMeters,
            color: geo.color,
            fillColor: geo.color,
            fillOpacity: 0.16,
            weight: 2,
            dashArray: "4, 6"
          });
        } else if (geo.type === "POLYGON" && geo.coordinates) {
          layer = L.polygon(geo.coordinates as any, {
            color: geo.color,
            fillColor: geo.color,
            fillOpacity: 0.16,
            weight: 2,
            dashArray: "4, 6"
          });
        }

        if (layer) {
          layer.bindTooltip(
            `<div class="text-xs font-semibold">${geo.name} <span class="text-gray-400">(${geo.speedLimitKmh} km/h max)</span></div>`,
            { permanent: false, direction: "top", className: "bg-gray-900 text-white border border-gray-700 px-2 py-1 rounded" }
          );
          layer.addTo(mapInstanceRef.current);
          geofenceLayersRef.current.push(layer);
        }
      });
    }

    updateGeofences();
  }, [geofences, showGeofences]);

  // Update Vehicle Markers and Trails smoothly on telemetry updates
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current) return;
      const L = (await import("leaflet")).default;

      vehicles.forEach((v) => {
        const isSelected = selectedVehicle?.id === v.id;
        const color =
          v.status === "ALERT"
            ? "#EF4444"
            : v.status === "IDLE"
            ? "#F59E0B"
            : isSelected
            ? "#06B6D4"
            : "#3B82F6";

        // SVG Vehicle Icon with rotated heading arrow
        const customIcon = L.divIcon({
          className: "custom-vehicle-marker",
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="
                width: 38px;
                height: 38px;
                background: ${isSelected ? "#0F172A" : "#111827"};
                border: 2px solid ${color};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 16px ${color};
                transform: rotate(${v.heading || 0}deg);
                transition: transform 0.5s ease;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.5">
                  <path d="M12 2L19 21L12 17L5 21L12 2Z" />
                </svg>
              </div>
              <div style="
                margin-top: 3px;
                background: rgba(17, 24, 39, 0.95);
                border: 1px solid rgba(75, 85, 99, 0.8);
                padding: 1px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 700;
                color: #FFFFFF;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.7);
              ">
                ${v.id} • ${Math.round(v.speedKmh)} km/h
              </div>
            </div>
          `,
          iconSize: [40, 50],
          iconAnchor: [20, 25]
        });

        // Update or create marker
        if (markersRef.current.has(v.id)) {
          const marker = markersRef.current.get(v.id);
          marker.setLatLng([v.latitude, v.longitude]);
          marker.setIcon(customIcon);
        } else {
          const marker = L.marker([v.latitude, v.longitude], { icon: customIcon });
          marker.on("click", () => {
            onSelectVehicle(v);
          });
          marker.addTo(mapInstanceRef.current);
          markersRef.current.set(v.id, marker);
        }

        // Update breadcrumb trails
        if (showTrails && v.trail && v.trail.length > 1) {
          const trailCoords = v.trail.map((p) => [p.lat, p.lng] as [number, number]);
          if (trailsRef.current.has(v.id)) {
            const polyline = trailsRef.current.get(v.id);
            polyline.setLatLngs(trailCoords as any);
          } else {
            const polyline = L.polyline(trailCoords as any, {
              color: isSelected ? "#06B6D4" : "#3B82F6",
              weight: isSelected ? 3.5 : 2.5,
              opacity: isSelected ? 0.9 : 0.6,
              dashArray: "3, 6"
            }).addTo(mapInstanceRef.current);
            trailsRef.current.set(v.id, polyline);
          }
        }
      });
    }

    updateMarkers();
  }, [vehicles, selectedVehicle, showTrails, onSelectVehicle]);

  // Center on selected vehicle if clicked
  const handleFocusSelected = () => {
    if (mapInstanceRef.current && selectedVehicle) {
      mapInstanceRef.current.flyTo([selectedVehicle.latitude, selectedVehicle.longitude], 13, {
        duration: 1.2
      });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([37.68, -122.25], 10, { duration: 1.0 });
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-gray-800 bg-[#0C111C] shadow-2xl">
      {/* Leaflet DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Badge & Theme Switcher (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-md border border-gray-800 px-3 py-1.5 rounded-xl shadow-lg">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-white">Live Tracking Grid</span>
          <span className="text-[11px] text-gray-400">({vehicles.length} assets active)</span>
        </div>

        {/* Map Style Selector */}
        <div className="flex items-center bg-gray-900/95 backdrop-blur-md border border-gray-800 p-0.5 rounded-xl shadow-lg">
          <button
            onClick={() => handleThemeChange("DARK")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              mapTheme === "DARK"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => handleThemeChange("SATELLITE")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              mapTheme === "SATELLITE"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Satellite className="w-3 h-3" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => handleThemeChange("STREET")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              mapTheme === "STREET"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MapIcon className="w-3 h-3" />
            <span>Street</span>
          </button>
        </div>
      </div>

      {/* Right Map Action Toolbars */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setShowGeofences(!showGeofences)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all shadow-md ${
            showGeofences
              ? "bg-blue-600/90 border-blue-400 text-white"
              : "bg-gray-900/90 border-gray-700 text-gray-300 hover:bg-gray-800"
          }`}
          title="Toggle Geofence zones"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Geofences</span>
        </button>

        <button
          onClick={() => setShowTrails(!showTrails)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all shadow-md ${
            showTrails
              ? "bg-cyan-600/90 border-cyan-400 text-white"
              : "bg-gray-900/90 border-gray-700 text-gray-300 hover:bg-gray-800"
          }`}
          title="Toggle Vehicle Trails"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Trails</span>
        </button>

        <button
          onClick={handleFocusSelected}
          disabled={!selectedVehicle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900/90 border border-gray-700 text-gray-200 hover:bg-gray-800 backdrop-blur-md shadow-md transition-all"
          title="Focus on selected asset"
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Follow Asset</span>
        </button>

        <button
          onClick={handleResetView}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900/90 border border-gray-700 text-gray-200 hover:bg-gray-800 backdrop-blur-md shadow-md transition-all"
          title="Reset map zoom"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Bottom Floating Vehicle Quick Bar */}
      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur-lg border border-gray-700/80 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
              {selectedVehicle.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{selectedVehicle.makeModel}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                  {selectedVehicle.plate}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedVehicle.status === "MOVING"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Driver: <span className="text-gray-200 font-medium">{selectedVehicle.driver.name}</span> • CDL:{" "}
                {selectedVehicle.driver.licenseNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-gray-400">Speed</span>
              <p className="text-base font-bold text-cyan-400 font-mono">{Math.round(selectedVehicle.speedKmh)} km/h</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Heading</span>
              <p className="text-base font-bold text-white font-mono">{selectedVehicle.heading}°</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">
                {selectedVehicle.powertrain === "EV" ? "Battery" : "Fuel"}
              </span>
              <p className="text-base font-bold text-emerald-400 font-mono">
                {selectedVehicle.powertrain === "EV"
                  ? `${selectedVehicle.batteryPct}%`
                  : `${selectedVehicle.fuelLevelPct}%`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Driver Safety</span>
              <p className="text-base font-bold text-purple-400 font-mono">
                {selectedVehicle.driver.safetyScore}/100
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
