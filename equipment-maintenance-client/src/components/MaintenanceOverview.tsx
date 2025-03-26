import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { format, isPast } from 'date-fns';
import { MaintenanceTask } from '../types';
import { equipmentApi } from '../services/api';

const MaintenanceOverview: React.FC = () => {
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

  const getTaskStatusLabel = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return 'Completed';
    if (isPast(new Date(dueDate))) return 'Overdue';
    return 'Pending';
  };

  const getTaskStatusColor = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return 'success';
    if (isPast(new Date(dueDate))) return 'error';
    return 'default';
  };

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  const overdueTasks = pendingTasks.filter(task => isPast(new Date(task.dueDate)));

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Maintenance Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Summary
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Tasks"
                    secondary={tasks.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Pending Tasks"
                    secondary={pendingTasks.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Completed Tasks"
                    secondary={completedTasks.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Overdue Tasks"
                    secondary={overdueTasks.length}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Tasks
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Equipment</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        hover
                        onClick={() => navigate(`/equipment/${task.equipmentId}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{task.equipmentName}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>{format(new Date(task.dueDate), 'PPP')}</TableCell>
                        <TableCell>
                          <Chip
                            label={getTaskStatusLabel(task.dueDate, task.isCompleted)}
                            color={getTaskStatusColor(task.dueDate, task.isCompleted)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaintenanceOverview; 