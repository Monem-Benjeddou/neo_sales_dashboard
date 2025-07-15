import React from 'react';
import { Card, Typography, Button, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import MenuIcon from '@mui/icons-material/Menu';
import { LatestOrdersTable } from '../components/dashboard/LatestOrdersTable';
import { dashboardService } from '../services/dashboardService';
import { DashboardKpiData, Order } from '../types/api';
import { LoadingSpinner, Skeleton, TableRowSkeleton, ApiDataContainer } from '../components/ui';
import { useApiRequest, usePageReload } from '../hooks';
import { DashboardKpiCard } from '../components/dashboard/DashboardKpiCard'; // New import
import { SalesOvertimeChart } from '../components/dashboard/SalesOvertimeChart'; // New import

export const Dashboard: React.FC = () => {
  const { data: kpis, isLoading, error, execute: fetchDashboardData } = useApiRequest<DashboardKpiData | null>(
    async () => dashboardService.getDashboardKPIs(),
    { errorContext: 'Dashboard' }
  );
  const { isReloading } = usePageReload();

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const baseCardStyles = {
    width: '100%',
    minHeight: '161px',
    backgroundColor: 'rgba(16, 1, 51, 1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    borderRadius: '15px',
    p: 2.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
    },
  };

  const leftCardSpecificStyles = {
    background: 'rgba(20, 1, 63, 0.8)',
    borderColor: 'rgba(18, 0, 54, 1)',
  };

  const rightCardSpecificStyles = {
    background: 'rgba(43, 19, 114, 1)',
    borderColor: 'rgba(111, 79, 242, 0.4)',
  };

  const DashboardSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} sx={{ ...baseCardStyles, ...(index % 2 === 0 ? leftCardSpecificStyles : rightCardSpecificStyles) }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Skeleton width="60%" height={24} />
              </Box>
              <Skeleton width="80%" height={40} />
              <Box sx={{ mt: 2 }}>
                <Skeleton width="40%" height={20} />
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Card sx={{ ...baseCardStyles, ...leftCardSpecificStyles, minHeight: '300px' }}>
          <Box sx={{ p: 3 }}>
            <Skeleton width="40%" height={30} />
            <Box sx={{ mt: 4, height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner text="Loading chart data..." />
            </Box>
          </Box>
        </Card>

        <Card sx={{ ...baseCardStyles, ...rightCardSpecificStyles, minHeight: '300px' }}>
          <Box sx={{ p: 3 }}>
            <Skeleton width="60%" height={30} />
            <Box sx={{ mt: 3 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRowSkeleton key={index} columns={3} />
              ))}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );

  const EmptyDashboard = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'white' }}>
      <Typography variant="h6">No dashboard data available.</Typography>
    </Box>
  );

  return (
    <ApiDataContainer
      isLoading={isLoading || isReloading}
      error={error}
      data={kpis}
      loadingText="Loading dashboard data..."
      emptyText="No dashboard data available."
      onRetry={fetchDashboardData}
      loadingComponent={<DashboardSkeleton />}
      emptyComponent={<EmptyDashboard />}
      renderData={(kpis) => (
        <div
          className="w-full p-6 text-white font-sans rounded-xl box-border border"
          style={{ border: '1px solid rgba(183, 127, 255, 0.3)', backgroundColor: 'rgba(25, 1, 80, 1)' }}
        >
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
              <DashboardKpiCard
                title="AVG. Order Value"
                value={`$ ${(kpis.avgOrderValue ?? 0).toFixed(2)}`}
                growthMetric={kpis.metricsGrowth.avgOrderValueGrowth}
                isLeftCard={true}
                iconSrc="/assets/icons/data.svg"
              />

              <DashboardKpiCard
                title="Total Created Cards"
                value={kpis.totalCreatedCards}
                growthMetric={kpis.metricsGrowth.newCardsCount}
                growthDescription="New Cards"
                isLeftCard={false}
                showSeeAllButton={true}
                isUp={true}
              />

              <DashboardKpiCard
                title="Total Collections created"
                value={kpis.totalCollectionsCreated}
                growthMetric={kpis.metricsGrowth.totalCollectionsGrowth}
                isLeftCard={true}
                iconSrc="/assets/icons/data.svg"
              />

              <DashboardKpiCard
                title="Total Users Account"
                value={kpis.totalUsersAccount}
                growthMetric={kpis.metricsGrowth.totalUsersGrowth}
                isLeftCard={false}
                showSeeAllButton={true}
                isUp={true}
              />
            </div>

            <SalesOvertimeChart salesData={kpis.salesOvertime} />
          </div>

          <LatestOrdersTable tableData={kpis.latestOrders} />
        </div>
      )}
    />
  );
};