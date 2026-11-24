import express from "express";

export function createFleetRouter(fleetEngine) {
  const router = express.Router();

  // GET /api/fleet/vehicles - All active vehicles with real-time telemetry
  router.get("/vehicles", (req, res) => {
    try {
      const vehicles = fleetEngine.getAllVehicles();
      res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/fleet/vehicles/:id - Specific vehicle details & telematics
  router.get("/vehicles/:id", (req, res) => {
    try {
      const vehicle = fleetEngine.getVehicleById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ success: false, error: "Vehicle not found" });
      }
      res.json({ success: true, data: vehicle });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/fleet/geofences - List all configured geofences
  router.get("/geofences", (req, res) => {
    try {
      const geofences = fleetEngine.getGeofences();
      res.json({ success: true, count: geofences.length, data: geofences });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/fleet/summary - Aggregated fleet KPIs
  router.get("/summary", (req, res) => {
    try {
      const vehicles = fleetEngine.getAllVehicles();
      const moving = vehicles.filter((v) => v.status === "MOVING").length;
      const idle = vehicles.filter((v) => v.status === "IDLE").length;
      const stopped = vehicles.filter((v) => v.status === "STOPPED").length;

      const avgSafetyScore = Math.round(
        vehicles.reduce((acc, v) => acc + (v.driver?.safetyScore || 90), 0) / (vehicles.length || 1)
      );

      const totalKm = Math.round(vehicles.reduce((acc, v) => acc + (v.odometerKm || 0), 0));

      res.json({
        success: true,
        data: {
          totalVehicles: vehicles.length,
          movingVehicles: moving,
          idleVehicles: idle,
          stoppedVehicles: stopped,
          averageSafetyScore: avgSafetyScore,
          totalFleetKm: totalKm,
          activeAlertsCount: 2
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
