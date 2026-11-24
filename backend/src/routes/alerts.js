import express from "express";

export function createAlertsRouter(visionEngine) {
  const router = express.Router();

  // GET /api/alerts - List recent vision & safety alerts
  router.get("/", (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 20;
      const events = visionEngine.getRecentEvents(limit);
      res.json({ success: true, count: events.length, data: events });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/alerts/trigger-simulation - Manually trigger an AI vision event (e.g. for testing)
  router.post("/trigger-simulation", (req, res) => {
    try {
      const { vehicleId, eventType } = req.body;
      const event = visionEngine.generateEvent(vehicleId, eventType);
      res.json({ success: true, message: "AI Vision event triggered", data: event });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
