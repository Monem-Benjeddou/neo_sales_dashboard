import React from 'react';
import { Skeleton as MuiSkeleton, Box, SxProps, Theme } from '@mui/material';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  count?: number;
  sx?: SxProps<Theme>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  animation = 'pulse',
  count = 1,
  sx,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <MuiSkeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: variant === 'rounded' ? 1 : 0,
            mb: 1,
            ...sx,
          }}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC<{ height?: number | string }> = ({ height = 161 }) => {
  return (
    <Box sx={{ width: '100%', height, p: 2.5, bgcolor: 'rgba(16, 1, 51, 0.7)', borderRadius: '15px' }}>
      <Skeleton width="60%" height={24} />
      <Box sx={{ mt: 2 }}>
        <Skeleton width="80%" height={40} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Skeleton width="40%" height={20} />
      </Box>
    </Box>
  );
};

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
  return (
    <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Box key={index} sx={{ flex: 1, pr: 1 }}>
          <Skeleton height={40} />
        </Box>
      ))}
    </Box>
  );
};