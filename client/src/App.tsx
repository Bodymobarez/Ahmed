import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { LocaleProvider } from "@/components/locale-provider";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import VehiclesPage from "@/pages/vehicles-page";
import DriversPage from "@/pages/drivers-page";
import ShipmentsPage from "@/pages/shipments-page";
import HrPage from "@/pages/hr-page";
import AccountingPage from "@/pages/accounting-page";
import ReportsPage from "@/pages/reports-page";
import SettingsPage from "@/pages/settings-page";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/vehicles" component={VehiclesPage} />
      <ProtectedRoute path="/drivers" component={DriversPage} />
      <ProtectedRoute path="/shipments" component={ShipmentsPage} />
      <ProtectedRoute path="/hr" component={HrPage} />
      <ProtectedRoute path="/accounting" component={AccountingPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
