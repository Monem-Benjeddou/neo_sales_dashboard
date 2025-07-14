import React from 'react';
import { Card, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { LineChart } from '@mui/x-charts';
import { LatestOrdersTable } from '../components/dashboard/LatestOrdersTable';
import { dashboardService } from '../services/dashboardService';
import { DashboardKpiData, Order } from '../types/api';
import { LoadingSpinner, Skeleton, TableRowSkeleton, ApiDataContainer } from '../components/ui';
import { useApiRequest } from '../hooks';

export const Dashboard: React.FC = () => {
  const { data: kpis, isLoading, error, execute: fetchDashboardData } = useApiRequest<DashboardKpiData | null>(
    async () => dashboardService.getDashboardKPIs(),
    { errorContext: 'Dashboard' }
  );

  React.useEffect(() => {
    fetchDashboardData();
  }, []); // Remove fetchDashboardData from dependencies to prevent infinite loop

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

  const seeAllButtonStyles = {
    p: 0,
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: '20px',
    color: '#FF04B4',
    textTransform: 'none',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    }
  };

  // Create loading skeleton component
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

  // Create empty state component
  const EmptyDashboard = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'white' }}>
      <Typography variant="h6">No dashboard data available.</Typography>
    </Box>
  );

  return (
    <ApiDataContainer
      isLoading={isLoading}
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
          <Card sx={{ ...baseCardStyles, ...leftCardSpecificStyles }}>
            <div>
              <div className='flex items-center justify-between'>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '18px', sm: '18px' },
                    lineHeight: '24px',
                    color: '#FFFFFF',
                    mb: 1,
                    fontStyle: 'semibold'
                  }}
                >
                  AVG. Order Value
                </Typography>
                <Box
                  component="img"
                  src="/assets/icons/data.svg"
                  alt="Data Icon"
                  sx={{
                    width: { xs: '35px', sm: '45px' },
                    height: { xs: '35px', sm: '45px' },
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '28px', sm: '36px' },
                    lineHeight: '42px',
                    color: '#FFFFFF',
                  }}
                >
                  $ {(kpis.avgOrderValue ?? 0).toFixed(2)} 
                </Typography>
              </div>
              <div className="flex justify-between items-center mt-auto pt-2">
                <Typography sx={{ color: '#8AFF8A', fontSize: { xs: '12px', sm: '14px' } }}>{kpis.metricsGrowth.avgOrderValueGrowth} <span className="text-gray-300">From last month.</span></Typography>
                <Button sx={seeAllButtonStyles}>See All</Button>
              </div>
            </div>
          </Card>

          <Card sx={{ ...baseCardStyles, ...rightCardSpecificStyles }}>
            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '16px', sm: '18px' },
                  lineHeight: '24px',
                  color: '#FFFFFF',
                }}
              >
                Total Created Cards
              </Typography>
              <Button sx={seeAllButtonStyles}>See All</Button>
            </div>
            <Typography variant="h4" color="white" className=""
              sx={{
                fontWeight: 700,
                fontSize: { xs: '28px', sm: '36px' },
                lineHeight: '42px',
                color: '#FFFFFF',
              }}>
              {kpis.totalCreatedCards}
            </Typography>
            <Typography color="primary" className=''
              sx={{
                fontWeight: 600,
                fontSize: { xs: '36px', sm: '36px' },
                lineHeight: '18px',
              }}>
              {kpis.metricsGrowth.newCardsCount} <span style={{ color: 'rgba(255, 143, 31, 1)', fontSize: '16px' }}>New Cards</span>
            </Typography>
          </Card>

          <Card sx={{ ...baseCardStyles, ...leftCardSpecificStyles }}>
            <div>
              <div className='flex items-center justify-between'>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '18px', sm: '18px' },
                    lineHeight: '24px',
                    color: '#FFFFFF',
                    mb: 1,
                    fontStyle: 'semibold'
                  }}
                >
                  Total Collections created
                </Typography>
                <Box
                  component="img"
                  src="/assets/icons/data.svg"
                  alt="Data Icon"
                  sx={{
                    width: { xs: '35px', sm: '45px' },
                    height: { xs: '35px', sm: '45px' },
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-6">
                <Typography variant="h4" color="white" className="!mb-0"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '28px', sm: '36px' },
                    lineHeight: '42px',
                    color: '#FFFFFF',
                  }}>
                  {kpis.totalCollectionsCreated}
                </Typography>
              </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2">
              <Typography sx={{ color: '#8AFF8A', fontSize: { xs: '12px', sm: '14px' } }}>{kpis.metricsGrowth.totalCollectionsGrowth} <span className="text-gray-300">From last month.</span></Typography>
              <Button sx={seeAllButtonStyles}>See All</Button>
            </div>
          </Card>

          <Card sx={{ ...baseCardStyles, ...rightCardSpecificStyles }}>
            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '16px', sm: '18px' },
                  lineHeight: '24px',
                  color: '#FFFFFF',
                }}
              >
                Total Users Account
              </Typography>
              <Button sx={seeAllButtonStyles}>See All</Button>
            </div>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '28px', sm: '36px' },
                lineHeight: '42px',
                color: '#FFFFFF',
              }}>
              {kpis.totalUsersAccount}
            </Typography>
            <Typography sx={{ color: '#8AFF8A', fontSize: { xs: '12px', sm: '14px' } }}>{kpis.metricsGrowth.totalUsersGrowth} <span className="text-gray-300">From last month.</span></Typography>
          </Card>
        </div>

        <Card
          sx={{
            width: { xs: '100%', lg: '508px' },
            minHeight: '345px',
            background: 'rgba(76,45,137, 1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(183, 127, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            borderRadius: '12px',
            p: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
            },
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 ">
            <Typography variant="h5" color="white" className="!mb-0"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', sm: '24px' }
              }}>Sales Overtime</Typography>
            <div className="flex space-x-2">
              <Button variant="outlined" color="primary"
                sx={{
                  fontSize:'15px',
                  border:'none',
                  borderColor: 'none',
                  '&:hover': {
                    borderColor: '#FF04B4',
                    color: '#FF04B4',
                    backgroundColor: 'rgba(255, 4, 180, 0.1)'
                  }
                }}>Revenue</Button>
              <Button variant="outlined" color="primary"
                sx={{
                  fontSize:'15px',
                  border:'none',
                  borderColor: 'none',
                  '&:hover': {
                    borderColor: '#FF04B4',
                    color: '#FF04B4',
                    backgroundColor: 'rgba(255, 4, 180, 0.1)'
                  }
                }}>Order</Button>
              <MenuIcon
                sx={{
                  fontSize: 40,
                  borderRadius: '9px',
                  backgroundColor: 'rgba(183, 127, 255, 1)',
                  padding: '4px',
                }}
              />
            </div>
          </div>
          <LineChart
            xAxis={[{
              data: kpis.salesOvertime.map((d: { month: string; value: number }) => d.month), scaleType: 'band', labelStyle: {
                fontSize: 15,
              },
            }]}
            series={[{
              data: kpis.salesOvertime.map((d: { month: string; value: number }) => d.value),
              area: false,
              color: '#FF2D92',
              showMark: false,
            }]}
            height={250}
            margin={{ left: 10, right: 10, top: 30, bottom: 10 }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 3,
              },
              '.MuiMarkElement-root': {
                stroke: '#fff',
                scale: '0.6',
                fill: '#FF2D92',
              },
              '.MuiChartsAxis-line': {
                stroke: 'rgba(255, 255, 255, 0.3)',
              },
              '.MuiChartsAxis-tick': {
                stroke: 'rgba(255, 255, 255, 0.3)',
              },
              '.MuiChartsAxis-tickLabel': {
                fill: 'white',
                fontSize: '15px',
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                transform: 'translateX(-10px)',
              },
            }}
            yAxis={[{
              scaleType: 'linear',
              valueFormatter: (value: number) => `$${value / 1000}k`,
            }]}
          />
        </Card>
      </div>

      <LatestOrdersTable tableData={kpis.latestOrders} />
    </div>
      )}
    />
  );
};
