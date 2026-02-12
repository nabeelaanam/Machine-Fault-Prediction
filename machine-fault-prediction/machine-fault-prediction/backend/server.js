const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data storage
let machines = [
  { id: 1, name: 'Machine A', status: 'Healthy', lastChecked: '2025-05-09', uptime: '99.2%' },
  { id: 2, name: 'Machine B', status: 'Warning', lastChecked: '2025-05-08', uptime: '97.8%' },
  { id: 3, name: 'Machine C', status: 'Faulty', lastChecked: '2025-05-07', uptime: '85.3%' },
  { id: 4, name: 'Machine D', status: 'Healthy', lastChecked: '2025-05-10', uptime: '98.9%' },
  { id: 5, name: 'Machine E', status: 'Warning', lastChecked: '2025-05-09', uptime: '96.5%' }
];

let alerts = [
  { id: 1, machine: 'Machine #5', message: 'Predicted failure within 24 hrs', type: 'critical', time: '2 min ago', timestamp: new Date() },
  { id: 2, machine: 'Machine #2', message: 'Unusual vibration detected', type: 'warning', time: '15 min ago', timestamp: new Date() },
  { id: 3, machine: 'Machine #7', message: 'Temperature threshold exceeded', type: 'warning', time: '1 hour ago', timestamp: new Date() }
];

let sensorData = [];
let trainingData = [];

