'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Paper,
  Button,
  Divider
} from '@mui/material';
import { getProducts, getOrders } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [productCount, setProductCount] = useState<number>(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    processed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, orders] = await Promise.all([
          getProducts(),
          getOrders()
        ]);
        
        setProductCount(products.length);
        
        // Calculate order statistics
        const stats = {
          total: orders.length,
          processed: orders.filter(order => order.status === 'processed').length,
          pending: orders.filter(order => order.status === 'pending').length
        };
        setOrderStats(stats);
        
        setError('');
      } catch (error) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Products',
      icon: <InventoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      value: loading ? '...' : productCount.toString(),
      action: () => router.push('/products'),
      actionText: 'View All Products',
      description: 'Total number of products in your inventory'
    },
    {
      title: 'Add New Product',
      icon: <AddCircleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      value: 'Create',
      action: () => router.push('/products/new'),
      actionText: 'Add Product',
      description: 'Add a new product to your inventory'
    },
    {
      title: 'Total Orders',
      icon: <ListAltIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      value: loading ? '...' : orderStats.total.toString(),
      action: () => router.push('/orders'),
      actionText: 'View All Orders',
      description: 'Total number of orders received'
    },
    {
      title: 'Processed Orders',
      icon: <LocalShippingIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      value: loading ? '...' : orderStats.processed.toString(),
      secondaryValue: loading ? '' : `(${((orderStats.processed / orderStats.total) * 100).toFixed(1)}%)`,
      action: () => router.push('/orders'),
      actionText: 'View Orders',
      description: 'Number of orders that have been processed'
    }
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {dashboardCards.map((card, index) => (
          <Card key={index} sx={{ width: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'action.hover',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  flexShrink: 0
                }}>
                  {card.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.description}
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ my: 2 }}>
                    {card.value}
                    {card.secondaryValue && (
                      <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        {card.secondaryValue}
                      </Typography>
                    )}
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={card.action}
                    size="large"
                  >
                    {card.actionText}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
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
