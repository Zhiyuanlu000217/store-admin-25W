'use client';

import { useState } from 'react';
import { Order, OrderItem } from '@/types/order';
import { deleteOrder, updateOrder } from '@/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  Card,
  CardContent,
  Chip,
  TextField,
  Collapse,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface OrderListProps {
  orders: Order[];
  onOrderChange: () => void;
}

interface ExpandableOrderRowProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

type StatusColor = 'success' | 'warning' | 'error' | 'default';

function ExpandableOrderRow({ order, onEdit, onDelete }: ExpandableOrderRowProps) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string): StatusColor => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'processed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: string | { $date: string }) => {
    try {
      const dateString = typeof date === 'object' && '$date' in date ? date.$date : date;
      const parsedDate = new Date(dateString);
      
      if (isNaN(parsedDate.getTime())) {
        return 'Invalid Date';
      }

      return parsedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderId}</TableCell>
        <TableCell>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
          />
        </TableCell>
        <TableCell>{formatDate(order.timestamp)}</TableCell>
        <TableCell>{formatDate(order.processedAt)}</TableCell>
        <TableCell align="right">
          <Tooltip title="Edit">
            <IconButton
              onClick={() => onEdit(order)}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => onDelete(order)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small" aria-label="order items">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: OrderItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrderList({ orders, onOrderChange }: OrderListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    notes: ''
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setEditFormData({
      status: order.status,
      notes: ''
    });
    setEditDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedOrder(null);
    setErrorMessage(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrder) {
      try {
        await deleteOrder(selectedOrder._id);
        onOrderChange();
      } catch (err) {
        setErrorMessage('Failed to delete order');
        console.error('Failed to delete order:', err);
        return; // Don't close dialog on error
      }
      handleCloseDialogs();
    }
  };

  const handleConfirmEdit = async () => {
    if (selectedOrder) {
      try {
        await updateOrder(selectedOrder._id, editFormData);
        onOrderChange();
      } catch (err) {
        setErrorMessage('Failed to update order');
        console.error('Failed to update order:', err);
        return; // Don't close dialog on error
      }
      handleCloseDialogs();
    }
  };

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom component="div">
            Order List
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="collapsible order table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Processed At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <ExpandableOrderRow
                    key={order.orderId}
                    order={order}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialogs}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Status"
              value={editFormData.status}
              onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
              margin="normal"
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </TextField>
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!errorMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 