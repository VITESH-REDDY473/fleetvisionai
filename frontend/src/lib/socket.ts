"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Vehicle, Geofence, VisionEvent, FleetSummary } from "./types";

interface UseTelematicsSocketReturn {
  isConnected: boolean;
  vehicles: Vehicle[];
  geofences: Geofence[];
  recentEvents: VisionEvent[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  triggerAiEvent: (vehicleId?: string, eventType?: string) => void;
  summary: FleetSummary;
}

export function useTelematicsSocket(): UseTelematicsSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [recentEvents, setRecentEvents] = useState<VisionEvent[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>("VEH-101");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Connect to local backend WebSocket or fallback host
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/ws/telematics";
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log("[FleetWS] Connected to FleetVisionAI telematics stream");
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "INITIAL_STATE") {
            setVehicles(message.data.vehicles || []);
            setGeofences(message.data.geofences || []);
            setRecentEvents(message.data.recentEvents || []);
          } else if (message.type === "TELEMETRY_UPDATE") {
            const telemetryUpdates = message.data.vehicles || [];
            setVehicles((prev) => {
              const map = new Map(prev.map((v) => [v.id, v]));
              telemetryUpdates.forEach((u: Partial<Vehicle> & { id: string }) => {
                const existing = map.get(u.id);
                if (existing) {
                  map.set(u.id, { ...existing, ...u });
                }
              });
              return Array.from(map.values());
            });

            // If any geofence alerts were bundled
            if (message.data.alerts && message.data.alerts.length > 0) {
              setRecentEvents((prev) => [...message.data.alerts, ...prev].slice(0, 30));
            }
          } else if (message.type === "VISION_EVENT") {
            const visionEvt = message.data;
            setRecentEvents((prev) => [visionEvt, ...prev].slice(0, 30));
          }
        } catch (err) {
          console.error("[FleetWS] Error parsing message:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("[FleetWS] Connection closed. Retrying in 3s...");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.warn("[FleetWS] WebSocket error:", err);
        ws.close();
      };
    } catch (e) {
      console.warn("[FleetWS] Connection failure:", e);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const triggerAiEvent = useCallback((vehicleId?: string, eventType?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "TRIGGER_AI_EVENT",
          vehicleId: vehicleId || selectedVehicleId,
          eventType
        })
      );
    }
  }, [selectedVehicleId]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || null;

  const setSelectedVehicle = (v: Vehicle | null) => {
    setSelectedVehicleId(v ? v.id : null);
  };

  // Compute live summary KPIs
  const summary: FleetSummary = {
    totalVehicles: vehicles.length,
    movingVehicles: vehicles.filter((v) => v.status === "MOVING").length,
    idleVehicles: vehicles.filter((v) => v.status === "IDLE").length,
    stoppedVehicles: vehicles.filter((v) => v.status === "STOPPED").length,
    averageSafetyScore: vehicles.length
      ? Math.round(vehicles.reduce((acc, v) => acc + (v.driver?.safetyScore || 90), 0) / vehicles.length)
      : 94,
    totalFleetKm: Math.round(vehicles.reduce((acc, v) => acc + (v.odometerKm || 0), 0)),
    activeAlertsCount: recentEvents.filter((e) => e.severity === "CRITICAL" || e.severity === "WARNING").length
  };

  return {
    isConnected,
    vehicles,
    geofences,
    recentEvents,
    selectedVehicle,
    setSelectedVehicle,
    triggerAiEvent,
    summary
  };
}
