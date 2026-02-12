# Machine Fault Prediction System

A comprehensive IoT-based machine fault prediction system with real-time monitoring, AI predictions, and interactive dashboard.

## Features

- 🔍 **Real-time Monitoring**: Live sensor data tracking (vibration, temperature, current, sound)
- 🤖 **AI Fault Prediction**: Machine learning-based fault prediction with risk assessment
- 📊 **Interactive Dashboard**: Power BI-like dashboard with charts and visualizations
- 🚨 **Alert System**: Real-time alerts for critical conditions
- 📈 **Historical Data**: Sensor data history and trend analysis
- 🔄 **Live Data Streaming**: WebSocket-based real-time data updates

## Project Structure

```
machine-fault-prediction/
├── backend/
│   ├── server.js              # Main backend server
│   ├── package.json           # Backend dependencies
│   └── machine_fault_dataset.csv  # Training dataset
├── frontend/
│   ├── src/
│   │   └── App.js            # React dashboard component
│   ├── package.json          # Frontend dependencies
│   └── public/
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Create backend directory and files:**
   ```bash
   mkdir machine-fault-prediction
   cd machine-fault-prediction
   mkdir backend
   cd backend
   ```

2. **Create the files:**
   - Copy `server.js` content to `backend/server.js`
   - Copy backend `package.json` to `backend/package.json`
   - Copy `machine_fault_dataset.csv` to `backend/machine_fault_dataset.csv`

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Create React app:**
   ```bash
   cd ..
   npx create-react-app frontend
   cd frontend
   ```

2. **Install additional dependencies:**
   ```bash
   npm install recharts lucide-react axios
   ```

3. **Replace App.js:**
   - Copy the React dashboard component to `frontend/src/App.js`
   - Update `frontend/package.json` with the provided version

4. **Start the frontend:**
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Machine Management
- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get specific machine
- `PUT /api/machines/:id` - Update machine status

### Sensor Data
- `GET /api/sensor-data` - Get historical sensor data
- `POST /api/sensor-data` - Add new sensor reading
- `POST /api/predict` - Get fault prediction

### Alerts & Dashboard
- `GET /api/alerts` - Get recent alerts
- `POST /api/alerts` - Create new alert
- `GET /api/dashboard` - Get dashboard summary
- `GET /api/training-stats` - Get ML training statistics

### WebSocket Real-time Data
- Connect to `ws://localhost:3001` for live sensor data and predictions

## Dataset Format

The system expects a CSV file with columns:
- `Air temperature [K]`
- `Process temperature [K]`
- `Torque [Nm]`
- `Tool wear [min]`
- `machine_fault` (0 = healthy, 1 = faulty)

## Features Overview

### Dashboard
- Machine health status overview
- Real-time sensor monitoring
- AI-powered fault predictions
- Interactive charts and graphs

### Machine List
- Complete machine inventory
- Status filtering
- Uptime tracking
- Last inspection dates

### Real-time Features
- Live sensor data updates
- Automatic alert generation
- WebSocket-based streaming
- Predictive analytics

## Customization

### Adding New Sensors
1. Update the `generateSensorData()` function in `server.js`
2. Modify the prediction algorithm in `predictFault()`
3. Add new sensor displays in the React component

### ML Model Integration
Replace the rule-based prediction in `predictFault()` with:
- TensorFlow.js models
- External ML API calls
- More sophisticated algorithms

### Database Integration
Replace in-memory storage with:
- MongoDB for document storage
- PostgreSQL for relational data
- InfluxDB for time-series data

## Production Deployment

### Backend
- Use PM2 for process management
- Set up environment variables
- Configure CORS for production domains
- Add authentication/authorization

### Frontend
- Build production version: `npm run build`
- Deploy to CDN or static hosting
- Configure API endpoints for production

## Troubleshooting

### Common Issues
1. **CSV not loading**: Ensure `machine_fault_dataset.csv` is in the backend directory
2. **CORS errors**: Check that frontend proxy is configured correctly
3. **WebSocket connection fails**: Verify backend server is running on port 3001

### Performance Optimization
- Limit sensor data history to prevent memory issues
- Implement data pagination for large datasets
- Use database for persistent storage in production

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Submit GitHub issues for bugs