export type VehicleStatus = "MOVING" | "IDLE" | "STOPPED" | "ALERT" | "IN_MAINTENANCE";
export type PowertrainType = "DIESEL" | "EV" | "GASOLINE";
export type VehicleType = "HEAVY_TRUCK" | "ELECTRIC_TRUCK" | "DELIVERY_VAN" | "COLD_CHAIN_VAN" | "ELECTRIC_VAN";

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  licenseNumber: string;
  phone: string;
  safetyScore: number;
  shiftStart: string;
  hoursDrivenToday: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
  assignedVehicleId?: string | null;
}

export interface Diagnostics {
  engineRpm?: number;
  motorRpm?: number;
  oilPressurePsi?: number;
  coolantTempC?: number;
  batteryTempC?: number;
  chargingRateKw?: number;
  kwhPerKm?: number;
  regenerativeBrakingKw?: number;
  cargoTempC?: number;
  targetTempC?: number;
  compressorStatus?: string;
  doorState?: string;
  idleDurationMinutes?: number;
  tirePressurePsi: number[];
  dtcCodes: string[];
  brakeHealthPct?: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  makeModel: string;
  type: VehicleType;
  powertrain: PowertrainType;
  fuelLevelPct: number | null;
  batteryPct: number | null;
  odometerKm: number;
  engineHours: number;
  status: VehicleStatus;
  driverId?: string | null;
  driver: Driver;
  diagnostics: Diagnostics;
  routeWaypoints: LatLng[];
  routeIndex: number;
  routeProgress: number;
  speedKmh: number;
  heading: number;
  latitude: number;
  longitude: number;
  trail?: LatLng[];
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  vehicleModel: string;
  origin: string;
  destination: string;
  distanceKm: number;
  etaTime: string;
  status: "SCHEDULED" | "IN_TRANSIT" | "COMPLETED" | "DELAYED" | "CANCELLED";
  startTime: string;
  progressPct: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  serviceType: string;
  serviceDate: string;
  costUsd: number;
  status: "DUE_SOON" | "IN_PROGRESS" | "COMPLETED";
  technicianNotes: string;
  priority: "ROUTINE" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface Geofence {
  id: string;
  name: string;
  type: "CIRCLE" | "POLYGON";
  speedLimitKmh: number;
  color: string;
  center?: [number, number];
  radiusMeters?: number;
  coordinates?: [number, number][];
}

export interface HudBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  distanceM?: number;
}

export interface VisionHudOverlay {
  driverFaceBox?: HudBoundingBox;
  eyesDetected: boolean;
  eyeAspectRatio: number;
  yawnDetected: boolean;
  phoneBox?: HudBoundingBox | null;
  leadVehicleBox?: HudBoundingBox | null;
}

export interface VisionEvent {
  id: string;
  timestamp: string;
  vehicleId: string;
  driverName: string;
  driverAvatar: string;
  makeModel: string;
  speedKmh: number;
  coordinates: [number, number];
  type: string;
  category: "DRIVER_MONITORING" | "FORWARD_SAFETY" | "TELEMATICS_AI";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  confidence: number;
  recommendation: string;
  hudOverlay?: VisionHudOverlay;
}

export interface FleetSummary {
  totalVehicles: number;
  movingVehicles: number;
  idleVehicles: number;
  stoppedVehicles: number;
  averageSafetyScore: number;
  totalFleetKm: number;
  activeAlertsCount: number;
}

export interface FleetReportSummary {
  totalFleetDistanceKm: number;
  estimatedFuelCostUsd: number;
  totalMaintenanceSpentUsd: number;
  completedTripsCount: number;
  onTimeDeliveryRate: number;
  fleetSafetyIndex: number;
  carbonReductionKg: number;
}
