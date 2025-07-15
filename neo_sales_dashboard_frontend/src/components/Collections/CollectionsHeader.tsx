import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

interface CollectionsHeaderProps {
  showSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
  localSearchInput: string;
  setLocalSearchInput: (value: string) => void;
  handleSearchSubmit?: () => void;
  filterAnchorEl: null | HTMLElement;
  setFilterAnchorEl?: (element: HTMLElement | null) => void;
  openFilterMenu: boolean;
  handleFilterClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CollectionsHeader: React.FC<CollectionsHeaderProps> = ({
  showSearchInput,
  setShowSearchInput,
  localSearchInput,
  setLocalSearchInput,
  handleSearchSubmit,
  filterAnchorEl,
  setFilterAnchorEl,
  handleFilterClick: externalHandleFilterClick,
}) => {
  // Use the external handler if provided, otherwise create a local one
  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (externalHandleFilterClick) {
      externalHandleFilterClick(event);
    } else if (setFilterAnchorEl) {
      setFilterAnchorEl(event.currentTarget);
    }
  }, [externalHandleFilterClick, setFilterAnchorEl]);
  
  // Handle search submission
  const onSearchSubmit = useCallback(() => {
    if (handleSearchSubmit) {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  // Memoize the search input to prevent unnecessary re-renders
  const SearchInput = useMemo(() => {
    if (!showSearchInput) return null;
    
    return (
      <TextField
        variant="outlined"
        placeholder="Search collections..."
        value={localSearchInput}
        onChange={(e) => {
          setLocalSearchInput(e.target.value);
        }}
        sx={{
          minWidth: { xs: '100%', sm: '200px' },
          transition: 'all 0.3s ease',
          '& .MuiOutlinedInput-root': {
            color: '#E0E0E0',
            '& fieldset': {
              borderColor: '#4A1E7A',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: '#7F3FBF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#AA6CD6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#A0A0A0',
          },
          input: {
            padding: '10px 14px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon sx={{ color: '#A0A0A0' }} />
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearchSubmit();
          }
        }}
      />
    );
  }, [showSearchInput, localSearchInput, setLocalSearchInput, onSearchSubmit]);

  // Memoize the action buttons to prevent unnecessary re-renders
  const ActionButtons = useMemo(() => (
    <>
      <Button
        variant="outlined"
        onClick={() => setShowSearchInput(!showSearchInput)}
        sx={{
          color: '#FFFFFF',
          backgroundColor: '#7F3FBF',
          border: 'none',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#AA6CD6',
          },
          minWidth: 'auto',
          padding: '8px',
        }}
      >
        <SearchOutlinedIcon />
      </Button>

      <Button
        variant="outlined"
        startIcon={<FilterListOutlinedIcon />}
        size='medium'
        onClick={handleFilterClick}
        sx={{
          color: '#FFFFFF',
          backgroundColor: '#7F3FBF',
          border: 'none',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#AA6CD6',
          },
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Filter</Box>
      </Button>

      <Button
        variant="outlined"
        sx={{
          color: '#E0E0E0',
          borderColor: '#AA6CD6',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(170, 108, 214, 0.1)',
            borderColor: '#AA6CD6',
          },
        }}
      >
        All
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: '#FFFFFF',
          backgroundColor: '#AA6CD6',
          border: 'none',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#CC99FF',
          },
        }}
      >
        Export Data
      </Button>
    </>
  ), [showSearchInput, setShowSearchInput, handleFilterClick]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        transition: 'all 0.3s ease',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '20px', sm: '28px' },
          color: '#FFFFFF',
        }}
      >
        Total Created Collections
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          transition: 'all 0.3s ease'
        }}
      >
        {SearchInput}
        {ActionButtons}
      </Box>
    </Box>
  );
};