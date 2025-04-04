'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductFormData } from '@/types/product';
import { createProduct, generateDescription, generateImage } from '@/services/api';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Alert, 
  CircularProgress,
  InputAdornment,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';

interface ProductFormProps {
  onSuccess: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: 0,
    description: '',
    imageUrl: ''
  });
  const [priceInput, setPriceInput] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submittedData = {
        ...formData,
        price: priceInput ? parseFloat(priceInput) : 0
      };
      
      console.log('Submitting product data:', submittedData);
      
      await createProduct(submittedData);
      setSuccess('Product created successfully!');
      onSuccess();
      setFormData({
        name: '',
        sku: '',
        price: 0,
        description: '',
        imageUrl: ''
      });
      setPriceInput('');
      setKeywords('');
    } catch (error) {
      setError('Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!keywords) {
      setError('Please enter keywords first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const description = await generateDescription(keywords);
      setFormData(prev => ({ ...prev, description }));
      console.log('Description generated:', description);
    } catch (error) {
      setError('Failed to generate description');
      console.error('Error generating description:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!keywords) {
      setError('Please enter keywords first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const imageUrl = await generateImage(keywords);
      setFormData(prev => ({ ...prev, imageUrl }));
      console.log('Image URL generated:', imageUrl);
    } catch (error) {
      setError('Failed to generate image');
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '' || value === '.' || /^\d*\.?\d*$/.test(value)) {
      setPriceInput(value);
      
      if (value && !isNaN(parseFloat(value))) {
        setFormData(prev => ({ ...prev, price: parseFloat(value) }));
      } else {
        setFormData(prev => ({ ...prev, price: 0 }));
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                required
                fullWidth
                id="name"
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                required
                fullWidth
                id="sku"
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                required
                fullWidth
                id="price"
                label="Price"
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                margin="normal"
                variant="outlined"
                placeholder="0.00"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <TextField
                fullWidth
                id="keywords"
                label="Keywords for AI Generation"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., modern minimalist coffee maker"
                margin="normal"
                variant="outlined"
                helperText="Enter keywords to generate description and image"
              />
              
              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  onClick={handleGenerateDescription}
                  disabled={loading || !keywords}
                >
                  Generate Description
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={handleGenerateImage}
                  disabled={loading || !keywords}
                >
                  Generate Image
                </Button>
              </Stack>
              
              <TextField
                fullWidth
                id="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  height: 300,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 2,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                {formData.imageUrl ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={formData.imageUrl}
                      alt="Generated product"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No image generated yet
                  </Typography>
                )}
              </Paper>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 