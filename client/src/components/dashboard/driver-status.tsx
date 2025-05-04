import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Driver } from "@shared/schema";
import { Star, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DriverRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const remainingStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - remainingStar;
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
        {[...Array(remainingStar)].map((_, i) => (
          <StarIcon key={`half-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
      <span className="mr-2 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export function DriverStatus() {
  const { t } = useLocale();
  
  const { data: driverStats } = useQuery<{
    available: number;
    onMission: number;
    onLeave: number;
  }>({
    queryKey: ["/api/drivers/stats"],
  });
  
  const { data: topDrivers, isLoading } = useQuery<Driver[]>({
    queryKey: ["/api/drivers/top"],
  });
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard.drivers")}</h2>
        <Button 
          variant="outline" 
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-primary-light/90"
        >
          {t("driver.manage")}
        </Button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-md font-medium leading-6 text-gray-900">{t("driver.performance")}</h3>
          <div className="flex space-x-2 space-x-reverse">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {t("driver.available")}: {driverStats?.available || 0}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {t("driver.on_mission")}: {driverStats?.onMission || 0}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {t("driver.on_leave")}: {driverStats?.onLeave || 0}
            </Badge>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <h4 className="text-sm font-medium text-gray-500">{t("driver.top_performers")}</h4>
          </div>
          <ul className="divide-y divide-gray-200">
            {isLoading ? (
              <li className="px-4 py-3 flex items-center justify-between animate-pulse">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="mr-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </li>
            ) : topDrivers && topDrivers.length > 0 ? (
              topDrivers.map((driver) => (
                <li key={driver.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar>
                        <AvatarImage src={driver.avatar || `https://randomuser.me/api/portraits/men/${driver.id}.jpg`} alt={driver.name} />
                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-500">{t("driver.completed_trips", { count: driver.completedTrips || 0 })}</p>
                    </div>
                  </div>
                  <DriverRating rating={driver.rating || 0} />
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500">
                {t("driver.no_data")}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
