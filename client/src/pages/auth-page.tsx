import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Redirect } from "wouter";
import { useLocale } from "@/hooks/use-locale";
import { Helmet } from "react-helmet";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const { t } = useLocale();
  
  // Redirect to dashboard if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }
  
  return (
    <>
      <Helmet>
        <title>{t("auth.page_title")} | {t("app.title")}</title>
      </Helmet>
      <AuthCard />
    </>
  );
}
