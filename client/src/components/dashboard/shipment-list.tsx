import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/hooks/use-locale";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Shipment } from "@shared/schema";
import { Link } from "wouter";
import { Package, Calendar, User, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ShipmentStatusBadge({ status }: { status: string }) {
  const { t } = useLocale();
  
  let colorClass = "";
  
  switch(status) {
    case "delivered":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "in_transit":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    case "pending":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
  }
  
  return (
    <Badge variant="outline" className={`px-2 text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {t(`shipment.status.${status}`)}
    </Badge>
  );
}

export function ShipmentList() {
  const { t } = useLocale();
  
  const { data: shipments, isLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments/active"],
  });
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white h-24 rounded-md"></div>
        ))}
      </div>
    );
  }
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard.active_shipments")}</h2>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          {t("shipment.add_new")}
        </Button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {shipments && shipments.length > 0 ? (
            shipments.map((shipment) => (
              <li key={shipment.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary truncate">
                          {t("shipment.number", { id: shipment.id })} - {shipment.origin} {t("common.to")} {shipment.destination}
                        </p>
                        <div className="mr-2 flex-shrink-0 flex">
                          <ShipmentStatusBadge status={shipment.status} />
                        </div>
                      </div>
                      <div className="mr-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">
                          {t("shipment.delivery_date")}: {formatDate(shipment.deliveryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 ml-1.5 h-5 w-5 text-gray-400" />
                          {t("shipment.shipped_date")}: {formatDate(shipment.createdAt)}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:mr-6">
                          <User className="flex-shrink-0 ml-1.5 h-5 w-5 text-gray-400" />
                          {t("shipment.driver")}: {shipment.driverName || t("shipment.unassigned")}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <File className="flex-shrink-0 ml-1.5 h-5 w-5 text-gray-400" />
                        {t("shipment.client")}: {shipment.clientName}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              {t("shipment.no_active_shipments")}
            </li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-3 text-left sm:px-6">
          <Link href="/shipments">
            <Button variant="outline" className="text-primary">
              {t("shipment.view_all")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
