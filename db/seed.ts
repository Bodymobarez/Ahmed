import { db } from "./index";
import { 
  users, 
  vehicles, 
  drivers, 
  clients, 
  shipments, 
  activities,
  expenses,
  employeeRoleEnum,
  employees,
  maintenanceRecords
} from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if users already exist to avoid duplicates
    const existingUsers = await db.query.users.findMany({
      limit: 1
    });

    if (existingUsers.length > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }

    // Create admin user
    const adminUser = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin123"),
      fullName: "أحمد محمد",
      email: "admin@shipping-erp.com",
      role: "admin"
    }).returning();
    
    console.log("Created admin user");

    // Create clients
    const clientsData = [
      {
        name: "شركة التوريدات المتحدة",
        contactPerson: "محمد الأحمد",
        phone: "+966512345678",
        email: "info@united-supplies.com",
        address: "الرياض، حي العليا، شارع التخصصي"
      },
      {
        name: "مصنع الشرق للأغذية",
        contactPerson: "خالد العتيبي",
        phone: "+966523456789",
        email: "info@east-food.com",
        address: "الدمام، المنطقة الصناعية"
      },
      {
        name: "مجموعة السعد التجارية",
        contactPerson: "سعد الحارثي",
        phone: "+966534567890",
        email: "info@alsaad-trading.com",
        address: "جدة، حي الروضة"
      }
    ];

    const createdClients = await db.insert(clients).values(clientsData).returning();
    console.log(`Created ${createdClients.length} clients`);
    
    // Create vehicles
    const vehiclesData = [
      {
        model: "مرسيدس أكتروس",
        type: "شاحنة كبيرة",
        licensePlate: "HTK 4172",
        status: "active",
        manufactureYear: 2020,
        lastMaintenanceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
      },
      {
        model: "فولفو FH",
        type: "شاحنة كبيرة",
        licensePlate: "GTA 7281",
        status: "active",
        manufactureYear: 2021,
        lastMaintenanceDate: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000) // 38 days ago
      },
      {
        model: "ايسوزو NPR",
        type: "شاحنة متوسطة",
        licensePlate: "LKT 5531",
        status: "maintenance",
        manufactureYear: 2019,
        lastMaintenanceDate: new Date()
      },
      {
        model: "مان TGX",
        type: "شاحنة كبيرة",
        licensePlate: "RTS 9921",
        status: "active",
        manufactureYear: 2020,
        lastMaintenanceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        model: "تويوتا هايس",
        type: "فان",
        licensePlate: "PWQ 3391",
        status: "active",
        manufactureYear: 2022,
        lastMaintenanceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdVehicles = await db.insert(vehicles).values(vehiclesData).returning();
    console.log(`Created ${createdVehicles.length} vehicles`);

    // Create drivers
    const driversData = [
      {
        name: "خالد العنزي",
        phone: "+966512345678",
        licenseNumber: "SA10029382",
        licenseExpiry: new Date(2024, 11, 30),
        status: "available",
        rating: 5.0,
      },
      {
        name: "محمد عبدالله",
        phone: "+966523456789",
        licenseNumber: "SA20038471",
        licenseExpiry: new Date(2025, 5, 15),
        status: "on_mission",
        rating: 4.8,
      },
      {
        name: "أحمد الشمري",
        phone: "+966534567890",
        licenseNumber: "SA30047562",
        licenseExpiry: new Date(2025, 2, 28),
        status: "available",
        rating: 4.5,
      }
    ];

    const createdDrivers = await db.insert(drivers).values(driversData).returning();
    console.log(`Created ${createdDrivers.length} drivers`);

    // Create shipments
    const shipmentsData = [
      {
        clientId: createdClients[0].id,
        driverId: createdDrivers[1].id,
        vehicleId: createdVehicles[0].id,
        origin: "الرياض",
        destination: "جدة",
        status: "in_transit",
        weight: 1500,
        description: "مواد بناء وأدوات كهربائية",
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: createdClients[1].id,
        driverId: createdDrivers[0].id,
        vehicleId: createdVehicles[1].id,
        origin: "الدمام",
        destination: "الرياض",
        status: "in_transit",
        weight: 2000,
        description: "مواد غذائية مبردة",
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: createdClients[2].id,
        driverId: null,
        vehicleId: null,
        origin: "الرياض",
        destination: "المدينة",
        status: "pending",
        weight: 1000,
        description: "أجهزة إلكترونية",
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      }
    ];

    const createdShipments = await db.insert(shipments).values(shipmentsData).returning();
    console.log(`Created ${createdShipments.length} shipments`);

    // Add maintenance records
    const maintenanceData = [
      {
        vehicleId: createdVehicles[0].id,
        description: "صيانة دورية وتغيير زيت",
        cost: 1500,
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        performedBy: "ورشة الفارس للصيانة"
      },
      {
        vehicleId: createdVehicles[1].id,
        description: "فحص شامل وتغيير فلاتر",
        cost: 2000,
        date: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
        performedBy: "مركز خدمة فولفو"
      },
      {
        vehicleId: createdVehicles[2].id,
        description: "إصلاح نظام التبريد",
        cost: 3500,
        date: new Date(),
        performedBy: "مركز الصيانة الرئيسي"
      }
    ];

    await db.insert(maintenanceRecords).values(maintenanceData);
    console.log("Created maintenance records");

    // Add employees
    const employeesData = [
      {
        userId: adminUser[0].id,
        name: "أحمد محمد",
        position: "مدير النظام",
        role: "admin",
        phone: "+966512345678",
        email: "admin@shipping-erp.com",
        salary: 15000,
        hireDate: new Date(2021, 1, 15)
      },
      {
        name: "سارة العتيبي",
        position: "محاسب",
        role: "accountant",
        phone: "+966523456789",
        email: "sarah@shipping-erp.com",
        salary: 12000,
        hireDate: new Date(2021, 3, 10)
      },
      {
        name: "فهد الحربي",
        position: "مدير الموارد البشرية",
        role: "hr",
        phone: "+966534567890",
        email: "fahad@shipping-erp.com",
        salary: 13000,
        hireDate: new Date(2021, 2, 20)
      }
    ];

    await db.insert(employees).values(employeesData);
    console.log("Created employees");

    // Add recent activities
    const activitiesData = [
      {
        type: "shipment_delivered",
        title: "تم تسليم الشحنة #34718",
        description: "تم تسليم الشحنة بواسطة محمد عبدالله إلى شركة التوريدات المتحدة",
        userId: adminUser[0].id,
        referenceId: 34718,
        referenceType: "shipment",
        createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        type: "shipment_created",
        title: "تم إنشاء شحنة جديدة #34729",
        description: "تم إنشاء شحنة جديدة من الرياض إلى المدينة",
        userId: adminUser[0].id,
        referenceId: 34729,
        referenceType: "shipment",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: "maintenance_alert",
        title: "تنبيه صيانة للمركبة HTK 4172",
        description: "المركبة مرسيدس أكتروس - HTK 4172 تحتاج إلى صيانة دورية",
        userId: adminUser[0].id,
        referenceId: createdVehicles[0].id,
        referenceType: "vehicle",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];

    await db.insert(activities).values(activitiesData);
    console.log("Created activity logs");

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
