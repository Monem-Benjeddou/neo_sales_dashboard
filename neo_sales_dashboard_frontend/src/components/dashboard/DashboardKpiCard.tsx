import React from 'react';
import { Card, Typography, Button, Box } from '@mui/material';

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  growthMetric?: string | number;
  growthDescription?: string;
  isLeftCard: boolean;
  showSeeAllButton?: boolean;
  iconSrc?: string;
  isUp?: boolean;
}

export const DashboardKpiCard: React.FC<DashboardKpiCardProps> = ({
  title,
  value,
  growthMetric,
  growthDescription,
  isLeftCard,
  showSeeAllButton = true,
  iconSrc,
  isUp,
}) => {
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
    fontSize: '16px',
    lineHeight: '20px',
    color: '#FF04B4',
    textTransform: 'none',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    }
  };

  const growthDescriptionStyles = growthDescription === "New Cards" ? {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#FF8F1F',
    display: 'inline',
  } : {
    color: '#ffff',
    fontFamily: 'Assistant, sans-serif',
    display: 'inline',
    fontSize: 'inherit',
  };
  const growthMetricStyles = growthDescription === "New Cards" ? {
              fontFamily: 'Poppins',
               fontWeight: '600', 
               color: 'white', 
               fontSize: {
                 xs: '22px',
                  sm: '24px' 
                } 
  } : {
              fontFamily: 'Assistant',
               fontWeight: '400', 
               color: '#8AFF8A', 
               fontSize: {
                 xs: '12px',
                  sm: '14px' 
                } 
  };
  const showSeeAllButtonAtTopRight = isUp && showSeeAllButton;

  return (
    <Card sx={{ ...baseCardStyles, ...(isLeftCard ? leftCardSpecificStyles : rightCardSpecificStyles) }}>
      <div>
        <div className='flex items-center justify-between'>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '18px', sm: '20px' },
              lineHeight: '24px',
              color: '#FFFFFF',
              mb: 1,
              fontFamily: 'Assistant'
            }}
          >
            {title}
          </Typography>
          {showSeeAllButtonAtTopRight && (
            <Button sx={seeAllButtonStyles}>See All</Button>
          )}
          {!showSeeAllButtonAtTopRight && iconSrc && (
            <Box
              component="img"
              src={iconSrc}
              alt={`${title} Icon`}
              sx={{
                width: { xs: '35px', sm: '45px' },
                height: { xs: '35px', sm: '45px' },
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '28px', sm: '36px' },
              lineHeight: '42px',
              color: '#FFFFFF',
              fontFamily: 'Assistant'
            }}
          >
            {value}
          </Typography>
        </div>

        {growthMetric !== undefined && (
          <div className="flex justify-between items-center mt-auto pt-10">
            <Typography sx={growthMetricStyles}>
              {growthMetric}{' '}
              <Typography
                component="span"
                sx={growthDescriptionStyles}
              >
                {growthDescription || 'From last month.'}
              </Typography>
            </Typography>
            {!showSeeAllButtonAtTopRight && showSeeAllButton && (
                <Button sx={seeAllButtonStyles}>See All</Button>
            )}
          </div>
        )}

        {growthMetric === undefined && !showSeeAllButtonAtTopRight && showSeeAllButton && (
          <div className="flex justify-end items-center mt-auto pt-2">
            <Button sx={seeAllButtonStyles}>See All</Button>
          </div>
        )}
      </div>
    </Card>
  );
};
