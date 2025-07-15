import React, { memo } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box
} from '@mui/material';
import { CollectionListItem } from '../../types/api';
import { commonTableCellStyles, headerTableCellStyles } from './CollectionStyles';

interface CollectionsTableProps {
  collections: CollectionListItem[];
  selected: number[];
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (event: React.MouseEvent<unknown>, id: number) => void;
  isSelected: (id: number) => boolean;
}

// Memoized table row component to prevent unnecessary re-renders
interface CollectionRowProps {
  collection: CollectionListItem;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<unknown>) => void;
}

const CollectionRow = memo(({ collection, isSelected, onClick }: CollectionRowProps) => {
  return (
    <TableRow
      key={collection.collectionId}
      sx={{
        borderRadius: '8px',
        margin: '10px',
        transition: 'background-color 0.2s ease',
      }}
    >
      <TableCell padding="checkbox" sx={{
        ...commonTableCellStyles,
        borderTopLeftRadius: '25px',
        borderBottomLeftRadius: '25px',
      }}>
        <Checkbox
          size='small'
          color="primary"
          checked={isSelected}
          onClick={onClick}
          inputProps={{ 'aria-labelledby': `collection-checkbox-${collection.collectionId}` }}
          sx={{
            color: 'rgba(196, 196, 196, 1)',
            '&.Mui-checked': {
              color: '#F81DFB',
            },
          }}
        />
      </TableCell>
      <TableCell sx={commonTableCellStyles}>{collection.collectionId}</TableCell>
      <TableCell sx={commonTableCellStyles}>{collection.collectionName}</TableCell>
      <TableCell sx={commonTableCellStyles}>{collection.issuerName}</TableCell>
      <TableCell sx={commonTableCellStyles}>{collection.expectedReleaseDate}</TableCell>
      <TableCell sx={commonTableCellStyles}>{collection.numberOfCardDesigns}</TableCell>
      <TableCell sx={commonTableCellStyles}>
        <Typography sx={{ fontWeight: 500 }}>
          {collection.category}
        </Typography>
      </TableCell>
      <TableCell sx={commonTableCellStyles}>
        <Typography sx={{ fontWeight: 500 }}>
          {collection.status}
        </Typography>
      </TableCell>
      <TableCell sx={{
        ...commonTableCellStyles,
        borderTopRightRadius: '25px',
        borderBottomRightRadius: '25px',
      }}>
        <img src="/assets/icons/eye.svg" alt="view" />
      </TableCell>
    </TableRow>
  );
});

export const CollectionsTable: React.FC<CollectionsTableProps> = ({
  collections,
  selected,
  handleSelectAllClick,
  handleClick,
  isSelected,
}) => {
  // Memoize the table header to prevent unnecessary re-renders
  const TableHeader = React.memo(() => (
    <TableHead>
      <TableRow sx={{ backgroundColor: 'rgba(25, 1, 80, 1)', borderBottom: '5px solid black' }}>
        <TableCell padding="checkbox" sx={{ ...headerTableCellStyles }}>
          <Checkbox
            color="primary"
            indeterminate={selected.length > 0 && selected.length < collections.length}
            checked={collections.length > 0 && selected.length === collections.length}
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all collections',
            }}
            sx={{
              color: '#A0A0A0',
              '&.Mui-checked': {
                color: '#F81DFB',
              },
              '&.MuiCheckbox-indeterminate': {
                color: '#F81DFB',
              },
            }}
          />
        </TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Collection Id</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Collection name</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Issuer Name</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Expected release date</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Number Of Card Designs</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Category</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}>Status</TableCell>
        <TableCell sx={{ ...headerTableCellStyles }}></TableCell>
      </TableRow>
    </TableHead>
  ));

  // Memoize the empty state message
  const EmptyState = React.memo(() => (
    <TableRow>
      <TableCell colSpan={9} sx={{ ...commonTableCellStyles, textAlign: 'center', py: 5 }}>
        No collections found matching your search.
      </TableCell>
    </TableRow>
  ));

  return (
    <Card
      sx={{
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <TableContainer 
        sx={{ 
          backgroundColor: 'rgb(25, 1, 80, 1)', 
          boxShadow: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <Table sx={{
          minWidth: 650,
          borderCollapse: 'separate',
          borderSpacing: '0 15px',
        }}>
          <TableHeader />
          <TableBody>
            {collections.map((collection) => {
              const isItemSelected = isSelected(collection.collectionId);
              return (
                <CollectionRow
                  key={collection.collectionId}
                  collection={collection}
                  isSelected={isItemSelected}
                  onClick={(event) => handleClick(event, collection.collectionId)}
                />
              );
            })}
            {collections.length === 0 && <EmptyState />}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};