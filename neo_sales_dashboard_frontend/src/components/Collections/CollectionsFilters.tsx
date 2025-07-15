import React, { useMemo, memo } from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Button
} from '@mui/material';

interface CollectionsFiltersProps {
  openFilterMenu: boolean;
  filterAnchorEl: null | HTMLElement;
  handleFilterClose: () => void;
  categoryFilter: string;
  handleCategoryFilterChange: (category: string) => void;
  statusFilter: string;
  handleStatusFilterChange: (status: string) => void;
  rowsPerPage: number;
  handleChangeRowsPerPage: (value: number) => void;
}

// Common button style creator for filter buttons
const createFilterButtonStyle = (isSelected: boolean) => ({
  borderRadius: '12px',
  backgroundColor: isSelected ? '#AA6CD6' : 'transparent',
  borderColor: '#AA6CD6',
  color: '#FFFFFF',
  transition: 'all 0.3s ease',
  '&:hover': { 
    backgroundColor: isSelected ? '#AA6CD6' : 'rgba(170, 108, 214, 0.2)' 
  }
});

export const CollectionsFilters: React.FC<CollectionsFiltersProps> = memo(({
  openFilterMenu,
  filterAnchorEl,
  handleFilterClose,
  categoryFilter,
  handleCategoryFilterChange,
  statusFilter,
  handleStatusFilterChange,
  rowsPerPage,
  handleChangeRowsPerPage,
}) => {
  // Memoize the category filter buttons to prevent unnecessary re-renders
  const CategoryFilterButtons = useMemo(() => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Button
        size="small"
        variant={categoryFilter === '' ? 'contained' : 'outlined'}
        onClick={() => handleCategoryFilterChange('')}
        sx={createFilterButtonStyle(categoryFilter === '')}
      >
        All
      </Button>
      <Button
        size="small"
        variant={categoryFilter === 'Sports' ? 'contained' : 'outlined'}
        onClick={() => handleCategoryFilterChange('Sports')}
        sx={createFilterButtonStyle(categoryFilter === 'Sports')}
      >
        Sports
      </Button>
      <Button
        size="small"
        variant={categoryFilter === 'Art' ? 'contained' : 'outlined'}
        onClick={() => handleCategoryFilterChange('Art')}
        sx={createFilterButtonStyle(categoryFilter === 'Art')}
      >
        Art
      </Button>
    </Box>
  ), [categoryFilter, handleCategoryFilterChange]);

  // Memoize the status filter buttons to prevent unnecessary re-renders
  const StatusFilterButtons = useMemo(() => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Button
        size="small"
        variant={statusFilter === '' ? 'contained' : 'outlined'}
        onClick={() => handleStatusFilterChange('')}
        sx={createFilterButtonStyle(statusFilter === '')}
      >
        All
      </Button>
      <Button
        size="small"
        variant={statusFilter === 'Active' ? 'contained' : 'outlined'}
        onClick={() => handleStatusFilterChange('Active')}
        sx={createFilterButtonStyle(statusFilter === 'Active')}
      >
        Active
      </Button>
      <Button
        size="small"
        variant={statusFilter === 'Draft' ? 'contained' : 'outlined'}
        onClick={() => handleStatusFilterChange('Draft')}
        sx={createFilterButtonStyle(statusFilter === 'Draft')}
      >
        Draft
      </Button>
    </Box>
  ), [statusFilter, handleStatusFilterChange]);

  // Memoize the rows per page buttons to prevent unnecessary re-renders
  const RowsPerPageButtons = useMemo(() => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {[5, 10, 25].map((size) => (
        <Button
          key={size}
          size="small"
          variant={rowsPerPage === size ? 'contained' : 'outlined'}
          onClick={() => handleChangeRowsPerPage(size)}
          sx={createFilterButtonStyle(rowsPerPage === size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  ), [rowsPerPage, handleChangeRowsPerPage]);

  return (
<div></div>
  );
});