import { useState } from "react";
import { Header } from "@/components/layout/header";
import { SidebarNavigation } from "@/components/sidebar-nav";
import { useLocale } from "@/hooks/use-locale";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
  const { t } = useLocale();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="flex h-screen overflow-hidden" data-implementation="Main layout container">
      {/* Sidebar for desktop */}
      <div className={`${isMobile ? 'hidden' : 'flex md:flex-shrink-0'}`}>
        <SidebarNavigation />
      </div>
      
      {/* Mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={toggleSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-dark">
            <div className="absolute top-0 left-0 -ml-12 pt-2">
              <button
                onClick={toggleSidebar}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">{t("common.close_menu")}</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarNavigation />
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 max-w-full max-h-full overflow-hidden">
        <Header title={title} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-100 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
