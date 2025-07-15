import React from 'react';
import { Card, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesOvertimeChartProps {
  salesData: { month: string; value: number }[];
}

export const SalesOvertimeChart: React.FC<SalesOvertimeChartProps> = ({ salesData }) => {
  // Prepare data for Chart.js
  const data = {
    labels: salesData.map((d) => d.month),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((d) => d.value),
        borderColor: '#FF8F1F', // Line color
        backgroundColor: 'rgba(255, 143, 31, 0.2)', // Area fill color (if area is true)
        tension: 0.4, // Smoothness of the line
        pointRadius: 0, // Hide data points
        pointHoverRadius: 6, // Radius of point on hover
        pointHoverBackgroundColor: '#FF2D92', // Color of point on hover
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  // Configure options for Chart.js
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: true, // Ensure tooltip is enabled
        mode: 'index' as const, // Show tooltip for all items at the same x-coordinate
        intersect: false, // Tooltip appears even if not directly on a point
        backgroundColor: 'rgba(255, 4, 180, 0.75)', // Specified background color with opacity
        borderColor: 'transparent', // No border for the tooltip
        borderRadius: 5, // Specified border-radius
        padding: 5, // Specified padding
        displayColors: false, // Hide the color box next to the label
        // Custom callbacks for tooltip content
        callbacks: {
          title: function(tooltipItems: any) {
            // Always return "Average" as the title
            return 'Average';
          },
          label: function(tooltipItem: any) {
            // Format the label as "Month $ValueK"
            const month = tooltipItem.label; // x-axis label
            const value = tooltipItem.raw; // raw data value
            return `${month} $${(value / 1000).toFixed(1)}k`;
          },
        },
        // Styling for the tooltip text
        titleFont: {
          size: 10, // Corresponds to Typography variant="caption" sx={{ fontSize: '10px' }}
          weight: 'normal',
        },
        bodyFont: {
          size: 12, // Corresponds to Typography variant="body2" sx={{ fontSize: '12px' }}
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const, // Explicitly define scale type
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: 'white', // X-axis tick label color
          font: {
            size: 15, // X-axis tick label font size
            weight: '600',
            family: 'Assistant, sans-serif',
          },
        },
        border: {
          display: false, // Hide x-axis line
        },
      },
      y: {
        type: 'linear' as const, // Explicitly define scale type
        grid: {
          display: false, // Hide y-axis grid lines
        },
        ticks: {
          color: 'white', // Y-axis tick label color
          font: {
            size: 15, // Y-axis tick label font size
            weight: '600',
            family: 'Assistant, sans-serif',
          },
          callback: function(value: any) {
            // Format y-axis tick labels
            return `$${(value / 1000).toFixed(0)}k`; // Ensure it's a number before division
          },
        },
        border: {
          display: false, // Hide y-axis line
        },
      },
    },
  };

  return (
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
              fontSize: '15px',
              border: 'none',
              borderColor: 'none',
              '&:hover': {
                borderColor: '#FF04B4',
                color: '#FF04B4',
                backgroundColor: 'rgba(255, 4, 180, 0.1)'
              }
            }}>Revenue</Button>
          <Button variant="outlined" color="primary"
            sx={{
              fontSize: '15px',
              border: 'none',
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
      {/* Chart.js Line Chart */}
      <div style={{ flexGrow: 1, minHeight: '250px' }}> {/* Container for the chart */}
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};
