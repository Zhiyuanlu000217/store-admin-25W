'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrderList from '@/components/orders/OrderList';
import { getOrders } from '@/services/api';
import { Order } from '@/types/order';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Orders</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1">
          Orders
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>No orders found.</Alert>
      ) : (
        <OrderList orders={orders} onOrderChange={fetchOrders} />
      )}
    </DashboardLayout>
  );
} 