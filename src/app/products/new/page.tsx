'use client';

import { 
  Typography, 
  Box, 
  Button,
  Breadcrumbs
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductForm from '@/components/products/ProductForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NewProductPage() {
  const router = useRouter();

  const handleProductCreated = () => {
    // Navigate to product list after a short delay to give feedback
    setTimeout(() => {
      router.push('/products');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>
            Products
          </Link>
          <Typography color="text.primary">New Product</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Create New Product
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/products')}
          >
            Back to Products
          </Button>
        </Box>
      </Box>

      <ProductForm onSuccess={handleProductCreated} />
    </DashboardLayout>
  );
} 