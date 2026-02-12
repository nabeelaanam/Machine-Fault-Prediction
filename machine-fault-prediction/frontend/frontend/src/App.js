import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Activity, Thermometer, Zap, Volume2, CheckCircle, XCircle, Clock } from 'lucide-react';

const MachineMonitoringDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSensor, setSelectedSensor] = useState('vibration');
  const [liveData, setLiveData] = useState({
    vibration: 0.5,
    temperature: 75.2,
    current: 12.3,
    sound: 45.8
  });
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, machine: 'Machine #5', message: 'Predicted failure within 24 hrs', type: 'critical', time: '2 min ago' },
    { id: 2, machine: 'Machine #2', message: 'Unusual vibration detected', type: 'warning', time: '15 min ago' },
    { id: 3, machine: 'Machine #7', message: 'Temperature threshold exceeded', type: 'warning', time: '1 hour ago' }
  ]);

  const [sensorHistory, setSensorHistory] = useState([
    { time: '10:00', vibration: 0.5, temperature: 74.1, current: 12.1, sound: 44.2 },
    { time: '10:05', vibration: 0.6, temperature: 75.3, current: 12.4, sound: 45.1 },
    { time: '10:10', vibration: 0.7, temperature: 76.2, current: 12.8, sound: 46.3 },
    { time: '10:15', vibration: 1.1, temperature: 78.5, current: 13.2, sound: 48.7 },
    { time: '10:20', vibration: 1.3, temperature: 79.1, current: 13.8, sound: 49.2 },
    { time: '10:25', vibration: 0.8, temperature: 77.3, current: 13.1, sound: 47.6 },
    { time: '10:30', vibration: 0.4, temperature: 75.8, current: 12.2, sound: 44.9 }
  ]);

  const [machineList] = useState([
    { id: 1, name: 'Machine A', status: 'Healthy', lastChecked: '2025-05-09', uptime: '99.2%' },
    { id: 2, name: 'Machine B', status: 'Warning', lastChecked: '2025-05-08', uptime: '97.8%' },
    { id: 3, name: 'Machine C', status: 'Faulty', lastChecked: '2025-05-07', uptime: '85.3%' },
    { id: 4, name: 'Machine D', status: 'Healthy', lastChecked: '2025-05-10', uptime: '98.9%' },
    { id: 5, name: 'Machine E', status: 'Warning', lastChecked: '2025-05-09', uptime: '96.5%' }
  ]);

  const statusCounts = {
    healthy: machineList.filter(m => m.status === 'Healthy').length,
    warning: machineList.filter(m => m.status === 'Warning').length,
    faulty: machineList.filter(m => m.status === 'Faulty').length
  };

  const pieData = [
    { name: 'Healthy', value: statusCounts.healthy, color: '#4ade80' },
    { name: 'Warning', value: statusCounts.warning, color: '#fbbf24' },
    { name: 'Faulty', value: statusCounts.faulty, color: '#f87171' }
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        vibration: Math.max(0, prev.vibration + (Math.random() - 0.5) * 0.1),
        temperature: Math.max(0, prev.temperature + (Math.random() - 0.5) * 2),
        current: Math.max(0, prev.current + (Math.random() - 0.5) * 0.5),
        sound: Math.max(0, prev.sound + (Math.random() - 0.5) * 3)
      }));

      // Simulate prediction
      const riskScore = Math.random();
      if (riskScore > 0.8) {
        setPrediction({ risk: 'High', probability: '87%', timeToFailure: '18 hours' });
      } else if (riskScore > 0.5) {
        setPrediction({ risk: 'Medium', probability: '34%', timeToFailure: '72 hours' });
      } else {
        setPrediction({ risk: 'Low', probability: '12%', timeToFailure: '> 1 week' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#4ade80';
      case 'Warning': return '#fbbf24';
      case 'Faulty': return '#f87171';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    return type === 'critical' ? <XCircle size={16} /> : <AlertTriangle size={16} />;
  };

  const getSensorIcon = (sensor) => {
    switch (sensor) {
      case 'vibration': return <Activity size={20} />;
      case 'temperature': return <Thermometer size={20} />;
      case 'current': return <Zap size={20} />;
      case 'sound': return <Volume2 size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const dashboardStyles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    nav: {
      display: 'flex',
      gap: '1rem'
    },
    navButton: {
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    content: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    },
    statusCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      minHeight: '120px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.1rem'
    },
    chartContainer: {
      height: '300px',
      marginTop: '1rem'
    },
    sensorSelect: {
      padding: '0.5rem',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      marginBottom: '1rem'
    },
    alertList: {
      maxHeight: '300px',
      overflowY: 'auto'
    },
    alertItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      fontSize: '0.9rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem'
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem',
      borderBottom: '2px solid #e5e7eb',
      fontWeight: '600',
      color: '#374151'
    },
    td: {
      padding: '0.75rem',
      borderBottom: '1px solid #e5e7eb'
    },
    liveDataGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    liveDataCard: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid #e2e8f0'
    },
    predictionCard: {
      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      color: 'white',
      borderRadius: '12px',
      padding: '1.5rem'
    }
  };

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.header}>
        <h1 style={dashboardStyles.title}>Machine Fault Prediction System</h1>
        <div style={dashboardStyles.nav}>
          <button 
            style={{...dashboardStyles.navButton, background: currentView === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            style={{...dashboardStyles.navButton, background: currentView === 'machines' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}}
            onClick={() => setCurrentView('machines')}
          >
            Machine List
          </button>
        </div>
      </div>

      <div style={dashboardStyles.content}>
        {currentView === 'dashboard' && (
          <>
            <h2 style={{marginBottom: '1.5rem', color: '#1f2937'}}>Machine Health Overview</h2>
            
            {/* Status Cards */}
            <div style={{...dashboardStyles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
              <div style={{...dashboardStyles.statusCard, background: 'linear-gradient(135deg, #10b981, #34d399)'}}>
                <CheckCircle size={32} style={{marginBottom: '0.5rem'}} />
                <div style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{statusCounts.healthy}</div>
                <div>Healthy</div>
              </div>
              <div style={{...dashboardStyles.statusCard, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}>
                <AlertTriangle size={32} style={{marginBottom: '0.5rem'}} />
                <div style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{statusCounts.warning}</div>
                <div>Warning</div>
              </div>
              <div style={{...dashboardStyles.statusCard, background: 'linear-gradient(135deg, #ef4444, #f87171)'}}>
                <XCircle size={32} style={{marginBottom: '0.5rem'}} />
                <div style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{statusCounts.faulty}</div>
                <div>Faulty</div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div style={dashboardStyles.grid}>
              {/* Live Sensor Data */}
              <div style={dashboardStyles.card}>
                <h3 style={{marginBottom: '1rem', color: '#1f2937'}}>Live Sensor Data</h3>
                <div style={dashboardStyles.liveDataGrid}>
                  <div style={dashboardStyles.liveDataCard}>
                    <Activity size={24} style={{color: '#3b82f6', marginBottom: '0.5rem'}} />
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>{liveData.vibration.toFixed(2)}</div>
                    <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Vibration</div>
                  </div>
                  <div style={dashboardStyles.liveDataCard}>
                    <Thermometer size={24} style={{color: '#ef4444', marginBottom: '0.5rem'}} />
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>{liveData.temperature.toFixed(1)}°F</div>
                    <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Temperature</div>
                  </div>
                  <div style={dashboardStyles.liveDataCard}>
                    <Zap size={24} style={{color: '#f59e0b', marginBottom: '0.5rem'}} />
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>{liveData.current.toFixed(1)}A</div>
                    <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Current</div>
                  </div>
                  <div style={dashboardStyles.liveDataCard}>
                    <Volume2 size={24} style={{color: '#8b5cf6', marginBottom: '0.5rem'}} />
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>{liveData.sound.toFixed(1)}dB</div>
                    <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Sound</div>
                  </div>
                </div>
              </div>

              {/* Prediction Card */}
              <div style={dashboardStyles.predictionCard}>
                <h3 style={{marginBottom: '1rem'}}>AI Fault Prediction</h3>
                {prediction && (
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span>Risk Level:</span>
                      <strong>{prediction.risk}</strong>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span>Probability:</span>
                      <strong>{prediction.probability}</strong>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>Time to Failure:</span>
                      <strong>{prediction.timeToFailure}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Alerts */}
              <div style={dashboardStyles.card}>
                <h3 style={{marginBottom: '1rem', color: '#1f2937'}}>Recent Alerts</h3>
                <div style={dashboardStyles.alertList}>
                  {alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      style={{
                        ...dashboardStyles.alertItem,
                        background: alert.type === 'critical' ? '#fef2f2' : '#fffbeb',
                        color: alert.type === 'critical' ? '#dc2626' : '#d97706'
                      }}
                    >
                      {getAlertIcon(alert.type)}
                      <div style={{flex: 1}}>
                        <strong>{alert.machine}</strong>
                        <div style={{fontSize: '0.8rem'}}>{alert.message}</div>
                      </div>
                      <Clock size={12} />
                      <span style={{fontSize: '0.8rem'}}>{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div style={dashboardStyles.grid}>
              {/* Sensor History Chart */}
              <div style={{...dashboardStyles.card, gridColumn: 'span 2'}}>
                <h3 style={{marginBottom: '1rem', color: '#1f2937'}}>Sensor History</h3>
                <div style={{marginBottom: '1rem'}}>
                  <label>Select Sensor: </label>
                  <select 
                    value={selectedSensor} 
                    onChange={(e) => setSelectedSensor(e.target.value)}
                    style={dashboardStyles.sensorSelect}
                  >
                    <option value="vibration">Vibration</option>
                    <option value="temperature">Temperature</option>
                    <option value="current">Current</option>
                    <option value="sound">Sound</option>
                  </select>
                </div>
                <div style={dashboardStyles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={selectedSensor} 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution */}
              <div style={dashboardStyles.card}>
                <h3 style={{marginBottom: '1rem', color: '#1f2937'}}>Machine Status Distribution</h3>
                <div style={{height: '250px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'machines' && (
          <div style={dashboardStyles.card}>
            <h2 style={{marginBottom: '1.5rem', color: '#1f2937'}}>Machine List</h2>
            <div style={{marginBottom: '1rem'}}>
              <label>Filter by status: </label>
              <select style={dashboardStyles.sensorSelect}>
                <option value="all">All</option>
                <option value="healthy">Healthy</option>
                <option value="warning">Warning</option>
                <option value="faulty">Faulty</option>
              </select>
            </div>
            <table style={dashboardStyles.table}>
              <thead>
                <tr>
                  <th style={dashboardStyles.th}>ID</th>
                  <th style={dashboardStyles.th}>Name</th>
                  <th style={dashboardStyles.th}>Status</th>
                  <th style={dashboardStyles.th}>Uptime</th>
                  <th style={dashboardStyles.th}>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {machineList.map(machine => (
                  <tr key={machine.id}>
                    <td style={dashboardStyles.td}>{machine.id}</td>
                    <td style={dashboardStyles.td}>{machine.name}</td>
                    <td style={{...dashboardStyles.td, color: getStatusColor(machine.status), fontWeight: 'bold'}}>
                      {machine.status}
                    </td>
                    <td style={dashboardStyles.td}>{machine.uptime}</td>
                    <td style={dashboardStyles.td}>{machine.lastChecked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineMonitoringDashboard;