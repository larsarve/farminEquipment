import axios from 'axios';
import { Equipment, MaintenanceTask } from '../types';

const API_BASE_URL = 'http://localhost:5011/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Request Details:', {
        url: request.url,
        method: request.method,
        data: request.data,
        parsedData: request.data ? JSON.parse(JSON.stringify(request.data)) : null,
        headers: request.headers
    });
    return request;
});

// Add response interceptor for error logging
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
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