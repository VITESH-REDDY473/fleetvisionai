import { WebSocketServer, WebSocket } from "ws";

export function setupWebSocketServer(httpServer, fleetEngine, visionEngine) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/telematics" });

  const clients = new Set();

  wss.on("connection", (ws, req) => {
    clients.add(ws);
    console.log(`[WebSocket] Client connected. Total active clients: ${clients.size}`);

    // Send initial full fleet snapshot upon connection
    ws.send(
      JSON.stringify({
        type: "INITIAL_STATE",
        data: {
          vehicles: fleetEngine.getAllVehicles(),
          geofences: fleetEngine.getGeofences(),
          recentEvents: visionEngine.getRecentEvents(10)
        }
      })
    );

    ws.on("message", (message) => {
      try {
        const parsed = JSON.parse(message);
        handleClientAction(parsed, ws, fleetEngine, visionEngine);
      } catch (err) {
        console.error("[WebSocket] Malformed message received:", err.message);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`[WebSocket] Client disconnected. Total active clients: ${clients.size}`);
    });

    ws.on("error", (err) => {
      console.error("[WebSocket] Client error:", err.message);
      clients.delete(ws);
    });
  });

  // Broadcast helper
  const broadcast = (data) => {
    const payload = JSON.stringify(data);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  };

  // Wire Fleet Engine telemetry updates
  fleetEngine.onTelemetryUpdate((telemetryPayload) => {
    broadcast({
      type: "TELEMETRY_UPDATE",
      data: telemetryPayload
    });
  });

  // Wire Vision AI Events
  visionEngine.onVisionEvent((visionEvent) => {
    broadcast({
      type: "VISION_EVENT",
      data: visionEvent
    });
  });

  return { wss, broadcast };
}

function handleClientAction(action, ws, fleetEngine, visionEngine) {
  switch (action.type) {
    case "TRIGGER_AI_EVENT":
      const event = visionEngine.generateEvent(action.vehicleId, action.eventType);
      ws.send(
        JSON.stringify({
          type: "ACTION_CONFIRMED",
          action: "TRIGGER_AI_EVENT",
          event
        })
      );
      break;

    case "PING":
      ws.send(JSON.stringify({ type: "PONG", timestamp: Date.now() }));
      break;

    default:
      console.log("[WebSocket] Unknown action type:", action.type);
  }
}
