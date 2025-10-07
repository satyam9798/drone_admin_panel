import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
  CardContent,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageImages = () => {
  const [images, setImages] = useState([]);
  const [imagesList, setImagesList] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/admin/images`)
      .then((res) => {
        console.log(res);
        setImagesList(res.data || []);
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/image/${id}`);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  useEffect(() => {
    if (!imagesList) {
      setLoading(false);
      return;
    }

    Promise.all(
      imagesList?.unlinked?.map((data) =>
        axios
          .get(`http://localhost:8080/api/image/${data.id}`, {
            responseType: 'blob',
          })
          .then((res) => ({
            id: data.id,
            fileName: data.filename,
            url: URL.createObjectURL(res.data),
          }))
          .catch(() => null)
      )
    ).then((results) => {
      console.log({ results });
      setImages(results.filter(Boolean));
      setLoading(false);
    });
  }, [imagesList]);

  if (loading) return <CircularProgress />;
  if (!images) return <Typography>No images found.</Typography>;

  return (
    <Grid container spacing={2} sx={{ padding: '2.5rem' }}>
      {images.map((img) => (
        <Card sx={{ width: 250, position: 'relative' }}>
          <CardMedia
            component='img'
            height='140'
            image={img.url}
            alt={`Image ${img.id}`}
          />
          <CardContent>
            <Typography sx={{ color: 'white' }} variant='body2'>
              {img.filename}
            </Typography>
            <p>{img.fileName}</p>
          </CardContent>
          <IconButton
            onClick={() => handleDelete(img.id)}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'white',
            }}
          >
            <DeleteIcon color='error' />
          </IconButton>
        </Card>
      ))}
    </Grid>
  );
};

export default ManageImages;
