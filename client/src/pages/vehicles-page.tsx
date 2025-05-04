import { useLocale } from "@/hooks/use-locale";
import { MainLayout } from "@/components/layout/main-layout";
import { Helmet } from "react-helmet";

export default function VehiclesPage() {
  const { t } = useLocale();
  
  return (
    <>
      <Helmet>
        <title>{t("vehicle.page_title")} | {t("app.title")}</title>
      </Helmet>
      <MainLayout title={t("vehicle.title")}>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t("vehicle.management")}</h2>
            <p className="text-gray-500">{t("common.coming_soon")}</p>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
