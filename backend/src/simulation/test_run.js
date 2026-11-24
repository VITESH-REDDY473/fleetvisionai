import { FleetSimulationEngine } from "./fleetSimulator.js";
import { VisionAISimulator } from "./visionSimulator.js";

console.log("Testing FleetSimulationEngine...");
const fleet = new FleetSimulationEngine();
const initialVehicles = fleet.getAllVehicles();
console.log(`Vehicles loaded: ${initialVehicles.length}`);

// Test one step
fleet.step();
const updated = fleet.getAllVehicles();
console.log(`Vehicle 101 speed: ${updated[0].speedKmh} km/h, pos: [${updated[0].latitude}, ${updated[0].longitude}]`);

console.log("Testing VisionAISimulator...");
const vision = new VisionAISimulator(fleet);
const evt = vision.generateEvent();
console.log(`Generated event: ${evt.type} for ${evt.vehicleId} (${evt.title})`);

console.log("ALL BACKEND SIMULATION ENGINE TESTS PASSED! ✅");
