import { useLocale } from "@/hooks/use-locale";
import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ShipmentList } from "@/components/dashboard/shipment-list";
import { VehicleStatus } from "@/components/dashboard/vehicle-status";
import { DriverStatus } from "@/components/dashboard/driver-status";
import { ActivityLog } from "@/components/dashboard/activity-log";
import { Package, Truck, Users, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

interface DashboardStats {
  totalShipments: number;
  activeVehicles: number;
  availableDrivers: number;
  monthlyRevenue: number;
}

export default function DashboardPage() {
  const { t } = useLocale();
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });
  
  return (
    <>
      <Helmet>
        <title>{t("dashboard.page_title")} | {t("app.title")}</title>
      </Helmet>
      <MainLayout title={t("dashboard.title")}>
        {/* Statistics overview */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("dashboard.total_shipments")}
              value={isLoading ? "..." : stats?.totalShipments || 0}
              icon={Package}
              linkText={t("dashboard.view_all_shipments")}
              linkUrl="/shipments"
            />
            <StatCard
              title={t("dashboard.active_vehicles")}
              value={isLoading ? "..." : stats?.activeVehicles || 0}
              icon={Truck}
              linkText={t("dashboard.view_all_vehicles")}
              linkUrl="/vehicles"
            />
            <StatCard
              title={t("dashboard.available_drivers")}
              value={isLoading ? "..." : stats?.availableDrivers || 0}
              icon={Users}
              linkText={t("dashboard.view_all_drivers")}
              linkUrl="/drivers"
            />
            <StatCard
              title={t("dashboard.monthly_revenue")}
              value={isLoading ? "..." : `${stats?.monthlyRevenue?.toLocaleString() || 0} ${t("common.currency")}`}
              icon={Wallet}
              linkText={t("dashboard.view_financial_reports")}
              linkUrl="/accounting"
            />
          </div>
        </section>
        
        {/* Active shipments section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <ShipmentList />
        </section>
        
        {/* Vehicles and Drivers section */}
        <div className="mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VehicleStatus />
          <DriverStatus />
        </div>
        
        {/* Recent Activity */}
        <div className="px-4 sm:px-6 lg:px-8">
          <ActivityLog />
        </div>
      </MainLayout>
    </>
  );
}