// Load training data from CSV
function loadTrainingData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('machine_fault_dataset.csv')
      .pipe(csv())
      .on('data', (data) => {
        // Convert string values to numbers
        const row = {
          airTemperature: parseFloat(data['Air temperature [K]']) || 0,
          processTemperature: parseFloat(data['Process temperature [K]']) || 0,
          torque: parseFloat(data['Torque [Nm]']) || 0,
          toolWear: parseInt(data['Tool wear [min]']) || 0,
          machineFault: parseInt(data['machine_fault']) || 0
        };
        results.push(row);
      })
      .on('end', () => {
        trainingData = results;
        console.log(`Loaded ${trainingData.length} training samples`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// Simple ML prediction function (simplified for demo)
function predictFault(sensorValues) {
  const { vibration, temperature, current, sound } = sensorValues;
  
  // Simple rule-based prediction (in real scenario, use trained ML model)
  let riskScore = 0;
  
  // Vibration analysis
  if (vibration > 1.2) riskScore += 0.3;
  else if (vibration > 0.8) riskScore += 0.1;
  
  // Temperature analysis
  if (temperature > 80) riskScore += 0.25;
  else if (temperature > 75) riskScore += 0.1;
  
  // Current analysis
  if (current > 15) riskScore += 0.2;
  else if (current > 13) riskScore += 0.05;
  
  // Sound analysis
  if (sound > 50) riskScore += 0.15;
  else if (sound > 45) riskScore += 0.05;
  
  // Additional factors from training data
  if (trainingData.length > 0) {
    const avgToolWear = trainingData.reduce((sum, row) => sum + row.toolWear, 0) / trainingData.length;
    if (avgToolWear > 150) riskScore += 0.1;
  }
  
  let risk = 'Low';
  let probability = Math.floor(riskScore * 100);
  let timeToFailure = '> 1 week';
  
  if (riskScore > 0.7) {
    risk = 'High';
    probability = Math.min(90, 70 + Math.floor(riskScore * 20));
    timeToFailure = '12-24 hours';
  } else if (riskScore > 0.4) {
    risk = 'Medium';
    probability = Math.min(60, 30 + Math.floor(riskScore * 30));
    timeToFailure = '2-3 days';
  }
  
  return {
    risk,
    probability: `${probability}%`,
    timeToFailure,
    riskScore: riskScore.toFixed(3)
  };
}

// Generate realistic sensor data
function generateSensorData() {
  const baseTemp = 75 + Math.sin(Date.now() / 60000) * 5;
  const baseVibration = 0.5 + Math.sin(Date.now() / 30000) * 0.3;
  
  return {
    timestamp: new Date().toISOString(),
    vibration: Math.max(0, baseVibration + (Math.random() - 0.5) * 0.2),
    temperature: Math.max(0, baseTemp + (Math.random() - 0.5) * 3),
    current: Math.max(0, 12 + (Math.random() - 0.5) * 2),
    sound: Math.max(0, 45 + (Math.random() - 0.5) * 8)
  };
}

// WebSocket connection for real-time data
wss.on('connection', (ws) => {
  console.log('Client connected for real-time data');
  
  const sendData = () => {
    const currentSensorData = generateSensorData();
    const prediction = predictFault(currentSensorData);
    
    ws.send(JSON.stringify({
      type: 'sensor_data',
      data: currentSensorData,
      prediction: prediction
    }));
  };
  
  // Send data every 3 seconds
  const interval = setInterval(sendData, 3000);
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

// API Routes

// Get all machines
app.get('/api/machines', (req, res) => {
  const { status } = req.query;
  let filteredMachines = machines;
  
  if (status && status !== 'all') {
    filteredMachines = machines.filter(m => m.status.toLowerCase() === status.toLowerCase());
  }
  
  res.json(filteredMachines);
});

// Get machine by ID
app.get('/api/machines/:id', (req, res) => {
  const machine = machines.find(m => m.id === parseInt(req.params.id));
  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }
  res.json(machine);
});

// Update machine status
app.put('/api/machines/:id', (req, res) => {
  const machine = machines.find(m => m.id === parseInt(req.params.id));
  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }
  
  const { status, uptime } = req.body;
  if (status) machine.status = status;
  if (uptime) machine.uptime = uptime;
  machine.lastChecked = new Date().toISOString().split('T')[0];
  
  res.json(machine);
});

// Get sensor data
app.get('/api/sensor-data', (req, res) => {
  const { limit = 50, sensor } = req.query;
  let data = sensorData.slice(-parseInt(limit));
  
  if (sensor) {
    data = data.map(item => ({
      timestamp: item.timestamp,
      value: item[sensor]
    }));
  }
  
  res.json(data);
});

// Add new sensor reading
app.post('/api/sensor-data', (req, res) => {
  const { vibration, temperature, current, sound } = req.body;
  
  const newReading = {
    timestamp: new Date().toISOString(),
    vibration: parseFloat(vibration),
    temperature: parseFloat(temperature),
    current: parseFloat(current),
    sound: parseFloat(sound)
  };
  
  sensorData.push(newReading);
  
  // Keep only last 1000 readings
  if (sensorData.length > 1000) {
    sensorData = sensorData.slice(-1000);
  }
  
  // Generate prediction
  const prediction = predictFault(newReading);
  
  // Check for alerts
  if (prediction.risk === 'High') {
    const alert = {
      id: Date.now(),
      machine: 'Machine #' + Math.floor(Math.random() * 10 + 1),
      message: `High fault risk detected: ${prediction.probability} probability`,
      type: 'critical',
      time: 'just now',
      timestamp: new Date()
    };
    alerts.unshift(alert);
    alerts = alerts.slice(0, 10); // Keep only last 10 alerts
  }
  
  res.json({
    reading: newReading,
    prediction: prediction
  });
});

// Get predictions
app.post('/api/predict', (req, res) => {
  const { vibration, temperature, current, sound } = req.body;
  
  if (!vibration || !temperature || !current || !sound) {
    return res.status(400).json({ error: 'Missing sensor data' });
  }
  
  const prediction = predictFault({ vibration, temperature, current, sound });
  res.json(prediction);
});

// Get alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// Add new alert
app.post('/api/alerts', (req, res) => {
  const { machine, message, type } = req.body;
  
  const alert = {
    id: Date.now(),
    machine,
    message,
    type: type || 'warning',
    time: 'just now',
    timestamp: new Date()
  };
  
  alerts.unshift(alert);
  alerts = alerts.slice(0, 10);
  
  res.json(alert);
});

// Get dashboard summary
app.get('/api/dashboard', (req, res) => {
  const summary = {
    machineCount: {
      total: machines.length,
      healthy: machines.filter(m => m.status === 'Healthy').length,
      warning: machines.filter(m => m.status === 'Warning').length,
      faulty: machines.filter(m => m.status === 'Faulty').length
    },
    recentAlerts: alerts.slice(0, 5),
    currentSensorData: generateSensorData(),
    lastUpdated: new Date().toISOString()
  };
  
  summary.prediction = predictFault(summary.currentSensorData);
  
  res.json(summary);
});

// Get training data statistics
app.get('/api/training-stats', (req, res) => {
  if (trainingData.length === 0) {
    return res.json({ message: 'No training data loaded' });
  }
  
  const stats = {
    totalSamples: trainingData.length,
    faultySamples: trainingData.filter(row => row.machineFault === 1).length,
    healthySamples: trainingData.filter(row => row.machineFault === 0).length,
    averages: {
      airTemperature: trainingData.reduce((sum, row) => sum + row.airTemperature, 0) / trainingData.length,
      processTemperature: trainingData.reduce((sum, row) => sum + row.processTemperature, 0) / trainingData.length,
      torque: trainingData.reduce((sum, row) => sum + row.torque, 0) / trainingData.length,
      toolWear: trainingData.reduce((sum, row) => sum + row.toolWear, 0) / trainingData.length
    }
  };
  
  res.json(stats);
});

// Simulate real-time data generation
setInterval(() => {
  const newReading = generateSensorData();
  sensorData.push(newReading);
  
  // Keep only last 1000 readings
  if (sensorData.length > 1000) {
    sensorData = sensorData.slice(-1000);
  }
  
  // Occasionally generate alerts
  if (Math.random() < 0.1) { // 10% chance every interval
    const prediction = predictFault(newReading);
    if (prediction.risk !== 'Low') {
      const alert = {
        id: Date.now(),
        machine: 'Machine #' + Math.floor(Math.random() * 10 + 1),
        message: `${prediction.risk} risk detected - ${prediction.probability} failure probability`,
        type: prediction.risk === 'High' ? 'critical' : 'warning',
        time: 'just now',
        timestamp: new Date()
      };
      alerts.unshift(alert);
      alerts = alerts.slice(0, 10);
    }
  }
}, 5000); // Every 5 seconds

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize and start server
async function startServer() {
  try {
    // Try to load training data
    try {
      await loadTrainingData();
    } catch (error) {
      console.log('Warning: Could not load training data. Using default behavior.');
      console.log('Make sure machine_fault_dataset.csv exists in the project directory.');
    }
    
    // Generate initial sensor data
    for (let i = 0; i < 50; i++) {
      sensorData.push(generateSensorData());
    }
    
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Dashboard available at http://localhost:${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
      console.log(`WebSocket server running for real-time data`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();