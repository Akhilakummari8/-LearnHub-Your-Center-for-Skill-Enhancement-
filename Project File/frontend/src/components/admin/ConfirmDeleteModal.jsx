import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" mb={2}>
          Are you sure you want to delete this user?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              background: 'linear-gradient(90deg, #ff1744 0%, #d32f2f 100%)',
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(255,23,68,0.15)',
              '&:hover': {
                background: 'linear-gradient(90deg, #b71c1c 0%, #d32f2f 100%)',
                color: '#fff',
              },
            }}
          >
            Delete
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmDeleteModal;
