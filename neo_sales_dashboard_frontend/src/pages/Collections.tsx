import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Typography,
  Box,
  Chip,
  TextField,
  CircularProgress,
  InputAdornment,
  Pagination
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'; // Import Search icon
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { collectionsService } from '../services/collectionsService';
import { CollectionListItem } from '../types/api';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false); // State to control search input visibility
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
   useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await collectionsService.getCollectionsList();
        if (data) {
          setCollections(data);
        } else {
          setError('Failed to load collections data.');
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('An error occurred while fetching collections data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
 const filteredCollections = collections.filter(collection =>
    collection.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.issuerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.collectionId.toString().includes(searchTerm.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCollections = filteredCollections.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCollections.length / rowsPerPage);


  const commonTableCellStyles = {
    color: '#FFFFFF',
    border:'none',
    backgroundColor :'rgba(32, 8, 91, 1)', 
    backgroundImage : 'rgba(32, 8, 91, 1)'
  };

  const headerTableCellStyles = {
    color: '#A0A0A0',
    fontWeight: 600,
    backgroundColor: 'transparent',
    borderButtom: '1px solid rgba(108, 122, 160, 1)'
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'white' }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Collections...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'red' }}>
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div
      className="w-full p-6 text-white font-sans rounded-xl box-border border"
      style={{ border: '1px solid rgba(183, 127, 255, 0.3)', backgroundColor: 'rgba(25, 1, 80, 1)' }}
    >
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 },
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

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
            {showSearchInput && (
              <TextField
                variant="outlined"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  minWidth: { xs: '100%', sm: '200px' },
                  '& .MuiOutlinedInput-root': {
                    color: '#E0E0E0',
                    '& fieldset': {
                      borderColor: '#4A1E7A', // Border color for search input
                    },
                    '&:hover fieldset': {
                      borderColor: '#7F3FBF', // Hover border color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#AA6CD6', // Focused border color
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
              />
            )}

            <Button
              variant="outlined"
              onClick={() => setShowSearchInput(!showSearchInput)}
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#7F3FBF', // Vibrant purple for search toggle
                border: 'none',
                borderRadius: '8px',
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
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#7F3FBF', // Vibrant purple for filter button
                border: 'none',
                borderRadius: '8px',
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
                borderColor: '#AA6CD6', // Accent color for 'All' button border
                borderRadius: '20px',
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
                backgroundColor: '#AA6CD6', // Brighter accent for export button
                border: 'none',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#CC99FF',
                },
              }}
            >
              Export Data
            </Button>
          </Box>
        </Box>

        <Card
          sx={{
            overflow: 'hidden',
            boxShadow:'none'
          }}
        > 
          <TableContainer   sx={{ backgroundColor: 'rgb(25, 1, 80, 1)', boxShadow: 'none',  }}>
            <Table sx={{
                minWidth: 650,
                borderCollapse: 'separate',
                borderSpacing: '0 15px',
              }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(25, 1, 80, 1)', borderBottom: '5px solid black' }}> 
                  <TableCell sx={{ ...headerTableCellStyles }}>Collection Id</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Collection name</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Issuer Name</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Expected release date</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Number Of Card Designs</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Category</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}>Status</TableCell>
                  <TableCell sx={{ ...headerTableCellStyles, borderLeft: 'none' }}></TableCell>

                </TableRow>
              </TableHead>
             <TableBody>
                {collections.map((collection) => (
                  <TableRow
                    key={collection.collectionId}
                    sx={{
                        borderRadius: '8px',
                        margin: '10px',
                    }}
                  >
                    <TableCell sx={{
                        ...commonTableCellStyles,
                        borderTopLeftRadius: '25px', // Apply border-radius to the first cell for the row's left edge
                        borderBottomLeftRadius: '25px',
                    }}>#{collection.collectionId}</TableCell>
                    <TableCell sx={commonTableCellStyles}>{collection.collectionName}</TableCell>
                    <TableCell sx={commonTableCellStyles}>{collection.issuerName}</TableCell>
                    <TableCell sx={commonTableCellStyles}>{collection.expectedReleaseDate}</TableCell>
                    <TableCell sx={commonTableCellStyles}>{collection.numberOfCardDesigns}</TableCell>
                    <TableCell sx={commonTableCellStyles}>
                      <Typography sx={{fontWeight: 500 }}>
                        {collection.category}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                        ...commonTableCellStyles,
                    }}>
                      <Typography sx={{fontWeight: 500 }}>
                        {collection.status}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                        ...commonTableCellStyles,
                        borderTopRightRadius: '25px',
                        borderBottomRightRadius: '25px',
                        marginRight:'10px'
                    }}>
                        <img src="/assets/icons/eye.svg" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#F81DFB',
                borderColor: '#F81DFB',
                borderRadius:'30px',
                '&.Mui-selected': {
                  backgroundColor: '#F81DFB',
                  color: '#FFFFFF',
                  borderColor: '#F81DFB',
                  '&:hover': {
                    backgroundColor: '#F81DFB',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(248, 29, 251, 0.1)', // Changed hover background to be less opaque
                },
              },
              '& .MuiPaginationItem-ellipsis': {
                color: '#F81DFB',
              },
              // Target the next and previous buttons specifically
              '& .MuiPaginationItem-previousNext': {
                backgroundColor: 'rgba(255, 143, 31, 1)', // Set the color for next/previous icons
                borderColor: 'rgba(255, 143, 31, 1)', // Set the border color for next/previous buttons
                '&:hover': {
                  backgroundColor: 'rgba(255, 143, 31, 0.1)', // Hover effect for next/previous
                  borderColor: 'rgba(255, 143, 31, 1)',
                },
              },
            }}
          />

        </Box>
      </Stack>
    </div>
  );
};