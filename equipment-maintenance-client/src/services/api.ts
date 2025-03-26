import axios from 'axios';
import { Equipment, MaintenanceTask } from '../types';

const API_BASE_URL = 'http://localhost:5011/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Request:', {
        url: request.url,
        method: request.method,
        data: JSON.stringify(request.data, null, 2),
        headers: request.headers
    });
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: JSON.stringify(response.data, null, 2)
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No data',
            message: error.message,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data ? JSON.stringify(JSON.parse(error.config.data), null, 2) : 'No data'
            }
        });
        return Promise.reject(error);
    }
);

export const equipmentApi = {
    getAll: () => api.get<Equipment[]>('/equipment'),
    getById: (id: string) => api.get<Equipment>(`/equipment/${id}`),
    create: (equipment: Omit<Equipment, 'id'>) => api.post<Equipment>('/equipment', equipment),
    update: (id: string, equipment: Equipment) => api.put<Equipment>(`/equipment/${id}`, equipment),
    delete: (id: string) => api.delete(`/equipment/${id}`),
    getAllMaintenanceTasks: () => api.get<MaintenanceTask[]>('/equipment/maintenance-tasks'),
}; 