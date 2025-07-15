import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CollectionListItem, PaginatedResult } from '../types/api';
import { collectionsService } from '../services/collectionsService';
import { RootState } from './store';

interface CollectionFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

interface CollectionsState {
  collections: CollectionListItem[];
  loadingState: {
    fetchCollections: LoadingState;
  };
  totalItems: number;
  page: number;
  rowsPerPage: number;
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  selected: number[];
  lastUpdated: number | null;
}

const initialState: CollectionsState = {
  collections: [],
  loadingState: {
    fetchCollections: {
      isLoading: false,
      error: null
    }
  },
  totalItems: 0,
  page: 1,
  rowsPerPage: 5,
  searchTerm: '',
  categoryFilter: '',
  statusFilter: '',
  selected: [],
  lastUpdated: null
};

// Async thunk for fetching collections
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async (filters: CollectionFilters, { rejectWithValue }) => {
    try {
      const response = await collectionsService.getCollectionsList(filters);
      if (response) {
        return response;
      }
      return rejectWithValue('Failed to fetch collections');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching collections');
    }
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 1; // Reset to first page when changing page size
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setSelected: (state, action: PayloadAction<number[]>) => {
      state.selected = action.payload;
    },
    selectAll: (state) => {
      state.selected = state.collections.map(collection => collection.collectionId);
    },
    clearSelected: (state) => {
      state.selected = [];
    },
    resetFilters: (state) => {
      state.categoryFilter = '';
      state.statusFilter = '';
      state.rowsPerPage = 5;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loadingState.fetchCollections.isLoading = true;
        state.loadingState.fetchCollections.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action: PayloadAction<PaginatedResult<CollectionListItem>>) => {
        state.loadingState.fetchCollections.isLoading = false;
        state.collections = action.payload.items;
        state.totalItems = action.payload.pagination.totalItems;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loadingState.fetchCollections.isLoading = false;
        state.loadingState.fetchCollections.error = action.payload as string;
      });
  },
});

// Selectors
export const selectCollectionsState = (state: RootState) => state.collections;

export const selectCollections = createSelector(
  [selectCollectionsState],
  (collectionsState) => collectionsState.collections
);

export const selectCollectionsLoading = createSelector(
  [selectCollectionsState],
  (collectionsState) => collectionsState.loadingState.fetchCollections.isLoading
);

export const selectCollectionsError = createSelector(
  [selectCollectionsState],
  (collectionsState) => collectionsState.loadingState.fetchCollections.error
);

export const selectCollectionsPagination = createSelector(
  [selectCollectionsState],
  (collectionsState) => ({
    page: collectionsState.page,
    rowsPerPage: collectionsState.rowsPerPage,
    totalItems: collectionsState.totalItems,
    totalPages: Math.ceil(collectionsState.totalItems / collectionsState.rowsPerPage)
  })
);

export const selectCollectionsFilters = createSelector(
  [selectCollectionsState],
  (collectionsState) => ({
    searchTerm: collectionsState.searchTerm,
    categoryFilter: collectionsState.categoryFilter,
    statusFilter: collectionsState.statusFilter
  })
);

export const selectCollectionsSelected = createSelector(
  [selectCollectionsState],
  (collectionsState) => collectionsState.selected
);

export const {
  setPage,
  setRowsPerPage,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter,
  setSelected,
  selectAll,
  clearSelected,
  resetFilters,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;