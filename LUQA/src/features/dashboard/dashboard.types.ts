export interface DashboardStatData {
  id: string;
  name: string;
  value: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  time?: string;
  productionStatus?: string;
  ca?: number;
  eval?: number;
  progressValue?: number;
  backgroundVariant?: string;
  rating?: number;
  reviews?: number;
}
