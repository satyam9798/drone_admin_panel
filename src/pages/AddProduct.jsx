// AddProductPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: null,
    categoryId: null,
    displayImageId: null,
    imageIds: [null, null, null],
    features: [
      { icon: '', title: '', desc: '' },
      { icon: '', title: '', desc: '' },
      { icon: '', title: '', desc: '' },
    ],
    isFeatured: false,
    inStock: false,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_POSTGRES_HOST}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const uploadImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    // const response = await fetch('http://localhost:8080/api/image/upload', {
    //   method: 'POST',
    //   body: formData,
    // });

    const response = await axios.post(
      `${process.env.REACT_APP_POSTGRES_HOST}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.imageId;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, key, value) => {
    const updated = [...form.features];
    updated[index][key] = value;
    setForm({ ...form, features: updated });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    const id = await uploadImage(file);
    if (type === 'display') {
      setForm({ ...form, displayImageId: id });
    } else {
      const updated = [...form.imageIds];
      updated[type] = id;
      setForm({ ...form, imageIds: updated });
    }
  };

  const handleSubmit = async () => {
    fetch(`${process.env.REACT_APP_POSTGRES_HOST}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert('Product added successfully!');
    navigate('/dashboard');
  };

  return (
    <Container maxWidth='md'>
      <Typography
        variant='h4'
        sx={{ mb: 4, fontWeight: 'bold', color: 'orange' }}
      >
        Add New Product
      </Typography>

      <Stack spacing={2}>
        <TextField
          label='Name'
          name='name'
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label='Short Description'
          name='shortDescription'
          value={form.shortDescription}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label='Price'
          name='price'
          value={form.price}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          label='Category'
          name='categoryId'
          value={form.categoryId}
          onChange={handleChange}
          fullWidth
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='Long Description'
          name='longDescription'
          multiline
          rows={4}
          value={form.longDescription}
          onChange={handleChange}
          fullWidth
        />

        <Typography>Upload Display Image:</Typography>
        <input type='file' onChange={(e) => handleFileChange(e, 'display')} />

        <Typography>Upload 3 Detail Images:</Typography>
        {[0, 1, 2].map((i) => (
          <input key={i} type='file' onChange={(e) => handleFileChange(e, i)} />
        ))}

        <Typography variant='h6'>Features</Typography>
        {form.features.map((f, i) => (
          <Stack key={i} spacing={1} direction='row'>
            <TextField
              label='Icon'
              value={f.icon}
              onChange={(e) => handleFeatureChange(i, 'icon', e.target.value)}
            />
            <TextField
              label='Title'
              value={f.title}
              onChange={(e) => handleFeatureChange(i, 'title', e.target.value)}
            />
            <TextField
              label='Description'
              value={f.desc}
              onChange={(e) => handleFeatureChange(i, 'desc', e.target.value)}
            />
          </Stack>
        ))}
        <FormControlLabel
          control={
            <Checkbox
              name='isFeatured'
              checked={form.isFeatured || false}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isFeatured: Boolean(e.target.checked),
                }))
              }
            />
          }
          label='Featured'
        />

        <FormControlLabel
          control={
            <Checkbox
              name='inStock'
              checked={form.inStock || false}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  inStock: Boolean(e.target.checked),
                }))
              }
            />
          }
          label='In Stock'
        />

        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Submit Product
        </Button>
      </Stack>
    </Container>
  );
}
