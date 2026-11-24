# FleetVisionAI – Intelligent Real-Time Vehicle Tracking & Fleet Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![WebSockets](https://img.shields.io/badge/WebSockets-1Hz%20Real--Time-blue.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

**FleetVisionAI** is an enterprise-grade fleet telematics and intelligent computer vision platform. It combines real-time geospatial GPS tracking, high-frequency CAN/OBD-II vehicle diagnostics, and dual-stream edge Computer Vision (**Driver Monitoring System [DMS]** + **Forward Advanced Driver Assistance Systems [ADAS]**) into a single, cohesive operations command center.

---

## 🌟 Key Capabilities

### 1. 🗺️ High-Precision Real-Time Tracking Grid
- **1Hz High-Frequency Telematics**: Live geospatial streaming with smooth bearing and coordinate interpolation.
- **Dynamic Heading & Trails**: Directional vehicle icons showing orientation headings and historical route breadcrumbs.
- **Geofencing Engine**: Circular and polygonal geofence zones with real-time speed limit monitoring and breach triggers (e.g. *Port of Oakland*, *SF Downtown Pedestrian Zone*, *SFO Security Zone*).

### 2. 👁️ VisionAI Dual-Stream Edge Dashcam
- **In-Cabin DMS (Driver Monitoring System)**:
  - Real-time facial landmark detection & Eye Aspect Ratio (EAR) monitoring for **drowsiness and microsleep**.
  - Head yaw and gaze deviation tracking for **attention loss**.
  - Object detection for **handheld mobile phone usage** while in motion.
- **Forward-Facing ADAS (Advanced Driver Assistance System)**:
  - Forward object detection with dynamic distance calculation (e.g., 42m Safe vs. 14m Critical).
  - Forward Collision Warning (FCW) with Time-to-Collision (TTC) prediction.
  - Unsignaled Lane Departure Warnings (LDW).
- **Interactive AI Incident Simulator**: Live triggers to simulate incidents and observe instant reaction across the fleet map, alerts feed, and video HUD.

### 3. 📊 Vehicle Telematics & Diagnostics Drawer
- **Powertrain Monitoring**: Dedicated support for Commercial EVs (High-voltage Battery SOC, charging rate, kWh/km) and ICE vehicles (fuel level, engine RPM, coolant temp).
- **CAN Bus & OBD-II Diagnostics**: Real-time Diagnostic Trouble Codes (DTCs), oil pressure, and individual 4-wheel tire pressures (TPMS).
- **Driver Profiles & Safety Scorecards**: Hours driven today, shift start, CDL details, and safety rating scores.

---

## 🏗️ System Architecture

```
fleetvisionai/
├── backend/                  # Node.js + Express + WebSocket Telematics Engine
│   ├── src/
│   │   ├── data/             # Mock vehicle assets, routes, drivers, and geofences
│   │   ├── routes/           # REST endpoints (/api/fleet, /api/alerts)
│   │   ├── simulation/       # Geospatial movement engine & Vision AI generator
│   │   ├── server.js         # Express HTTP + WebSocket server setup
│   │   └── socket.js         # Real-time WebSocket broadcasting (1Hz)
│   └── package.json
├── frontend/                 # Next.js 14 + React + Tailwind CSS Dashboard
│   ├── src/
│   │   ├── app/              # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   │   ├── components/       # FleetMap, VisionAIDashcam, AlertsFeed, FleetStats, etc.
│   │   └── lib/              # Types and WebSocket connection client
│   └── package.json
├── package.json              # Root workspace runner
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
# In the project root:
npm --prefix backend install
npm --prefix frontend install
```

### 2. Start the Backend Server
```bash
# Starts the Express API and WebSocket Telematics Gateway on port 5000:
npm --prefix backend run dev
```

### 3. Start the Next.js Frontend
```bash
# In a separate terminal, start the Next.js development server:
npm --prefix frontend run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📡 REST API & WebSocket Reference

### WebSocket Stream
- **URL**: `ws://localhost:5000/ws/telematics`
- **Messages**:
  - `INITIAL_STATE`: Full dump of all assets, geofences, and initial coordinates.
  - `TELEMETRY_UPDATE`: Broadcasted every 1 second with updated `[lat, lng]`, heading, speed, diagnostics, and breadcrumbs.
  - `VISION_EVENT`: Broadcasted upon detection of DMS fatigue, mobile phone distraction, or forward collision warnings.

### REST Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/fleet/vehicles` | Returns all active fleet vehicles and telematics snapshots |
| `GET` | `/api/fleet/vehicles/:id` | Returns detailed specs and sensor data for a specific asset |
| `GET` | `/api/fleet/geofences` | Returns all active geofence zones (circles & polygons) |
| `GET` | `/api/fleet/summary` | Aggregated fleet KPIs (in transit, idle, avg safety score) |
| `GET` | `/api/alerts` | Recent AI safety events and incident log |
| `POST` | `/api/alerts/trigger-simulation` | Manually triggers an edge AI vision event for a vehicle |
