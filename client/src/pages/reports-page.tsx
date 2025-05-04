import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, PieChart, BarChart4, Calendar } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export default function ReportsPage() {
  const { t } = useLocale();

  const reports = [
    {
      title: t("reports.shipment_summary"),
      description: t("reports.shipment_summary_desc"),
      icon: <FileText className="h-8 w-8 text-primary" />,
      color: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: t("reports.driver_performance"),
      description: t("reports.driver_performance_desc"),
      icon: <BarChart4 className="h-8 w-8 text-secondary" />,
      color: "bg-indigo-50 dark:bg-indigo-950",
    },
    {
      title: t("reports.vehicle_maintenance"),
      description: t("reports.vehicle_maintenance_desc"),
      icon: <PieChart className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 dark:bg-green-950",
    },
    {
      title: t("reports.financial_reports"),
      description: t("reports.financial_reports_desc"),
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <MainLayout title={t("pages.reports")}>
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className={`p-2 rounded-md ${report.color}`}>{report.icon}</div>
              <div className="space-y-1">
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">
                  {t("common.preview")}
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {t("common.download")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}