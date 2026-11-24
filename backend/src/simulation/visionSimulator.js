// In-Cabin Driver Monitoring System (DMS) & Forward ADAS AI Event Simulator

export const VISION_EVENT_TYPES = [
  {
    type: "DMS_DROWSINESS",
    category: "DRIVER_MONITORING",
    severity: "CRITICAL",
    title: "Driver Drowsiness Alert",
    description: "Prolonged eye closure detected (EAR: 0.14, duration > 2.8s)",
    confidence: 0.96,
    recommendation: "Issue in-cabin audio chime & alert fleet manager"
  },
  {
    type: "DMS_DISTRACTION_PHONE",
    category: "DRIVER_MONITORING",
    severity: "WARNING",
    title: "Mobile Phone Usage Detected",
    description: "Driver holding smartphone with right hand while vehicle moving at 64 km/h",
    confidence: 0.93,
    recommendation: "Log distraction infraction to driver safety scorecard"
  },
  {
    type: "DMS_GAZE_AVERTED",
    category: "DRIVER_MONITORING",
    severity: "WARNING",
    title: "Driver Distraction (Head Gaze)",
    description: "Head yaw deviated > 35 degrees from roadway for > 4.2 seconds",
    confidence: 0.91,
    recommendation: "Visual warning on in-cabin telematics display"
  },
  {
    type: "ADAS_FORWARD_COLLISION",
    category: "FORWARD_SAFETY",
    severity: "CRITICAL",
    title: "Forward Collision Risk (FCW)",
    description: "Rapid deceleration of leading vehicle detected (Time-to-Collision: 1.4s)",
    confidence: 0.97,
    recommendation: "Emergency Autonomous Brake Warning triggered"
  },
  {
    type: "ADAS_LANE_DEPARTURE",
    category: "FORWARD_SAFETY",
    severity: "INFO",
    title: "Unsignaled Lane Departure",
    description: "Right lane line crossed without blinker engagement",
    confidence: 0.89,
    recommendation: "Haptic steering feedback activated"
  },
  {
    type: "HARSH_MANEUVER",
    category: "TELEMATICS_AI",
    severity: "WARNING",
    title: "Harsh Braking Event",
    description: "Deceleration spike of -0.62g detected at 78 km/h",
    confidence: 0.98,
    recommendation: "Automated 15s dashcam clip buffered and archived"
  }
];

export class VisionAISimulator {
  constructor(fleetEngine) {
    this.fleetEngine = fleetEngine;
    this.recentEvents = [];
    this.listeners = [];
  }

  onVisionEvent(cb) {
    this.listeners.push(cb);
  }

  start(intervalMs = 8000) {
    // Generate periodic realistic AI events
    this.timer = setInterval(() => {
      this.generateEvent();
    }, intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  generateEvent(overrideVehicleId = null, overrideEventType = null) {
    const vehicles = this.fleetEngine.getAllVehicles();
    const movingVehicles = vehicles.filter((v) => v.status === "MOVING");
    if (!movingVehicles.length) return null;

    const targetVehicle = overrideVehicleId
      ? vehicles.find((v) => v.id === overrideVehicleId) || movingVehicles[0]
      : movingVehicles[Math.floor(Math.random() * movingVehicles.length)];

    let eventTemplate;
    if (overrideEventType) {
      eventTemplate = VISION_EVENT_TYPES.find((e) => e.type === overrideEventType) || VISION_EVENT_TYPES[0];
    } else {
      eventTemplate = VISION_EVENT_TYPES[Math.floor(Math.random() * VISION_EVENT_TYPES.length)];
    }

    const timestamp = new Date().toISOString();
    const event = {
      id: `VIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      vehicleId: targetVehicle.id,
      driverName: targetVehicle.driver.name,
      driverAvatar: targetVehicle.driver.avatar,
      makeModel: targetVehicle.makeModel,
      speedKmh: targetVehicle.speedKmh,
      coordinates: [targetVehicle.latitude, targetVehicle.longitude],
      ...eventTemplate,
      // Simulated computer vision bounding boxes for dashboard HUD overlay
      hudOverlay: {
        driverFaceBox: { x: 38, y: 22, width: 24, height: 35 },
        eyesDetected: true,
        eyeAspectRatio: eventTemplate.type === "DMS_DROWSINESS" ? 0.12 : 0.32,
        yawnDetected: eventTemplate.type === "DMS_DROWSINESS",
        phoneBox:
          eventTemplate.type === "DMS_DISTRACTION_PHONE"
            ? { x: 55, y: 52, width: 14, height: 22 }
            : null,
        leadVehicleBox:
          eventTemplate.type === "ADAS_FORWARD_COLLISION"
            ? { x: 42, y: 45, width: 28, height: 26, distanceM: 14 }
            : { x: 46, y: 48, width: 18, height: 16, distanceM: 45 }
      }
    };

    // Keep last 30 events in memory
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 30) this.recentEvents.pop();

    this.listeners.forEach((cb) => cb(event));
    return event;
  }

  getRecentEvents(limit = 20) {
    return this.recentEvents.slice(0, limit);
  }
}
