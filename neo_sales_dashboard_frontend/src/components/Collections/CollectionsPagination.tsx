import React, { useMemo } from 'react';
import {
  Box,
  Pagination,
} from '@mui/material';

interface CollectionsPaginationProps {
  page: number;
  totalPages: number;
  handleChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
}

// Create a memoized pagination component to prevent unnecessary re-renders
export const CollectionsPagination: React.FC<CollectionsPaginationProps> = ({
  page,
  totalPages,
  handleChangePage,
}) => {
  // Memoize the pagination styles to prevent recalculation on each render
  const paginationStyles = useMemo(() => ({
    '& .MuiPaginationItem-root': {
      color: '#F81DFB',
      borderColor: '#F81DFB',
      borderRadius: '30px',
      transition: 'all 0.3s ease',
      '&.Mui-selected': {
        backgroundColor: '#F81DFB',
        color: '#FFFFFF',
        borderColor: '#F81DFB',
        '&:hover': {
          backgroundColor: '#F81DFB',
        },
      },
      '&:hover': {
        backgroundColor: 'rgba(248, 29, 251, 0.1)',
      },
    },
    '& .MuiPaginationItem-ellipsis': {
      color: '#F81DFB',
    },
    '& .MuiPaginationItem-previousNext': {
      backgroundColor: 'rgba(255, 143, 31, 1)',
      borderColor: 'rgba(255, 143, 31, 1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 143, 31, 0.8)',
        borderColor: 'rgba(255, 143, 31, 1)',
      },
      '& .MuiSvgIcon-root': {
        color: '#000000',
      },
    },
  }), []);

  // Memoize the pagination component to prevent unnecessary re-renders
  const PaginationComponent = useMemo(() => (
    <Pagination
      count={totalPages}
      page={page}
      onChange={handleChangePage}
      variant="outlined"
      shape="rounded"
      hidePrevButton={page === 1}
      hideNextButton={page === totalPages}
      sx={paginationStyles}
    />
  ), [totalPages, page, handleChangePage, paginationStyles]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mt: 4, 
        gap: 2,
        transition: 'all 0.3s ease'
      }}
    >
      {PaginationComponent}
    </Box>
  );
};