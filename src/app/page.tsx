'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Paper,
  Button
} from '@mui/material';
import { getProducts } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProductCount() {
      try {
        const data = await getProducts();
        setProductCount(data.length);
        setError('');
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductCount();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Products',
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      value: loading ? '...' : productCount.toString(),
      action: () => router.push('/products'),
      actionText: 'View All Products'
    },
    {
      title: 'Add New Product',
      icon: <AddCircleIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      value: 'Create',
      action: () => router.push('/products/new'),
      actionText: 'Add Product'
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your store admin dashboard
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {dashboardCards.map((card, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
              flexGrow: 0
            }}
          >
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" component="div" gutterBottom color="text.primary">
                  {card.value}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={card.action}
                  sx={{ mt: 2 }}
                >
                  {card.actionText}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {error && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
    </DashboardLayout>
  );
}
