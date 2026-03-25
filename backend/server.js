const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database setup
const db = new sqlite3.Database('./IoT_data.db', (err) => {
  if (err) console.log('Error opening database:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_name TEXT NOT NULL UNIQUE,
    device_type TEXT,
    status TEXT DEFAULT 'offline',
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER,
    temperature REAL,
    humidity REAL,
    location TEXT,
    signal_strength INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(device_id) REFERENCES devices(id)
  )`);
});

// ============== API ENDPOINTS ==============

// GET all devices with latest sensor data
app.get('/api/devices', (req, res) => {
  const query = `
    SELECT 
      d.id,
      d.device_name,
      d.device_type,
      d.status,
      d.last_seen,
      COALESCE(s.temperature, 0) AS temperature,
      COALESCE(s.humidity, 0) AS humidity,
      COALESCE(s.location, 'Unknown') AS location,
      COALESCE(s.signal_strength, 0) AS signal_strength
    FROM devices d
    LEFT JOIN (
      SELECT device_id, temperature, humidity, location, signal_strength, timestamp
      FROM sensor_data
      WHERE timestamp = (
        SELECT MAX(timestamp) FROM sensor_data s2 WHERE s2.device_id = sensor_data.device_id
      )
    ) s ON d.id = s.device_id
    ORDER BY d.last_seen DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// GET specific device data
app.get('/api/devices/:device_name', (req, res) => {
  const deviceName = req.params.device_name;
  db.get('SELECT id FROM devices WHERE device_name = ?', [deviceName], (err, device) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    db.all(
      'SELECT * FROM sensor_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100',
      [device.id],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      }
    );
  });
});

// POST: Register a new device
app.post('/api/devices/register', (req, res) => {
  const { device_name, device_type } = req.body;

  if (!device_name) {
    res.status(400).json({ error: 'Device name is required' });
    return;
  }

  db.run(
    'INSERT INTO devices (device_name, device_type, status) VALUES (?, ?, ?)',
    [device_name, device_type || 'Unknown', 'online'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(409).json({ error: 'Device already registered' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.json({ id: this.lastID, device_name, status: 'online' });
    }
  );
});

// POST: Add sensor data from Arduino
app.post('/api/data/add', (req, res) => {
  const { device_name, temperature, humidity, location, signal_strength } = req.body;

  if (!device_name) {
    res.status(400).json({ error: 'Device name is required' });
    return;
  }

  // First get device ID
  db.get('SELECT id FROM devices WHERE device_name = ?', [device_name], (err, device) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!device) {
      // Auto-register new devices
      db.run(
        'INSERT INTO devices (device_name, status) VALUES (?, ?)',
        [device_name, 'online'],
        function (registerErr) {
          if (registerErr) {
            res.status(500).json({ error: registerErr.message });
            return;
          }
          insertSensorData(this.lastID);
        }
      );
    } else {
      insertSensorData(device.id);
    }

    function insertSensorData(deviceId) {
      db.run(
        'INSERT INTO sensor_data (device_id, temperature, humidity, location, signal_strength) VALUES (?, ?, ?, ?, ?)',
        [deviceId, temperature, humidity, location, signal_strength],
        function (insertErr) {
          if (insertErr) {
            res.status(500).json({ error: insertErr.message });
            return;
          }
          // Update device last_seen
          db.run('UPDATE devices SET last_seen = CURRENT_TIMESTAMP, status = ? WHERE id = ?', ['online', deviceId]);
          res.json({ success: true, data_id: this.lastID });
        }
      );
    }
  });
});

// GET: Dashboard stats
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as total_devices FROM devices', (err, deviceCount) => {
    db.get('SELECT COUNT(*) as total_readings FROM sensor_data', (err2, readingCount) => {
      db.all(
        'SELECT device_name, temperature, humidity FROM sensor_data WHERE id IN (SELECT MAX(id) FROM sensor_data GROUP BY device_id)',
        (err3, latestData) => {
          res.json({
            total_devices: deviceCount.total_devices,
            total_readings: readingCount.total_readings,
            latest_data: latestData
          });
        }
      );
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`IoT Server running at http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/index.html`);
});

module.exports = app;
