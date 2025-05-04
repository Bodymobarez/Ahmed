import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

export function Header({ title, toggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu" 
                aria-expanded="false"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="text-2xl text-primary-dark font-semibold">
                <h1>{title}</h1>
              </div>
            </div>
          </div>
          <div>
            <div className="mr-4 flex items-center">
              {/* Notification button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
              >
                <span className="sr-only">{t("header.show_notifications")}</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 mt-0 mr-0.5 rounded-full bg-destructive"></span>
              </Button>
              
              {/* Language toggle */}
              <div className="relative mr-4">
                <LanguageToggle />
              </div>
              
              {/* User dropdown (mobile only) */}
              <div className="relative mr-4 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-full text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <span className="sr-only">{t("header.open_user_menu")}</span>
                  <Avatar>
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/61.jpg"
                      alt={user?.username}
                    />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
