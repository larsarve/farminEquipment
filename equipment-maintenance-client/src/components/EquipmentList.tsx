import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Equipment } from '../types';
import { equipmentApi } from '../services/api';

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [open, setOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id'>>({
    name: '',
    description: '',
    maintenanceTasks: [],
    maintenanceHistory: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const response = await equipmentApi.getAll();
      setEquipment(response.data);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      console.log('Submitting new equipment:', JSON.stringify(newEquipment, null, 2));
      const response = await equipmentApi.create(newEquipment);
      console.log('Response from server:', response.data);
      handleClose();
      loadEquipment();
      setNewEquipment({
        name: '',
        description: '',
        maintenanceTasks: [],
        maintenanceHistory: []
      });
    } catch (error) {
      console.error('Error creating equipment:', error);
      if (error instanceof Error) {
        alert(`Error creating equipment: ${error.message}`);
      } else {
        alert('Error creating equipment. Please try again.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Equipment List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Equipment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {equipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{ height: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/equipment/${item.id}`)}
            >
              <CardContent>
                <Typography variant="h6" component="h2">
                  {item.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2">
                  Maintenance Tasks: {item.maintenanceTasks.length}
                </Typography>
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
            rows={4}
            value={newEquipment.description}
            onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentList; 