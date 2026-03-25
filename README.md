# 🚨 IoT Network for Disaster Response

## Project Overview

A **real-time web-based monitoring system** for IoT devices in disaster response scenarios. This project enables you to:

- 📊 Track multiple IoT devices (Arduino, ESP32, sensors) in real-time
- 🌡️ Monitor environmental data (temperature, humidity, signal strength)
- 🗺️ Display sensor locations and status
- 🔄 Auto-refresh dashboard every 5 seconds
- 💾 Store historical data in a local database
- 🌐 Host everything on localhost for quick deployment

---

## 🚀 Quick Start

### 1. **Setup Backend (Node.js)**
```powershell
cd backend
npm install
npm start
```
Server runs at: `http://localhost:3000`

### 2. **Open Dashboard**
Open browser: `http://localhost:3000`

### 3. **Test with Web Form**
Use the "Send Test Data" form to send sample readings

### 4. **Connect Arduino**
Program your ESP32/Arduino with the code in `arduino-code/Arduino_Example.ino` and it will automatically send data

---

## 📁 Project Structure

```
backend/          # Node.js API server with SQLite database
frontend/         # Web dashboard (HTML/CSS/JavaScript)
arduino-code/     # Arduino/ESP32 code for IoT devices
SETUP_GUIDE.md    # Complete setup instructions
```

---

## ✨ Features

- ✅ **Real-time Dashboard**: Live updates from all connected devices
- ✅ **Device Management**: Register and track multiple IoT devices
- ✅ **Sensor Data Storage**: SQLite database for historical records
- ✅ **Manual Testing**: Send test data via web form
- ✅ **Network Status**: Visual indicators for device connectivity
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Auto-Refresh**: Dashboard updates every 5 seconds
- ✅ **RESTful API**: Easy integration with any client

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/data/add` | Send sensor data from Arduino |
| GET | `/api/devices` | Get all connected devices |
| GET | `/api/stats` | Get dashboard statistics |

---

## 🔧 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Hardware**: Arduino, ESP32, WiFi-enabled microcontrollers

---

## 📚 Documentation

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for:
- ✅ Detailed installation steps
- ✅ Arduino programming instructions
- ✅ WiFi configuration
- ✅ Testing procedures
- ✅ Troubleshooting guide
- ✅ How to expand the project

---

## 🎯 What You Can Do Next

1. Add multiple sensor types (pressure, air quality, GPS)
2. Create real-time mapping of device locations
3. Add historical data visualization (charts/graphs)
4. Implement alerts for critical sensor values
5. Add user authentication
6. Deploy to cloud (AWS, Google Cloud, Azure)

---

## 👥 Team Project Tips

- Each team member can connect their own Arduino device
- All data syncs to the same shared dashboard
- Perfect for distributed disaster response monitoring
- Compare sensor readings from different locations

---

## ⚡ System Requirements

- Windows 10/11 with PowerShell
- Node.js 14+ (download from nodejs.org)
- Arduino IDE (for uploading code)
- ESP32/Arduino with WiFi capability
- Any sensor modules (DHT22, GPS, etc.)

---

## 📞 Need Help?

Follow the detailed **[SETUP_GUIDE.md](SETUP_GUIDE.md)** which includes:
- Step-by-step installation
- Troubleshooting section
- Code configuration examples
- Testing procedures

---

**Ready to start?** → Open [SETUP_GUIDE.md](SETUP_GUIDE.md) first! 🚀