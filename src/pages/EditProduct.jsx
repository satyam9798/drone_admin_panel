import {
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_POSTGRES_HOST}/product/${id}`)
      .then((res) => {
        setProduct(res.data.data || {});
        if (res.data.data.displayImageId) {
          setPreview(
            `${process.env.REACT_APP_POSTGRES_HOST}/image/${res.data.data.displayImageId}`
          );
        }
      })
      .catch((error) => console.log({ error }));

    axios
      .get(`${process.env.REACT_APP_POSTGRES_HOST}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_POSTGRES_HOST}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setProduct({ ...product, displayImageId: data.imageId });
      setPreview(
        `${process.env.REACT_APP_POSTGRES_HOST}/image/${data.imageId}`
      );
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };
  const handleDetailImageUpload = async (file, index) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_POSTGRES_HOST}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const updatedImages = [...(product.imageIds || [])];
      updatedImages[index] = response.data.imageId;
      setProduct({ ...product, imageIds: updatedImages });
    } catch (err) {
      console.error('Detail image upload failed:', err);
    }
  };

  const handleSave = () => {
    fetch(`${process.env.REACT_APP_POSTGRES_HOST}/product/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(() => alert('Updated successfully'));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_POSTGRES_HOST}/product/${id}`
      );
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant='h5' gutterBottom>
        Edit Product: {product.name}
      </Typography>

      <TextField
        fullWidth
        label='Name'
        value={product.name || ''}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Small Description'
        value={product.shortDescription || ''}
        onChange={(e) =>
          setProduct({ ...product, shortDescription: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        rows={6}
        label='Long Description'
        value={product.longDescription || ''}
        onChange={(e) =>
          setProduct({ ...product, longDescription: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Price'
        type='number'
        value={product.price || ''}
        onChange={(e) => setProduct({ ...product, price: +e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        select
        label='Category'
        value={product.categoryId || ''}
        onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
        sx={{ mb: 2 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ mb: 3 }}>
        <Typography variant='subtitle1'>Display Image</Typography>
        {preview && (
          <img
            src={preview}
            alt='Preview'
            style={{ width: '200px', height: 'auto', marginBottom: '1rem' }}
          />
        )}
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFile(file || null);
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ mt: 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </Box>

      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2].map((index) => (
          <Grid item xs={12} md={4} key={index}>
            <TextField
              fullWidth
              label={`Detail Image ${index + 1} Blob ID`}
              value={product.imageIds?.[index] || ''}
              onChange={(e) => {
                const images = [...(product.imageIds || [])];
                images[index] = e.target.value;
                setProduct({ ...product, images });
              }}
            />
          </Grid>
        ))}
      </Grid> */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2].map((index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ mb: 1 }}>
              {product.imageIds?.[index] && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={`${process.env.REACT_APP_POSTGRES_HOST}/image/${product.imageIds[index]}`}
                    alt={`Detail ${index + 1}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const updated = [...(product.imageIds || [])];
                      updated[index] = '';
                      setProduct({ ...product, imageIds: updated });
                    }}
                  >
                    <DeleteIcon color='error' />
                  </IconButton>
                </Box>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleDetailImageUpload(file, index);
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant='subtitle1' sx={{ mb: 1 }}>
        Features
      </Typography>
      {['title', 'desc'].map((field, idx) => (
        <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
          {[0, 1, 2].map((featureIdx) => (
            <Grid item xs={12} md={4} key={featureIdx}>
              <TextField
                fullWidth
                label={`Feature ${featureIdx + 1} ${field}`}
                value={product.features?.[featureIdx]?.[field] || ''}
                onChange={(e) => {
                  const updated = [...(product.features || [])];
                  updated[featureIdx] = {
                    ...updated[featureIdx],
                    [field]: e.target.value,
                  };
                  setProduct({ ...product, features: updated });
                }}
              />
            </Grid>
          ))}
        </Grid>
      ))}

      <FormControlLabel
        control={
          <Checkbox
            checked={product.isFeatured || false}
            onChange={(e) =>
              setProduct({ ...product, isFeatured: e.target.checked })
            }
          />
        }
        label='Featured'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={product.inStock || false}
            onChange={(e) =>
              setProduct({ ...product, inStock: e.target.checked })
            }
          />
        }
        label='In stock'
      />
      <Tooltip title='Delete Product'>
        {/* <Button
          variant='contained'
          color='primary'
          sx={{ margin: '15px' }}
          onClick={handleSave}
        >
          Delete Product */}
        <IconButton color='error' onClick={() => setOpen(true)}>
          <DeleteIcon />
        </IconButton>
        {/* </Button> */}
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant='contained' color='primary' onClick={handleSave}>
        Save Changes
      </Button>
    </Container>
  );
}
