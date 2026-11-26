-- FleetVisionAI MySQL Database Schema
-- Matches the architecture: Vehicle, Driver, Trip, Alerts, Maintenance Records

CREATE DATABASE IF NOT EXISTS fleetvisionai_db;
USE fleetvisionai_db;

-- 1. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    avatar_url VARCHAR(255),
    safety_score INT DEFAULT 95,
    shift_start VARCHAR(20) DEFAULT '08:00 AM',
    hours_driven_today DECIMAL(5,2) DEFAULT 0.0,
    status ENUM('AVAILABLE', 'ON_TRIP', 'OFF_DUTY') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(32) PRIMARY KEY,
    vin VARCHAR(50) NOT NULL UNIQUE,
    plate VARCHAR(30) NOT NULL UNIQUE,
    make_model VARCHAR(100) NOT NULL,
    vehicle_type ENUM('HEAVY_TRUCK', 'ELECTRIC_TRUCK', 'DELIVERY_VAN', 'COLD_CHAIN_VAN', 'ELECTRIC_VAN') NOT NULL,
    powertrain ENUM('DIESEL', 'EV', 'GASOLINE') NOT NULL,
    fuel_level_pct DECIMAL(5,2) NULL,
    battery_pct DECIMAL(5,2) NULL,
    odometer_km DECIMAL(10,2) DEFAULT 0.0,
    engine_hours DECIMAL(8,2) DEFAULT 0.0,
    status ENUM('MOVING', 'IDLE', 'STOPPED', 'IN_MAINTENANCE') DEFAULT 'IDLE',
    assigned_driver_id VARCHAR(32) NULL,
    current_lat DECIMAL(10,6),
    current_lng DECIMAL(10,6),
    current_speed_kmh DECIMAL(5,2) DEFAULT 0.0,
    current_heading INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- 3. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(32) PRIMARY KEY,
    vehicle_id VARCHAR(32) NOT NULL,
    driver_id VARCHAR(32) NOT NULL,
    origin VARCHAR(120) NOT NULL,
    destination VARCHAR(120) NOT NULL,
    distance_km DECIMAL(8,2) NOT NULL,
    eta_time VARCHAR(50) NOT NULL,
    status ENUM('SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'DELAYED', 'CANCELLED') DEFAULT 'SCHEDULED',
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- 4. ALERTS & NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(32) NOT NULL,
    alert_type ENUM('OVERSPEED', 'DMS_DROWSINESS', 'DMS_DISTRACTION', 'FORWARD_COLLISION', 'GEOFENCE_BREACH', 'MAINTENANCE_DUE') NOT NULL,
    severity ENUM('CRITICAL', 'WARNING', 'INFO') NOT NULL,
    message TEXT NOT NULL,
    speed_kmh DECIMAL(5,2),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 5. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS maintenance_records (
    id VARCHAR(32) PRIMARY KEY,
    vehicle_id VARCHAR(32) NOT NULL,
    service_type ENUM('OIL_CHANGE', 'BRAKE_INSPECTION', 'TIRE_ROTATION', 'BATTERY_DIAGNOSTIC', 'ENGINE_OVERHAUL', 'SAFETY_AUDIT') NOT NULL,
    service_date DATE NOT NULL,
    cost_usd DECIMAL(10,2) DEFAULT 0.00,
    technician_notes TEXT,
    status ENUM('DUE_SOON', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'DUE_SOON',
    odometer_at_service DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- SAMPLE INITIAL SEED DATA
INSERT IGNORE INTO drivers (id, name, license_number, phone, avatar_url, safety_score, shift_start, hours_driven_today, status) VALUES
('DRV-001', 'Marcus Vance', 'CDL-984210', '+1 (415) 555-0182', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 94, '06:00 AM', 5.4, 'ON_TRIP'),
('DRV-002', 'Elena Rostova', 'CDL-334189', '+1 (510) 555-0914', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 98, '07:30 AM', 4.1, 'ON_TRIP'),
('DRV-003', 'Darius Miller', 'DL-887412', '+1 (415) 555-0399', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 84, '08:00 AM', 6.2, 'ON_TRIP');
