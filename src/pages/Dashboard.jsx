import { Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 8, gap: 10 }}>
      <Typography variant='h4' gutterBottom>
        Admin Portal For Zemlabs Drone Technologies
      </Typography>
      <Button
        sx={{ mx: 2 }}
        variant='contained'
        color='primary'
        onClick={() => navigate('/products')}
      >
        Manage Products
      </Button>
      <Button
        sx={{ mx: 2 }}
        variant='contained'
        color='primary'
        onClick={() => navigate('/add-product')}
      >
        Add Product
      </Button>
      {/* <Button
        sx={{ mx: 2 }}
        variant='contained'
        color='primary'
        onClick={() => navigate('/products')}
      >
        Manage Categories
      </Button>
      <Button
        sx={{ mx: 2 }}
        variant='contained'
        color='primary'
        onClick={() => navigate('/products')}
      >
        Add Categories
      </Button> */}
      <Button
        sx={{ mx: 2 }}
        variant='contained'
        color='primary'
        onClick={() => navigate('/manage-images')}
      >
        Manage Images
      </Button>
    </Container>
  );
}
