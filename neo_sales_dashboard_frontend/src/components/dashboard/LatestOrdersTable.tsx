import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Box
} from '@mui/material';
import { MoreVert, MoreHoriz } from '@mui/icons-material';
import { Order } from '../../types/api'; // Import the Order type

interface LatestOrdersTableProps {
  tableData: Order[]; // Use the Order type directly
}

export const LatestOrdersTable: React.FC<LatestOrdersTableProps> = ({ tableData }) => {
  const headerCellStyle = {
    color: '#A0A0A0',
    fontWeight: 600,
    backgroundColor: 'rgba(43, 19, 114, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <Box
      sx={{
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(34, 34, 34, 0.37)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        },
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        backgroundImage: "none",
        backgroundColor: 'rgba(43, 19, 114, 0.8)',
        border: '1px solid rgba(183, 127, 255, 0.3)',
        borderRadius: '15px',
        p: 4,
        overflow: 'hidden'
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <Typography variant="h5" color="white" className="!mb-0"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '20px', sm: '24px' }
          }}>Latest Orders</Typography>
        <div className="flex flex-wrap justify-end gap-2">
          <Button sx={{  backgroundColor: 'rgba(255, 4, 180, 1)', width: '83px', height:'35px', fontSize:'15px', fontWeight:'600'}}>See All</Button>
          <Button sx={{  backgroundColor: 'rgba(112, 144, 176, 0.41)',width: '83px', height:'35px', fontSize:'15px', fontWeight:'600'  }}>Filter</Button>
          <Button sx={{  backgroundColor: 'rgba(29, 0, 84, 0.6)',width: '83px', height:'35px', fontSize:'15px', fontWeight:'600' }}>Export</Button>
        </div>
      </div>
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', backgroundImage: "none", boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'rgba(42, 42, 74, 0.5)' }}>
            <TableRow sx={{ backgroundColor: 'rgba(43, 19, 114, 0.8)' }}>
              <TableCell sx={headerCellStyle}>Order ID</TableCell>
              <TableCell sx={headerCellStyle}>Order Date</TableCell>
              <TableCell sx={headerCellStyle}>Payment</TableCell>
              <TableCell sx={headerCellStyle}>Status</TableCell>
              <TableCell sx={headerCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: 'white', py: 1.5 }}>#{row.id}</TableCell>
                <TableCell sx={{ color: 'white', py: 1.5 }}>{row.orderDateFormatted}</TableCell>
                <TableCell sx={{ color: 'white', py: 1.5 }}>$ {parseFloat(row.orderValue).toFixed(2)}</TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {row.statusDisplay}
                  </span>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <IconButton color="inherit" sx={{ color: '#B77FFF', '&:hover': { backgroundColor: 'rgba(183, 127, 255, 0.1)' } }}>
                    <MoreHoriz />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
