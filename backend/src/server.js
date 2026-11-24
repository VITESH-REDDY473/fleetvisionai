import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { FleetSimulationEngine } from "./simulation/fleetSimulator.js";
import { VisionAISimulator } from "./simulation/visionSimulator.js";
import { createFleetRouter } from "./routes/fleet.js";
import { createAlertsRouter } from "./routes/alerts.js";
import { setupWebSocketServer } from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize Fleet and Vision simulation engines
const fleetEngine = new FleetSimulationEngine();
const visionEngine = new VisionAISimulator(fleetEngine);

// Start simulation loops
fleetEngine.start(1000); // Telemetry update every 1s
visionEngine.start(10000); // AI vision alert simulation every 10s

// Mount REST API routes
app.use("/api/fleet", createFleetRouter(fleetEngine));
app.use("/api/alerts", createAlertsRouter(visionEngine));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "FleetVisionAI Backend & Ingestion Engine",
    timestamp: new Date().toISOString(),
    vehiclesTracked: fleetEngine.getAllVehicles().length
  });
});

// Create HTTP server & bind WebSockets
const server = http.createServer(app);
setupWebSocketServer(server, fleetEngine, visionEngine);

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 FleetVisionAI Core Engine Running on port ${PORT}`);
  console.log(`📡 WebSocket Stream: ws://localhost:${PORT}/ws/telematics`);
  console.log(`🗺️ REST API: http://localhost:${PORT}/api/fleet/vehicles`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("Shutting down FleetVisionAI engine...");
  fleetEngine.stop();
  visionEngine.stop();
  process.exit(0);
});
