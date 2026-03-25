# 🚨 IoT Disaster Response Network - Setup Guide

This guide will help you set up a complete web-based monitoring system for your IoT disaster response project.

## 📋 Project Structure

```
IOT-Network-for-Disaster-Response/
├── backend/              # Node.js API server
│   ├── server.js
│   └── package.json
├── frontend/             # Web Dashboard
│   ├── index.html
│   ├── style.css
│   └── script.js
├── arduino-code/         # Arduino/ESP32 code
│   └── Arduino_Example.ino
└── SETUP_GUIDE.md       # This file
```

---

## 🖥️ Backend Setup (Node.js + Express)

### Step 1: Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (recommended)
- Install and verify: `node --version` in terminal

### Step 2: Install Dependencies
Open PowerShell/Terminal and navigate to the backend folder:

```powershell
cd "C:\Users\Francis\PROJECTS\IOT-Network-for-Disaster-Response\backend"
npm install
```

This will install:
- **Express** - Web server framework
- **CORS** - Enable cross-origin requests
- **SQLite3** - Database for storing sensor data

### Step 3: Start the Server
```powershell
npm start
```

You should see:
```
IoT Server running at http://localhost:3000
Dashboard available at http://localhost:3000/index.html
Connected to SQLite database
```

✅ **Backend is running!**

---

## 🎨 Frontend Setup (Web Dashboard)

### Step 1: Open Dashboard
Simply open your browser and go to:
```
http://localhost:3000/
```

You should see the IoT Dashboard with:
- Real-time device list
- Sensor readings
- Network status
- Manual data input form

### Step 2: Live Features
- **Auto-refresh**: Dashboard updates every 5 seconds
- **Device tracking**: Shows all connected devices with status
- **Data visualization**: Latest sensor readings displayed
- **Manual testing**: Send test data using the form

---

## 📱 Arduino/ESP Setup

### Required Hardware:
- **ESP32** or **ESP8266** (WiFi-enabled Arduino)
- **DHT22** sensor (optional, for temperature/humidity)
- USB cable for programming
- WiFi network

### Step 1: Install Arduino IDE
1. Download: https://www.arduino.cc/en/software
2. Install and launch

### Step 2: Add ESP32 Board Support
1. Go to **File** → **Preferences**
2. Add this URL to "Additional Board Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Go to **Tools** → **Board** → **Boards Manager**
4. Search for "esp32" and click Install

### Step 3: Configure Arduino Code
Edit `Arduino_Example.ino`:

```cpp
// Line 15-16: Set your WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Line 19: Set your computer's local IP
const char* serverName = "http://192.168.1.XXX:3000/api/data/add";
```

**To find your computer's IP address:**
- Open Command Prompt
- Type: `ipconfig`
- Find "IPv4 Address" (usually starts with 192.168.x.x)
- Use this IP in the Arduino code

### Step 4: Upload Code
1. Connect ESP32 via USB
2. Go to **Tools** → **Board** → Select **ESP32 Dev Module**
3. Go to **Tools** → **Port** → Select your USB port
4. Click **Upload**

### Step 5: Monitor Data
1. Go to **Tools** → **Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   - WiFi connection status
   - Temperature and humidity readings
   - HTTP response from server
   - Success confirmations

---

## 📊 How It Works

### Data Flow:
```
Arduino/ESP32 
    ↓ (sends sensor data via HTTP)
Backend API (Node.js)
    ↓ (stores in SQLite database)
Frontend Dashboard
    ↓ (fetches data via API)
Browser Display (updates every 5 seconds)
```

### API Endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/devices` | Get all registered devices |
| GET | `/api/devices/:name` | Get specific device data |
| GET | `/api/stats` | Get dashboard statistics |
| POST | `/api/devices/register` | Register a new device |
| POST | `/api/data/add` | Add sensor reading |

---

## 🧪 Testing Without Arduino

You can test the entire system using the web form:

1. **Open Dashboard**: http://localhost:3000
2. **Scroll to "Send Test Data" section**
3. **Fill in values**:
   - Device Name: `Arduino_01`
   - Temperature: `22.5`
   - Humidity: `65`
   - Location: `Building A`
   - Signal Strength: `85`
4. **Click "Send Data"**
5. **See data appear** in the dashboard

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to localhost:3000"
- **Solution**: Make sure backend is running (`npm start`)
- Check if port 3000 is not blocked by firewall

### Issue: Arduino won't connect to WiFi
- **Solution**: Verify SSID and password are correct (case-sensitive)
- Check if your WiFi supports 2.4GHz (some don't support 5GHz)
- Verify ESP32 is working with `blink` example first

### Issue: Arduino connects but data doesn't reach server
- **Solution**: Verify your computer's IP is correct
- Make sure Arduino and computer are on **same WiFi network**
- Check firewall isn't blocking port 3000
- Run `ping 192.168.x.x` from Arduino Serial Monitor to test connection

### Issue: Database file not created
- **Solution**: Backend will create automatically on first run
- Check folder permissions
- Restart backend server

### Issue: Dashboard shows "OFFLINE"
- **Solution**: Make sure at least one IoT device sends data
- Check backend console for errors
- Refresh browser page

---

## 📈 Expanding Your Project

### Add More Sensors:
```cpp
// In Arduino code, add more sensor readings
float pressure = bmp.readPressure();  // From BMP280
float altitude = gps.altitude();      // From GPS module
```

### Store Additional Data:
```javascript
// In backend server.js, modify sensor_data table
db.run(`CREATE TABLE IF NOT EXISTS sensor_data (
  ...existing fields...
  pressure REAL,
  altitude REAL,
  ...
)`);
```

### Create Multiple Device Types:
- Temperature Stations
- Air Quality Monitors
- GPS Trackers
- Rescue Operation Coordinators

---

## 📚 Resources

- **Node.js Documentation**: https://nodejs.org/docs/
- **Express.js Guide**: https://expressjs.com/
- **Arduino IDE Help**: https://docs.arduino.cc/
- **ESP32 Documentation**: https://docs.espressif.com/
- **SQLite Guide**: https://www.sqlite.org/docs.html

---

## 🎯 Next Steps

1. ✅ Set up backend server
2. ✅ Test with web form
3. ✅ Program and upload Arduino
4. ✅ Monitor sensor data in real-time
5. ⚙️ Add more IoT devices
6. 📊 Create advanced analytics
7. 🗺️ Add map visualization for locations

---

## 💡 Tips for Success

- **Start Simple**: Test with manual form first before hardware
- **Document Everything**: Keep track of device IDs and locations
- **Monitor Logs**: Check backend console for debugging
- **Regular Backups**: Save your database periodically
- **Security**: In production, add authentication and HTTPS

---

## 📞 Support

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Check backend terminal for error messages
3. Review Arduino Serial Monitor output
4. Verify all credentials and IP addresses
5. Make sure all services are running

Good luck with your IoT Disaster Response project! 🚀
