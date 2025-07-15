import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchCollections,
  setPage,
  setRowsPerPage,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter,
  setSelected,
  selectAll,
  clearSelected,
  // Selectors
  selectCollections,
  selectCollectionsLoading,
  selectCollectionsError,
  selectCollectionsPagination,
  selectCollectionsFilters,
  selectCollectionsSelected
} from '../redux/collectionsSlice';
import { CollectionsTable } from '../components/Collections/CollectionsTable';
import { CollectionsFilters } from '../components/Collections/CollectionsFilters';
import { CollectionsPagination } from '../components/Collections/CollectionsPagination';
import { CollectionsHeader } from '../components/Collections/CollectionsHeader';

// Create memoized components to prevent unnecessary re-renders
const MemoizedCollectionsTable = React.memo(CollectionsTable);
const MemoizedCollectionsFilters = React.memo(CollectionsFilters);
const MemoizedCollectionsPagination = React.memo(CollectionsPagination);
const MemoizedCollectionsHeader = React.memo(CollectionsHeader);

export const Collections: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Use selectors to access only the specific parts of state needed
  const collections = useAppSelector(selectCollections);
  const isLoading = useAppSelector(selectCollectionsLoading);
  const error = useAppSelector(selectCollectionsError);
  const { page, rowsPerPage, totalItems, totalPages } = useAppSelector(selectCollectionsPagination);
  const { searchTerm, categoryFilter, statusFilter } = useAppSelector(selectCollectionsFilters);
  const selected = useAppSelector(selectCollectionsSelected);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const openFilterMenu = Boolean(filterAnchorEl);

  const [localSearchInput, setLocalSearchInput] = useState(searchTerm);

  // Effect to update localSearchInput when Redux searchTerm changes
  useEffect(() => {
    setLocalSearchInput(searchTerm);
  }, [searchTerm]);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearchInput !== searchTerm) {
        dispatch(setSearchTerm(localSearchInput));
        if (page !== 1) dispatch(setPage(1));
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchInput, dispatch, searchTerm, page]);

  // Memoize the filters object
  const filters = useMemo(() => ({
    search: searchTerm,
    category: categoryFilter,
    status: statusFilter,
    page,
    pageSize: rowsPerPage
  }), [searchTerm, categoryFilter, statusFilter, page, rowsPerPage]);

  // Memoize the fetchData function
  const fetchData = useCallback(() => {
    dispatch(fetchCollections(filters));
  }, [dispatch, filters]);

  // Only fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  }, [dispatch]);

  const handleChangeRowsPerPage = useCallback((value: number) => {
    dispatch(setRowsPerPage(value));
  }, [dispatch]);

  const handleCategoryFilterChange = useCallback((category: string) => {
    dispatch(setCategoryFilter(category));
    setFilterAnchorEl(null); // Close filter menu after selection
  }, [dispatch, setFilterAnchorEl]);

  const handleStatusFilterChange = useCallback((status: string) => {
    dispatch(setStatusFilter(status));
    setFilterAnchorEl(null); // Close filter menu after selection
  }, [dispatch, setFilterAnchorEl]);

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(selectAll());
      return;
    }
    dispatch(clearSelected());
  }, [dispatch]);

  const handleClick = useCallback((event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    dispatch(setSelected(newSelected));
  }, [dispatch, selected]);

  const isSelected = useCallback((id: number) => selected.indexOf(id) !== -1, [selected]);

  // Loading state component
  const LoadingComponent = useMemo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'white' }}>
      <CircularProgress color="primary" size={40} thickness={4} />
      <Typography variant="h6" sx={{ ml: 2, fontWeight: 500 }}>Loading Collections...</Typography>
    </Box>
  ), []);

  // Error state component
  const ErrorComponent = useMemo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#FF5252' }}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>Error: {error}</Typography>
      <Button 
        variant="contained" 
        sx={{ ml: 2, backgroundColor: '#7F3FBF', '&:hover': { backgroundColor: '#AA6CD6' } }}
        onClick={() => dispatch(fetchCollections({ page, pageSize: rowsPerPage }))}
      >
        Retry
      </Button>
    </Box>
  ), [error, dispatch, page, rowsPerPage]);

  if (isLoading && collections.length === 0) {
    return LoadingComponent;
  }

  if (error && collections.length === 0) {
    return ErrorComponent;
  }

  return (
    <div
      className="w-full p-6 text-white font-sans rounded-xl box-border border"
      style={{ border: '1px solid rgba(183, 127, 255, 0.3)', backgroundColor: 'rgba(25, 1, 80, 1)' }}
    >
      <Stack spacing={4}>
        <MemoizedCollectionsHeader
          showSearchInput={showSearchInput}
          setShowSearchInput={setShowSearchInput}
          localSearchInput={localSearchInput}
          setLocalSearchInput={setLocalSearchInput}
          handleSearchSubmit={() => {
            dispatch(setSearchTerm(localSearchInput));
            if (page !== 1) dispatch(setPage(1));
          }}
          filterAnchorEl={filterAnchorEl}
          setFilterAnchorEl={setFilterAnchorEl}
          openFilterMenu={openFilterMenu}
        />

        <MemoizedCollectionsFilters
          openFilterMenu={openFilterMenu}
          filterAnchorEl={filterAnchorEl}
          handleFilterClose={() => setFilterAnchorEl(null)}
          categoryFilter={categoryFilter}
          handleCategoryFilterChange={handleCategoryFilterChange}
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />

        {/* Table with loading indicator */}
        {isLoading && collections.length > 0 && (
          <Box sx={{ position: 'relative', minHeight: '200px' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }}>
              <CircularProgress color="primary" size={40} thickness={4} />
            </Box>
            <MemoizedCollectionsTable
              collections={collections}
              selected={selected}
              handleSelectAllClick={handleSelectAllClick}
              handleClick={handleClick}
              isSelected={isSelected}
            />
          </Box>
        )}

        {/* Table without loading indicator */}
        {!isLoading && (
          <MemoizedCollectionsTable
            collections={collections}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            handleClick={handleClick}
            isSelected={isSelected}
          />
        )}

        <MemoizedCollectionsPagination
          page={page}
          totalPages={totalPages}
          handleChangePage={handleChangePage}
        />
      </Stack>
    </div>
  );
};