import axiosInstance from "../../config/api";

import { DashboardStatData } from "./dashboard.types";

export const getDashboardStats = async (): Promise<DashboardStatData> => {
  const response =
    await axiosInstance.get<DashboardStatData>("/dashboard/stats");
  return response.data;
};
