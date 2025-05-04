import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useLocale } from "@/hooks/use-locale";
import { Card, CardContent } from "@/components/ui/card";

export function AuthCard() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { t } = useLocale();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6">{t("app.title")}</h1>
          <p className="text-xl mb-8">{t("auth.welcome_message")}</p>
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{t("auth.features")}</h2>
            <ul className="space-y-2 text-start">
              <li className="flex items-center">
                <svg className="w-5 h-5 ml-2 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {t("auth.feature_shipments")}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 ml-2 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {t("auth.feature_vehicles")}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 ml-2 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {t("auth.feature_drivers")}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 ml-2 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {t("auth.feature_accounting")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
