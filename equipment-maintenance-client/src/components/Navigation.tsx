import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Farming Equipment Maintenance
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderBottom: isActive('/') ? '2px solid white' : 'none',
            }}
          >
            Equipment List
          </Button>
          <Button
            color="inherit"
            startIcon={<ScheduleIcon />}
            onClick={() => navigate('/maintenance-schedule')}
            sx={{
              borderBottom: isActive('/maintenance-schedule') ? '2px solid white' : 'none',
            }}
          >
            Maintenance Schedule
          </Button>
          <Button
            color="inherit"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/maintenance-overview')}
            sx={{
              backgroundColor: isActive('/maintenance-overview') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Maintenance Overview
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 