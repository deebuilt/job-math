export interface MaterialItem {
  id: string;
  name: string;
  cost: number;
}

export interface JobData {
  revenue: number;
  materials: MaterialItem[];
  laborHelpers: number;
  laborHoursEach: number;
  laborRate: number;
  mileage: number;
  mileageRate: number;
  otherCost: number;
  otherNote: string;
  hoursWorked: number;
  clientName: string;
}

export interface SavedJob {
  id: string;
  date: string;
  clientName: string;
  revenue: number;
  totalCosts: number;
  netProfit: number;
  margin: number;
  hoursWorked: number;
  effectiveRate: number | null;
}

export const DEFAULT_MILEAGE_RATE = 0.70;

export const DEMO_DATA: JobData = {
  revenue: 350,
  materials: [{ id: "demo-1", name: "Cleaning supplies", cost: 28 }],
  laborHelpers: 0,
  laborHoursEach: 0,
  laborRate: 0,
  mileage: 15,
  mileageRate: DEFAULT_MILEAGE_RATE,
  otherCost: 0,
  otherNote: "",
  hoursWorked: 4,
  clientName: "Demo — Deep Clean Job",
};

export const EMPTY_JOB: JobData = {
  revenue: 0,
  materials: [],
  laborHelpers: 0,
  laborHoursEach: 0,
  laborRate: 0,
  mileage: 0,
  mileageRate: DEFAULT_MILEAGE_RATE,
  otherCost: 0,
  otherNote: "",
  hoursWorked: 0,
  clientName: "",
};
