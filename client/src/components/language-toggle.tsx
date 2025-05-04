import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

export function LanguageToggle() {
  const { locale, changeLocale, t } = useLocale();

  const toggleLanguage = () => {
    changeLocale(locale === "ar" ? "en" : "ar");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="p-1 rounded-full text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <span className="sr-only">{t("common.change_language")}</span>
      <span className="font-medium text-sm">
        {locale === "ar" ? "العربية" : "English"}
      </span>
    </Button>
  );
}
