import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Equipment, MaintenanceTask } from '../types';
import { equipmentApi } from '../services/api';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ description: '', dueDate: '' });

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  const loadEquipment = async () => {
    try {
      const response = await equipmentApi.getById(id!);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!equipment) return;

    const newMaintenanceTask: MaintenanceTask = {
      id: Date.now().toString(),
      description: newTask.description,
      dueDate: newTask.dueDate,
      isCompleted: false,
      equipmentId: equipment.id,
    };

    const updatedEquipment = {
      ...equipment,
      maintenanceTasks: [...equipment.maintenanceTasks, newMaintenanceTask],
    };

    try {
      await equipmentApi.update(equipment.id, updatedEquipment);
      setEquipment(updatedEquipment);
      handleClose();
      setNewTask({ description: '', dueDate: '' });
    } catch (error) {
      console.error('Error adding maintenance task:', error);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    if (!equipment) return;

    const updatedTasks = equipment.maintenanceTasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        if (updatedTask.isCompleted) {
          const historyItem = {
            id: Date.now().toString(),
            description: task.description,
            completedDate: new Date().toISOString(),
            equipmentId: equipment.id,
          };
          equipment.maintenanceHistory.push(historyItem);
        }
        return updatedTask;
      }
      return task;
    });

    const updatedEquipment = {
      ...equipment,
      maintenanceTasks: updatedTasks,
    };

    try {
      await equipmentApi.update(equipment.id, updatedEquipment);
      setEquipment(updatedEquipment);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!equipment) return;

    const updatedTasks = equipment.maintenanceTasks.filter((task) => task.id !== taskId);
    const updatedEquipment = {
      ...equipment,
      maintenanceTasks: updatedTasks,
    };

    try {
      await equipmentApi.update(equipment.id, updatedEquipment);
      setEquipment(updatedEquipment);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!equipment) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {equipment.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Maintenance Task
        </Button>
      </Box>

      <Typography variant="body1" paragraph>
        {equipment.description}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance Tasks
              </Typography>
              <List>
                {equipment.maintenanceTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.isCompleted}
                            onChange={() => handleTaskToggle(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.description}
                            secondary={`Due: ${format(new Date(task.dueDate), 'PPP')}`}
                          />
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance History
              </Typography>
              <List>
                {equipment.maintenanceHistory.map((history) => (
                  <React.Fragment key={history.id}>
                    <ListItem>
                      <ListItemText
                        primary={history.description}
                        secondary={`Completed: ${format(new Date(history.completedDate), 'PPP')}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Maintenance Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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

export default EquipmentDetail; 