import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "../dashboard.api";

const useDashboardStats = () => {
  const { data, isLoading, error, ...rest } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  // Centralized error handling
  if (error) {
    console.error("Error fetching dashboard stats:", error);
  }

  return { data, isLoading, error, hasError: !!error, ...rest };
};

export default useDashboardStats;
