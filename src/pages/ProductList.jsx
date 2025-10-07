import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';

import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch('/api/products')
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.data || []));
  // }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_POSTGRES_HOST}/product`)
      .then((res) => {
        console.log(res);
        setProducts(res.data.data || []);
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant='h5' gutterBottom>
        Product List
      </Typography>
      <TextField
        label='Search'
        variant='outlined'
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((product) => (
              <TableRow
                key={product.id}
                hover
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>{product.is_featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {new Date(product.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
