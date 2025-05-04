import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { db } from "@db";
import { eq, desc, and, sql, isNotNull, or } from "drizzle-orm";
import { 
  shipments, 
  vehicles, 
  drivers, 
  clients, 
  activities,
  shipmentStatusEnum,
  vehicleStatusEnum,
  driverStatusEnum
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API Endpoints
  const apiPrefix = "/api";

  // Dashboard stats
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      // Get total active shipments
      const shipmentsCount = await db.select({ count: sql<number>`count(*)` })
        .from(shipments)
        .where(or(
          eq(shipments.status, "pending"),
          eq(shipments.status, "in_transit")
        ))
        .then(result => result[0]?.count || 0);
      
      // Get active vehicles
      const vehiclesCount = await db.select({ count: sql<number>`count(*)` })
        .from(vehicles)
        .where(eq(vehicles.status, "active"))
        .then(result => result[0]?.count || 0);
      
      // Get available drivers
      const driversCount = await db.select({ count: sql<number>`count(*)` })
        .from(drivers)
        .where(eq(drivers.status, "available"))
        .then(result => result[0]?.count || 0);
      
      // Mock monthly revenue for now
      const monthlyRevenue = 125400;
      
      res.json({
        totalShipments: shipmentsCount,
        activeVehicles: vehiclesCount,
        availableDrivers: driversCount,
        monthlyRevenue: monthlyRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Active shipments
  app.get(`${apiPrefix}/shipments/active`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const results = await db.query.shipments.findMany({
        where: or(
          eq(shipments.status, "pending"),
          eq(shipments.status, "in_transit")
        ),
        orderBy: [desc(shipments.createdAt)],
        limit: 5,
        with: {
          client: true,
          driver: true,
        },
      });
      
      const formattedShipments = results.map(shipment => ({
        ...shipment,
        clientName: shipment.client?.name || '',
        driverName: shipment.driver?.name || '',
      }));
      
      res.json(formattedShipments);
    } catch (error) {
      console.error("Error fetching active shipments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Vehicle stats
  app.get(`${apiPrefix}/vehicles/stats`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const activeCount = await db.select({ count: sql<number>`count(*)` })
        .from(vehicles)
        .where(eq(vehicles.status, "active"))
        .then(result => result[0]?.count || 0);
      
      const maintenanceCount = await db.select({ count: sql<number>`count(*)` })
        .from(vehicles)
        .where(eq(vehicles.status, "maintenance"))
        .then(result => result[0]?.count || 0);
      
      const inactiveCount = await db.select({ count: sql<number>`count(*)` })
        .from(vehicles)
        .where(eq(vehicles.status, "inactive"))
        .then(result => result[0]?.count || 0);
      
      res.json({
        active: activeCount,
        maintenance: maintenanceCount,
        inactive: inactiveCount,
      });
    } catch (error) {
      console.error("Error fetching vehicle stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Vehicles maintenance due
  app.get(`${apiPrefix}/vehicles/maintenance-due`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const results = await db.query.vehicles.findMany({
        where: eq(vehicles.status, "active"),
        orderBy: [vehicles.lastMaintenanceDate],
        limit: 2,
      });
      
      const formattedVehicles = results.map(vehicle => {
        // Calculate days since last maintenance
        const lastMaintenance = vehicle.lastMaintenanceDate 
          ? new Date(vehicle.lastMaintenanceDate) 
          : new Date(Date.now() - 45 * 24 * 60 * 60 * 1000); // 45 days ago if no data
        
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastMaintenance.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          ...vehicle,
          daysSinceLastMaintenance: diffDays,
        };
      });
      
      res.json(formattedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles needing maintenance:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Driver stats
  app.get(`${apiPrefix}/drivers/stats`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const availableCount = await db.select({ count: sql<number>`count(*)` })
        .from(drivers)
        .where(eq(drivers.status, "available"))
        .then(result => result[0]?.count || 0);
      
      const onMissionCount = await db.select({ count: sql<number>`count(*)` })
        .from(drivers)
        .where(eq(drivers.status, "on_mission"))
        .then(result => result[0]?.count || 0);
      
      const onLeaveCount = await db.select({ count: sql<number>`count(*)` })
        .from(drivers)
        .where(eq(drivers.status, "on_leave"))
        .then(result => result[0]?.count || 0);
      
      res.json({
        available: availableCount,
        onMission: onMissionCount,
        onLeave: onLeaveCount,
      });
    } catch (error) {
      console.error("Error fetching driver stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Top drivers
  app.get(`${apiPrefix}/drivers/top`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const results = await db.query.drivers.findMany({
        orderBy: [desc(drivers.rating)],
        limit: 2,
      });
      
      // Add trip count data for display
      const formattedDrivers = results.map((driver, index) => ({
        ...driver,
        completedTrips: index === 0 ? 28 : 25, // Sample data
      }));
      
      res.json(formattedDrivers);
    } catch (error) {
      console.error("Error fetching top drivers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Recent activities
  app.get(`${apiPrefix}/activities`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const results = await db.query.activities.findMany({
        orderBy: [desc(activities.createdAt)],
        limit: 3,
      });
      
      res.json(results);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
