// src/App.tsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import Dashboard from './pages/Dashboard';
import EditProduct from './pages/EditProduct';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import ManageImages from './pages/ManageImages';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e69500',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/products/:id' element={<EditProduct />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/manage-images' element={<ManageImages />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
