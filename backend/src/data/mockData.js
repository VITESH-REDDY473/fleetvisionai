// Initial Fleet Mock Data with realistic GPS routes, drivers, and geofences

export const INITIAL_VEHICLES = [
  {
    id: "VEH-101",
    vin: "1FUJG6AV0NL108234",
    plate: "CA-7829-TR",
    makeModel: "Freightliner Cascadia Semi",
    type: "HEAVY_TRUCK",
    powertrain: "DIESEL",
    fuelLevelPct: 82,
    batteryPct: null,
    odometerKm: 142850,
    engineHours: 4230,
    status: "MOVING", // MOVING, IDLE, STOPPED, ALERT
    driver: {
      id: "DRV-001",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      licenseNumber: "CDL-984210",
      phone: "+1 (415) 555-0182",
      safetyScore: 94,
      shiftStart: "06:00 AM",
      hoursDrivenToday: 5.4
    },
    diagnostics: {
      engineRpm: 1450,
      oilPressurePsi: 48,
      coolantTempC: 88,
      tirePressurePsi: [105, 104, 106, 105],
      dtcCodes: [],
      brakeHealthPct: 92
    },
    // San Francisco to San Jose Route Waypoints
    routeWaypoints: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7505, lng: -122.4042 },
      { lat: 37.7126, lng: -122.3999 },
      { lat: 37.6624, lng: -122.3986 },
      { lat: 37.6152, lng: -122.3899 },
      { lat: 37.5630, lng: -122.3255 },
      { lat: 37.4852, lng: -122.2364 },
      { lat: 37.4419, lng: -122.1430 },
      { lat: 37.3688, lng: -122.0363 },
      { lat: 37.3382, lng: -121.8863 }
    ],
    routeIndex: 0,
    routeProgress: 0.15,
    speedKmh: 78,
    heading: 145
  },
  {
    id: "VEH-102",
    vin: "5YJSA1E28HF209841",
    plate: "NV-4392-EV",
    makeModel: "Tesla Semi Commercial",
    type: "ELECTRIC_TRUCK",
    powertrain: "EV",
    fuelLevelPct: null,
    batteryPct: 74,
    odometerKm: 68420,
    engineHours: 2110,
    status: "MOVING",
    driver: {
      id: "DRV-002",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      licenseNumber: "CDL-334189",
      phone: "+1 (510) 555-0914",
      safetyScore: 98,
      shiftStart: "07:30 AM",
      hoursDrivenToday: 4.1
    },
    diagnostics: {
      batteryTempC: 31,
      chargingRateKw: 0,
      kwhPerKm: 1.15,
      motorRpm: 4800,
      tirePressurePsi: [110, 109, 110, 111],
      dtcCodes: [],
      regenerativeBrakingKw: 42
    },
    // Bay Bridge -> Oakland Port -> Berkeley Loop
    routeWaypoints: [
      { lat: 37.7983, lng: -122.3778 },
      { lat: 37.8188, lng: -122.3456 },
      { lat: 37.8130, lng: -122.2980 },
      { lat: 37.8044, lng: -122.2712 },
      { lat: 37.8315, lng: -122.2845 },
      { lat: 37.8651, lng: -122.3012 },
      { lat: 37.8420, lng: -122.2950 }
    ],
    routeIndex: 1,
    routeProgress: 0.45,
    speedKmh: 64,
    heading: 65
  },
  {
    id: "VEH-103",
    vin: "1FTNE3YL8KKA98124",
    plate: "CA-5521-DV",
    makeModel: "Ford Transit Cargo 350",
    type: "DELIVERY_VAN",
    powertrain: "GASOLINE",
    fuelLevelPct: 54,
    batteryPct: null,
    odometerKm: 98120,
    engineHours: 3620,
    status: "MOVING",
    driver: {
      id: "DRV-003",
      name: "Darius Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      licenseNumber: "DL-887412",
      phone: "+1 (415) 555-0399",
      safetyScore: 84, // lower safety score - trigger DMS
      shiftStart: "08:00 AM",
      hoursDrivenToday: 6.2
    },
    diagnostics: {
      engineRpm: 2100,
      oilPressurePsi: 42,
      coolantTempC: 91,
      tirePressurePsi: [45, 44, 46, 45],
      dtcCodes: ["P0420 (Catalyst System Efficiency)"],
      brakeHealthPct: 78
    },
    // Downtown SF Parcel Delivery Grid
    routeWaypoints: [
      { lat: 37.7885, lng: -122.4074 },
      { lat: 37.7942, lng: -122.3995 },
      { lat: 37.7995, lng: -122.4048 },
      { lat: 37.8021, lng: -122.4182 },
      { lat: 37.7925, lng: -122.4215 },
      { lat: 37.7845, lng: -122.4188 },
      { lat: 37.7785, lng: -122.4112 }
    ],
    routeIndex: 2,
    routeProgress: 0.7,
    speedKmh: 42,
    heading: 280
  },
  {
    id: "VEH-104",
    vin: "WD3PE7CC2JP449102",
    plate: "CA-8819-RX",
    makeModel: "Mercedes Sprinter Pharma Van",
    type: "COLD_CHAIN_VAN",
    powertrain: "DIESEL",
    fuelLevelPct: 89,
    batteryPct: null,
    odometerKm: 52400,
    engineHours: 1950,
    status: "MOVING",
    driver: {
      id: "DRV-004",
      name: "Chloe Chen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      licenseNumber: "DL-552140",
      phone: "+1 (650) 555-0145",
      safetyScore: 97,
      shiftStart: "09:00 AM",
      hoursDrivenToday: 3.5
    },
    diagnostics: {
      cargoTempC: 4.2, // Cold storage monitored
      targetTempC: 4.0,
      compressorStatus: "ACTIVE",
      engineRpm: 1800,
      tirePressurePsi: [48, 48, 47, 48],
      dtcCodes: [],
      brakeHealthPct: 95
    },
    // Biotech Route: South SF -> San Bruno -> Burlingame
    routeWaypoints: [
      { lat: 37.6547, lng: -122.4077 },
      { lat: 37.6305, lng: -122.4118 },
      { lat: 37.5985, lng: -122.3868 },
      { lat: 37.5780, lng: -122.3582 },
      { lat: 37.5510, lng: -122.3325 }
    ],
    routeIndex: 0,
    routeProgress: 0.35,
    speedKmh: 58,
    heading: 160
  },
  {
    id: "VEH-105",
    vin: "7PDSGABA4NN003189",
    plate: "CA-1204-ED",
    makeModel: "Rivian EDV 700 Delivery Van",
    type: "ELECTRIC_VAN",
    powertrain: "EV",
    fuelLevelPct: null,
    batteryPct: 62,
    odometerKm: 31200,
    engineHours: 1250,
    status: "IDLE", // Currently unloading at a stop
    driver: {
      id: "DRV-005",
      name: "Jamal Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      licenseNumber: "DL-908123",
      phone: "+1 (415) 555-0722",
      safetyScore: 92,
      shiftStart: "08:30 AM",
      hoursDrivenToday: 4.8
    },
    diagnostics: {
      batteryTempC: 28,
      kwhPerKm: 0.65,
      doorState: "CARGO_DOOR_OPEN",
      tirePressurePsi: [50, 50, 49, 50],
      dtcCodes: [],
      idleDurationMinutes: 8
    },
    routeWaypoints: [
      { lat: 37.7600, lng: -122.4350 },
      { lat: 37.7690, lng: -122.4468 },
      { lat: 37.7760, lng: -122.4510 },
      { lat: 37.7830, lng: -122.4630 }
    ],
    routeIndex: 1,
    routeProgress: 0.0,
    speedKmh: 0,
    heading: 310
  },
  {
    id: "VEH-106",
    vin: "4V4NC9EH8KN509823",
    plate: "OR-9943-VL",
    makeModel: "Volvo VNL 860 Sleeper",
    type: "HEAVY_TRUCK",
    powertrain: "DIESEL",
    fuelLevelPct: 71,
    batteryPct: null,
    odometerKm: 215400,
    engineHours: 6420,
    status: "MOVING",
    driver: {
      id: "DRV-006",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      licenseNumber: "CDL-661902",
      phone: "+1 (503) 555-0211",
      safetyScore: 96,
      shiftStart: "05:00 AM",
      hoursDrivenToday: 7.2
    },
    diagnostics: {
      engineRpm: 1350,
      oilPressurePsi: 51,
      coolantTempC: 86,
      tirePressurePsi: [106, 105, 106, 104],
      dtcCodes: [],
      brakeHealthPct: 89
    },
    // East Bay Corridor I-880
    routeWaypoints: [
      { lat: 37.7212, lng: -122.1558 },
      { lat: 37.6688, lng: -122.1120 },
      { lat: 37.6045, lng: -122.0540 },
      { lat: 37.5482, lng: -121.9886 },
      { lat: 37.4890, lng: -121.9320 },
      { lat: 37.4320, lng: -121.8900 }
    ],
    routeIndex: 2,
    routeProgress: 0.6,
    speedKmh: 82,
    heading: 138
  }
];

export const GEOFENCES = [
  {
    id: "GEO-1",
    name: "Port of Oakland Logistics Hub",
    type: "POLYGON",
    speedLimitKmh: 30,
    color: "#3B82F6",
    coordinates: [
      [37.820, -122.325],
      [37.825, -122.300],
      [37.805, -122.285],
      [37.795, -122.315]
    ]
  },
  {
    id: "GEO-2",
    name: "SF Downtown High-Pedestrian Zone",
    type: "CIRCLE",
    center: [37.7890, -122.4080],
    radiusMeters: 1800,
    speedLimitKmh: 35,
    color: "#EF4444"
  },
  {
    id: "GEO-3",
    name: "SFO Cargo Terminal Security Zone",
    type: "CIRCLE",
    center: [37.6180, -122.3800],
    radiusMeters: 1600,
    speedLimitKmh: 25,
    color: "#10B981"
  },
  {
    id: "GEO-4",
    name: "Silicon Valley Tech Corridor",
    type: "POLYGON",
    speedLimitKmh: 85,
    color: "#8B5CF6",
    coordinates: [
      [37.450, -122.180],
      [37.420, -122.080],
      [37.350, -121.980],
      [37.330, -122.040],
      [37.400, -122.190]
    ]
  }
];
