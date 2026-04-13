import { JobData } from "./types";

export function calcMaterialsCost(materials: JobData["materials"]): number {
  return materials.reduce((sum, m) => sum + (m.cost || 0), 0);
}

export function calcLaborCost(helpers: number, hours: number, rate: number): number {
  return helpers * hours * rate;
}

export function calcMileageCost(miles: number, rate: number): number {
  return miles * rate;
}

export function calcTotalCosts(job: JobData): number {
  return (
    calcMaterialsCost(job.materials) +
    calcLaborCost(job.laborHelpers, job.laborHoursEach, job.laborRate) +
    calcMileageCost(job.mileage, job.mileageRate) +
    (job.otherCost || 0)
  );
}

export function calcNetProfit(revenue: number, totalCosts: number): number {
  return revenue - totalCosts;
}

export function calcMargin(netProfit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  return (netProfit / revenue) * 100;
}

export function calcEffectiveRate(netProfit: number, hours: number): number | null {
  if (!hours || hours <= 0) return null;
  return netProfit / hours;
}

export function getMarginColor(margin: number, isNegative: boolean): string {
  if (isNegative) return "text-destructive";
  if (margin >= 50) return "text-success";
  if (margin >= 20) return "text-warning";
  return "text-destructive";
}

export function getMarginBgColor(margin: number, isNegative: boolean): string {
  if (isNegative) return "bg-destructive";
  if (margin >= 50) return "bg-success";
  if (margin >= 20) return "bg-warning";
  return "bg-destructive";
}
