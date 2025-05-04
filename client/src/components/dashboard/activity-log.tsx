import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Activity } from "@shared/schema";
import { getRelativeTimeString } from "@/lib/utils";
import { Clock, Package, AlertTriangle, Truck, RefreshCw, Filter } from "lucide-react";

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "shipment_delivered":
      return (
        <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center">
          <Clock className="h-6 w-6 text-primary" />
        </div>
      );
    case "shipment_created":
      return (
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
      );
    case "maintenance_alert":
      return (
        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
      );
    default:
      return (
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Truck className="h-6 w-6 text-gray-600" />
        </div>
      );
  }
}

export function ActivityLog() {
  const { t, locale } = useLocale();
  
  const { data: activities, isLoading, refetch } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard.recent_activities")}</h2>
        <div className="flex space-x-3 space-x-reverse">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh")}
          </Button>
          <Button 
            variant="outline"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("common.filter")}
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <li key={i} className="block p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="min-w-0 flex-1 px-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                  </div>
                </div>
              </li>
            ))
          ) : activities && activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id}>
                <div className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="text-sm font-medium text-primary truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getRelativeTimeString(activity.createdAt, locale)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>{activity.description}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              {t("activity.no_activities")}
            </li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-3 text-left sm:px-6">
          <Button variant="outline" className="text-primary">
            {t("activity.view_all")}
          </Button>
        </div>
      </div>
    </section>
  );
}
