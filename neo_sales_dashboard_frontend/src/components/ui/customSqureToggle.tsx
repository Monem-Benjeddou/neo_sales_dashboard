import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; 
import React from 'react';
interface CustomSquareToggleProps {
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  id: string | number; 
}
export const CustomSquareToggle: React.FC<CustomSquareToggleProps> = ({ checked, onClick, id }) => {
  return (
    <Box
      onClick={onClick}
      aria-checked={checked}
      role="checkbox" // Indicate its semantic role for accessibility
      tabIndex={0} // Make it focusable
      sx={{
        width: 20, // Desired width of the square
        height: 20, // Desired height of the square
        borderRadius: '2px', // Slight rounding for the square
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        // Always apply the fill color
        backgroundColor: 'rgba(196, 196, 196, 1)',
        border: '1px solid rgba(196, 196, 196, 1)', // Optional: A thin border matching the fill
        transition: 'background-color 0.2s ease-in-out', // Smooth transition
        '&:hover': {
          // Optional: slight hover effect
          borderColor: 'rgba(196, 196, 196, 0.8)',
        },
      }}
    >
      {checked && (
        <CheckIcon
          sx={{
            fontSize: 16, // Size of the checkmark icon
            color: '#F81DFB', // Color of the checkmark when checked
          }}
        />
      )}
    </Box>
  );
};