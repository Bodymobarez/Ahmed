import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Vehicle } from "@shared/schema";
import { Truck } from "lucide-react";

export function VehicleStatus() {
  const { t } = useLocale();
  
  const { data: vehicleStats } = useQuery<{
    active: number;
    maintenance: number;
    inactive: number;
  }>({
    queryKey: ["/api/vehicles/stats"],
  });
  
  const { data: maintenanceVehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles/maintenance-due"],
  });
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard.vehicle_status")}</h2>
        <Button 
          variant="outline" 
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-primary-light/90"
        >
          {t("vehicle.manage")}
        </Button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-md font-medium leading-6 text-gray-900">{t("vehicle.status_summary")}</h3>
          <div className="flex space-x-2 space-x-reverse">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {t("vehicle.active")}: {vehicleStats?.active || 0}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {t("vehicle.maintenance")}: {vehicleStats?.maintenance || 0}
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {t("vehicle.inactive")}: {vehicleStats?.inactive || 0}
            </Badge>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <h4 className="text-sm font-medium text-gray-500">{t("vehicle.maintenance_needed")}</h4>
          </div>
          <ul className="divide-y divide-gray-200">
            {isLoading ? (
              <li className="px-4 py-3 flex items-center justify-between animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/5"></div>
              </li>
            ) : maintenanceVehicles && maintenanceVehicles.length > 0 ? (
              maintenanceVehicles.map((vehicle) => (
                <li key={vehicle.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-900">{vehicle.model} - {t("vehicle.plate", { plate: vehicle.licensePlate })}</p>
                      <p className="text-sm text-gray-500">{t("vehicle.last_maintenance", { days: vehicle.daysSinceLastMaintenance || 0 })}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" className="text-primary hover:bg-primary-light">
                      {t("vehicle.schedule_maintenance")}
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500">
                {t("vehicle.no_maintenance_needed")}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
