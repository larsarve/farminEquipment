import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Grid,
} from '@mui/material';
import { format, isPast } from 'date-fns';
import { MaintenanceTask } from '../types';
import { equipmentApi } from '../services/api';

const MaintenanceSchedule: React.FC = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await equipmentApi.getAllMaintenanceTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading maintenance tasks:', error);
    }
  };

  const getTaskStatus = (dueDate: string) => {
    if (isPast(new Date(dueDate))) {
      return 'error';
    }
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Maintenance Schedule
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <List>
                {tasks.map((task) => (
                  <ListItemButton
                    key={task.id}
                    onClick={() => navigate(`/equipment/${task.equipmentId}`)}
                  >
                    <ListItemText
                      primary={task.description}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography component="span" variant="body2">
                            Due: {format(new Date(task.dueDate), 'PPP')}
                          </Typography>
                          <Chip
                            label={task.isCompleted ? 'Completed' : 'Pending'}
                            color={task.isCompleted ? 'success' : getTaskStatus(task.dueDate)}
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaintenanceSchedule; 