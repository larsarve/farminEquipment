# Equipment Maintenance System

A full-stack web application for managing equipment maintenance tasks and history.

## Tech Stack

### Backend
- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQLite (for development)

### Frontend
- React
- TypeScript
- Material-UI
- Axios for API calls
- React Router for navigation

## Project Structure

```
equipment-maintenance/
├── EquipmentMaintenance.API/     # Backend API project
│   ├── Controllers/             # API endpoints
│   ├── Models/                  # Data models
│   └── Program.cs              # Application entry point
│
└── equipment-maintenance-client/ # Frontend React application
    ├── src/
    │   ├── components/         # React components
    │   ├── services/          # API service layer
    │   ├── types/            # TypeScript type definitions
    │   └── App.tsx          # Main application component
    └── package.json        # Frontend dependencies
```

## Getting Started

### Prerequisites
- .NET 7.0 SDK or later
- Node.js 16.x or later
- npm or yarn

### Backend Setup
1. Navigate to the API project directory:
   ```bash
   cd EquipmentMaintenance.API
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7001` and `http://localhost:5001`.

### Frontend Setup
1. Navigate to the client project directory:
   ```bash
   cd equipment-maintenance-client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Maintenance Tasks
Tasks are managed as part of the equipment resource:
- Add task: Update equipment with new task in maintenanceTasks array
- Complete task: Move task from maintenanceTasks to maintenanceHistory
- Delete task: Remove task from maintenanceTasks array

## Development Guidelines

### Code Style
- Follow C# coding conventions for backend code
- Use TypeScript strict mode
- Follow React best practices and hooks patterns
- Use functional components with TypeScript

### Git Workflow
1. Create feature branches from main
2. Use meaningful commit messages
3. Submit pull requests for review
4. Ensure all tests pass before merging

### Testing
- Write unit tests for API endpoints
- Test frontend components with React Testing Library
- Ensure cross-browser compatibility

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 