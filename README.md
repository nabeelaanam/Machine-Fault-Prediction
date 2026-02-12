# Machine Fault Prediction System

A comprehensive machine fault prediction system with real-time monitoring, AI predictions, and interactive dashboard.

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
