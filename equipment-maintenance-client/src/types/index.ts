export interface Equipment {
    id: string;
    name: string;
    description: string;
    type: string;
    maintenanceTasks: MaintenanceTask[];
    maintenanceHistory: MaintenanceHistory[];
}

export interface MaintenanceTask {
    id: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    equipmentId: string;
    equipmentName: string;
}

export interface MaintenanceHistory {
    id: string;
    description: string;
    completedDate: string;
    equipmentId: string;
    equipmentName: string;
} 