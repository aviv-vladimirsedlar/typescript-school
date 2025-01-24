import React from "react";

import { MainLayout } from "../common/layouts/MainLayout";
import { PerformanceCard } from "../features/dashboard/components/PerformanceCard/PerformanceCard";
import useDashboardStats from "../features/dashboard/hooks/useDashboardStats";

const HomePage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <MainLayout>
      <PerformanceCard
        time={stats?.time || "N/A"}
        productionStatus={stats?.productionStatus || "N/A"}
        ca={stats?.ca || 0}
        eval={stats?.eval || 0}
        progressValue={stats?.progressValue || 0}
        progressMaxValue={100}
        progressType={"percentage"}
        progressVariant={"default"}
        progressSize={"64"}
        borderRadius={"8"}
        backgroundVariant={"light"}
        isLoading={isLoading}
      />
    </MainLayout>
  );
};

export default HomePage;
