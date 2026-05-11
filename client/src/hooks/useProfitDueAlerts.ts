import { useMemo } from "react";
import { useSavingsCertificates } from "./useSavingsCertificates";

function getPeriodMonths(duration: string): number {
  switch (duration) {
    case "Monthly": return 1;
    case "6 Months": return 6;
    case "1 Year": return 12;
    case "5 Years": return 60;
    case "10 Years": return 120;
    default: return 0;
  }
}

function monthsBetween(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

export function useProfitDueAlerts() {
  const { certificates } = useSavingsCertificates();

  return useMemo(() => {
    let minDays: number | null = null;
    let dueCount = 0;

    for (const cert of certificates) {
      const periodMonths = getPeriodMonths(cert.duration);
      if (periodMonths === 0) continue;

      const trackingStart = cert.profit_tracking_start_date ?? cert.purchase_date;
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const totalMonthsElapsed = monthsBetween(trackingStart, todayStr);
      const elapsedPeriods = Math.floor(totalMonthsElapsed / periodMonths);

      let daysUntilDue: number;

      if (elapsedPeriods > 0) {
        daysUntilDue = 0;
      } else {
        const nextDueDate = new Date(trackingStart);
        nextDueDate.setMonth(nextDueDate.getMonth() + periodMonths);
        const diffMs = nextDueDate.getTime() - today.getTime();
        daysUntilDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      }

      if (daysUntilDue <= 7) {
        dueCount++;
        if (minDays === null || daysUntilDue < minDays) {
          minDays = daysUntilDue;
        }
      }
    }

    return {
      hasDueSoon: dueCount > 0,
      minDaysUntilDue: minDays,
      dueCount,
    };
  }, [certificates]);
}
