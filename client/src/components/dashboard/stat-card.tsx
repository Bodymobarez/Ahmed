import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  linkText: string;
  linkUrl: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  linkText,
  linkUrl,
  className,
}: StatCardProps) {
  const { t } = useLocale();
  
  return (
    <Card className={cn("bg-white overflow-hidden shadow rounded-lg", className)}>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-light rounded-md p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="mr-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkUrl} className="font-medium text-primary hover:text-primary-dark">
            {linkText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
