import { pgTable, text, serial, integer, boolean, timestamp, decimal, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(2, "Username must be at least 2 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vehicle statuses
export const vehicleStatusEnum = pgEnum("vehicle_status", ["active", "maintenance", "inactive"]);

// Vehicles schema
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  model: text("model").notNull(),
  type: text("type").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  status: vehicleStatusEnum("status").default("active").notNull(),
  manufactureYear: integer("manufacture_year"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  maintenanceRecords: many(maintenanceRecords),
  shipments: many(shipments),
}));

export const insertVehicleSchema = createInsertSchema(vehicles, {
  model: (schema) => schema.min(2, "Model must be at least 2 characters"),
  type: (schema) => schema.min(2, "Type must be at least 2 characters"),
  licensePlate: (schema) => schema.min(2, "License plate must be at least 2 characters"),
});
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect & {
  daysSinceLastMaintenance?: number;
};

// Maintenance records schema
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  description: text("description").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  performedBy: text("performed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const maintenanceRecordsRelations = relations(maintenanceRecords, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [maintenanceRecords.vehicleId],
    references: [vehicles.id],
  }),
}));

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords, {
  description: (schema) => schema.min(3, "Description must be at least 3 characters"),
});
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;

// Driver statuses
export const driverStatusEnum = pgEnum("driver_status", ["available", "on_mission", "on_leave"]);

// Drivers schema
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  licenseExpiry: timestamp("license_expiry").notNull(),
  status: driverStatusEnum("status").default("available").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("5.0"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const driversRelations = relations(drivers, ({ many }) => ({
  shipments: many(shipments),
  attendanceRecords: many(driverAttendance),
}));

export const insertDriverSchema = createInsertSchema(drivers, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  phone: (schema) => schema.min(6, "Phone must be at least 6 characters"),
  licenseNumber: (schema) => schema.min(4, "License number must be at least 4 characters"),
});
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect & {
  completedTrips?: number;
};

// Driver attendance schema
export const driverAttendance = pgTable("driver_attendance", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull().references(() => drivers.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const driverAttendanceRelations = relations(driverAttendance, ({ one }) => ({
  driver: one(drivers, {
    fields: [driverAttendance.driverId],
    references: [drivers.id],
  }),
}));

export const insertDriverAttendanceSchema = createInsertSchema(driverAttendance);
export type InsertDriverAttendance = z.infer<typeof insertDriverAttendanceSchema>;
export type DriverAttendance = typeof driverAttendance.$inferSelect;

// Clients schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  shipments: many(shipments),
  invoices: many(invoices),
}));

export const insertClientSchema = createInsertSchema(clients, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  phone: (schema) => schema.min(6, "Phone must be at least 6 characters"),
  address: (schema) => schema.min(4, "Address must be at least 4 characters"),
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Shipment statuses
export const shipmentStatusEnum = pgEnum("shipment_status", ["pending", "in_transit", "delivered", "canceled"]);

// Shipments schema
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  driverId: integer("driver_id").references(() => drivers.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  status: shipmentStatusEnum("status").default("pending").notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  description: text("description"),
  deliveryDate: timestamp("delivery_date"),
  deliveredAt: timestamp("delivered_at"),
  proofOfDelivery: text("proof_of_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  client: one(clients, {
    fields: [shipments.clientId],
    references: [clients.id],
  }),
  driver: one(drivers, {
    fields: [shipments.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [shipments.vehicleId],
    references: [vehicles.id],
  }),
}));

export const insertShipmentSchema = createInsertSchema(shipments, {
  origin: (schema) => schema.min(2, "Origin must be at least 2 characters"),
  destination: (schema) => schema.min(2, "Destination must be at least 2 characters"),
});
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect & {
  driverName?: string;
  clientName?: string;
};

// Employee roles
export const employeeRoleEnum = pgEnum("employee_role", ["admin", "manager", "accountant", "hr", "staff"]);

// Employees schema
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  position: text("position").notNull(),
  role: employeeRoleEnum("role").default("staff").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  hireDate: timestamp("hire_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  attendanceRecords: many(employeeAttendance),
}));

export const insertEmployeeSchema = createInsertSchema(employees, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  position: (schema) => schema.min(2, "Position must be at least 2 characters"),
  phone: (schema) => schema.min(6, "Phone must be at least 6 characters"),
});
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Employee attendance schema
export const employeeAttendance = pgTable("employee_attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const employeeAttendanceRelations = relations(employeeAttendance, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeAttendance.employeeId],
    references: [employees.id],
  }),
}));

export const insertEmployeeAttendanceSchema = createInsertSchema(employeeAttendance);
export type InsertEmployeeAttendance = z.infer<typeof insertEmployeeAttendanceSchema>;
export type EmployeeAttendance = typeof employeeAttendance.$inferSelect;

// Invoices schema
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  shipmentId: integer("shipment_id").references(() => shipments.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("unpaid").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  shipment: one(shipments, {
    fields: [invoices.shipmentId],
    references: [shipments.id],
  }),
}));

export const insertInvoiceSchema = createInsertSchema(invoices);
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Expenses schema
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  approvedBy: integer("approved_by").references(() => employees.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  approver: one(employees, {
    fields: [expenses.approvedBy],
    references: [employees.id],
  }),
  vehicle: one(vehicles, {
    fields: [expenses.vehicleId],
    references: [vehicles.id],
  }),
}));

export const insertExpenseSchema = createInsertSchema(expenses, {
  category: (schema) => schema.min(2, "Category must be at least 2 characters"),
});
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// Activity types
export const activityTypeEnum = pgEnum("activity_type", [
  "shipment_created", 
  "shipment_delivered",
  "shipment_assigned",
  "vehicle_maintenance",
  "maintenance_alert",
  "driver_status_change",
  "invoice_created",
  "invoice_paid"
]);

// Activity log schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: activityTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").references(() => users.id),
  referenceId: integer("reference_id"),
  referenceType: text("reference_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const insertActivitySchema = createInsertSchema(activities, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  description: (schema) => schema.min(2, "Description must be at least 2 characters"),
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
