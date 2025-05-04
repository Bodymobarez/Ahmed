import { db } from "@db";
import { 
  users, 
  vehicles, 
  drivers, 
  shipments, 
  clients, 
  employees, 
  invoices, 
  activities,
  expenses,
  maintenanceRecords,
  driverAttendance,
  employeeAttendance,
  User,
  InsertUser
} from "@shared/schema";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User related operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    return result;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Vehicles operations
  async getVehicles(limit = 10, offset = 0) {
    return db.query.vehicles.findMany({
      limit,
      offset,
      orderBy: vehicles.id
    });
  }

  async getVehicleById(id: number) {
    return db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
      with: {
        maintenanceRecords: true,
        shipments: true
      }
    });
  }

  // Drivers operations
  async getDrivers(limit = 10, offset = 0) {
    return db.query.drivers.findMany({
      limit,
      offset,
      orderBy: drivers.id
    });
  }

  async getDriverById(id: number) {
    return db.query.drivers.findFirst({
      where: eq(drivers.id, id),
      with: {
        shipments: true,
        attendanceRecords: true
      }
    });
  }

  // Shipments operations
  async getShipments(limit = 10, offset = 0) {
    return db.query.shipments.findMany({
      limit,
      offset,
      orderBy: shipments.id,
      with: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  }

  async getShipmentById(id: number) {
    return db.query.shipments.findFirst({
      where: eq(shipments.id, id),
      with: {
        client: true,
        driver: true,
        vehicle: true
      }
    });
  }

  // Client operations
  async getClients(limit = 10, offset = 0) {
    return db.query.clients.findMany({
      limit,
      offset,
      orderBy: clients.id
    });
  }

  async getClientById(id: number) {
    return db.query.clients.findFirst({
      where: eq(clients.id, id),
      with: {
        shipments: true,
        invoices: true
      }
    });
  }

  // Employee operations
  async getEmployees(limit = 10, offset = 0) {
    return db.query.employees.findMany({
      limit,
      offset,
      orderBy: employees.id,
      with: {
        user: true
      }
    });
  }

  async getEmployeeById(id: number) {
    return db.query.employees.findFirst({
      where: eq(employees.id, id),
      with: {
        user: true,
        attendanceRecords: true
      }
    });
  }

  // Invoice operations
  async getInvoices(limit = 10, offset = 0) {
    return db.query.invoices.findMany({
      limit,
      offset,
      orderBy: invoices.id,
      with: {
        client: true,
        shipment: true
      }
    });
  }

  async getInvoiceById(id: number) {
    return db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: {
        client: true,
        shipment: true
      }
    });
  }

  // Activity operations
  async getActivities(limit = 10, offset = 0) {
    return db.query.activities.findMany({
      limit,
      offset,
      orderBy: [{ column: activities.createdAt, order: 'desc' }],
      with: {
        user: true
      }
    });
  }
}

export const storage = new DatabaseStorage();
