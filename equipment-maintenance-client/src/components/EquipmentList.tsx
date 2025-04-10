import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Equipment } from '../types';
import { equipmentApi } from '../services/api';
import { AxiosError } from 'axios';

interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId: string;
}

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id'>>({
    name: '',
    description: '',
    type: '',
    maintenanceTasks: [],
    maintenanceHistory: []
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const response = await equipmentApi.getAll();
      setEquipment(response.data);
    } catch (error) {
      console.error('Error loading equipment:', error);
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data as ValidationErrorResponse;
      if (errorData.errors) {
        // Combine all validation errors into a single message
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else if (errorData.title) {
        alert(errorData.title);
      } else {
        alert('An error occurred while processing your request');
      }
    } else {
      alert('An unexpected error occurred');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewEquipment({
      name: '',
      description: '',
      type: '',
      maintenanceTasks: [],
      maintenanceHistory: []
    });
  };

  const handleAddEquipment = async () => {
    try {
      console.log('Sending equipment data:', JSON.stringify(newEquipment, null, 2));
      const response = await equipmentApi.create(newEquipment);
      console.log('Server response:', response.data);
      handleClose();
      loadEquipment();
    } catch (error) {
      console.error('Error adding equipment:', error);
      handleError(error);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentApi.delete(id);
        setEquipment(equipment.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment');
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Equipment List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Equipment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {equipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Type: {item.type}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteEquipment(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Button
                  component={Link}
                  to={`/equipment/${item.id}`}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Equipment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newEquipment.name}
            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newEquipment.description}
            onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            value={newEquipment.type}
            onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddEquipment} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EquipmentList; 