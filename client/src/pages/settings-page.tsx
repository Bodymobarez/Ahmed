import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, User, Moon, Languages, Shield, Globe, Key } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useState } from "react";

export default function SettingsPage() {
  const { t, locale, changeLocale } = useLocale();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weeklySummary: true,
  });

  const handleLanguageChange = (value: string) => {
    changeLocale(value);
  };

  return (
    <MainLayout title={t("pages.settings")}>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="mr-2 h-4 w-4" />
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            {t("settings.security")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile_settings")}</CardTitle>
              <CardDescription>
                {t("settings.profile_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.name")}</Label>
                  <Input id="name" defaultValue="أحمد محمد" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input id="email" defaultValue="admin@shipping-erp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.phone")}</Label>
                  <Input id="phone" defaultValue="+966512345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{t("settings.position")}</Label>
                  <Input id="position" defaultValue="مدير النظام" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bio">{t("settings.bio")}</Label>
                <Input id="bio" defaultValue={t("settings.bio_placeholder")} />
              </div>

              <div className="flex justify-end">
                <Button>{t("common.save_changes")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance_settings")}</CardTitle>
              <CardDescription>
                {t("settings.appearance_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">{t("settings.dark_mode")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.dark_mode_desc")}
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label>{t("settings.language")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.language_desc")}
                  </p>
                </div>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Button
                    variant={locale === "ar" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("ar")}
                    className="flex-1"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    العربية
                  </Button>
                  <Button
                    variant={locale === "en" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("en")}
                    className="flex-1"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notification_settings")}</CardTitle>
              <CardDescription>
                {t("settings.notification_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("settings.email_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.email_notifications_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("settings.push_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.push_notifications_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("settings.sms_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.sms_notifications_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("settings.weekly_summary")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.weekly_summary_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklySummary}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklySummary: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security_settings")}</CardTitle>
              <CardDescription>
                {t("settings.security_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t("settings.current_password")}</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("settings.new_password")}</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("settings.confirm_password")}</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label>{t("settings.two_factor")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.two_factor_desc")}
                  </p>
                </div>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  {t("settings.setup_2fa")}
                </Button>
              </div>

              <div className="flex justify-end">
                <Button>{t("common.save_changes")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}