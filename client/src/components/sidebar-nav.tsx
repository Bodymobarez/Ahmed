import { useLocation, useRoute } from "wouter";
import { useLocale } from "@/hooks/use-locale";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarFooter,
  SidebarLink,
} from "@/components/ui/sidebar";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Package,
  Truck,
  Users,
  Users2,
  Wallet,
  BarChart4,
  Settings,
} from "lucide-react";

export function SidebarNavigation() {
  const [location, setLocation] = useLocation();
  const { t } = useLocale();
  const { user, logoutMutation } = useAuth();

  const navigation = [
    {
      name: t("sidebar.dashboard"),
      href: "/",
      icon: <Home className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.shipments"),
      href: "/shipments",
      icon: <Package className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.vehicles"),
      href: "/vehicles",
      icon: <Truck className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.drivers"),
      href: "/drivers",
      icon: <Users className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.hr"),
      href: "/hr",
      icon: <Users2 className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.accounting"),
      href: "/accounting",
      icon: <Wallet className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.reports"),
      href: "/reports",
      icon: <BarChart4 className="ml-3 h-6 w-6" />,
    },
    {
      name: t("sidebar.settings"),
      href: "/settings",
      icon: <Settings className="ml-3 h-6 w-6" />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-xl font-bold">{t("app.title")}</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav>
          {navigation.map((item) => (
            <SidebarLink 
              key={item.name} 
              active={location === item.href}
              onClick={() => setLocation(item.href)}
              className="cursor-pointer"
            >
              {item.icon}
              {item.name}
            </SidebarLink>
          ))}
        </SidebarNav>
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src="https://randomuser.me/api/portraits/men/61.jpg"
                  alt={user.username}
                />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="mr-3">
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="text-xs font-medium text-gray-300">{t('user.role')}</p>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
