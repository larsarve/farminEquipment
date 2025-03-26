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
import { format, isValid, parseISO } from 'date-fns';
import { Equipment, MaintenanceTask, MaintenanceHistory } from '../types';
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
      console.log('Received equipment data:', {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        description: response.data.description,
        maintenanceTasks: response.data.maintenanceTasks,
        maintenanceHistory: response.data.maintenanceHistory
      });
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
      equipmentName: equipment.name
    };

    try {
      const updatedEquipment = await equipmentApi.update(equipment.id, {
        ...equipment,
        maintenanceTasks: [...equipment.maintenanceTasks, newMaintenanceTask]
      });
      setEquipment(updatedEquipment.data);
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
          const historyItem: MaintenanceHistory = {
            id: Date.now().toString(),
            description: task.description,
            completedDate: new Date().toISOString(),
            equipmentId: equipment.id,
            equipmentName: equipment.name
          };
          equipment.maintenanceHistory.push(historyItem);
        }
        return updatedTask;
      }
      return task;
    });

    try {
      const updatedEquipment = await equipmentApi.update(equipment.id, {
        ...equipment,
        maintenanceTasks: updatedTasks
      });
      setEquipment(updatedEquipment.data);
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      console.log('No date provided');
      return 'No date set';
    }

    try {
      console.log('Formatting date:', dateString);
      
      // First try to create a new Date directly
      let date = new Date(dateString);
      
      // If that's not valid, try parsing as ISO string
      if (!isValid(date)) {
        date = parseISO(dateString);
      }
      
      console.log('Parsed date:', date);
      
      // If still not valid, try parsing with timezone offset
      if (!isValid(date)) {
        const [year, month, day] = dateString.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      // If we have a valid date, format it
      if (isValid(date)) {
        // Adjust for timezone offset
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return format(date, 'PPP');
      }
      
      console.log('Final parsed date:', date);
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
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

      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {equipment.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Type: {equipment.type}
          </Typography>
          {equipment.description && (
            <Typography variant="body1" paragraph>
              Description: {equipment.description}
            </Typography>
          )}
        </CardContent>
      </Card>

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
                            secondary={`Due: ${formatDate(task.dueDate)}`}
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
                        secondary={`Completed: ${formatDate(history.completedDate)}`}
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