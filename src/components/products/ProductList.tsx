'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { deleteProduct } from '@/services/api';
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
  Avatar, 
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProductListProps {
  products: Product[];
  onDelete: () => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (sku: string) => {
    setProductToDelete(sku);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        onDelete();
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  return (
    <Box>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom component="div">
            Product List
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="product table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={`${product.id}-${product.sku}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {product.imageUrl ? (
                          <Avatar alt={product.name} src={product.imageUrl} 
                            sx={{ width: 40, height: 40, mr: 2 }} />
                        ) : (
                          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                            {product.name.charAt(0)}
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body1">{product.name}</Typography>
                          {product.description && (
                            <Typography variant="body2" color="text.secondary" 
                              sx={{ maxWidth: '300px', whiteSpace: 'nowrap', 
                                overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.sku} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteClick(product.sku)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 