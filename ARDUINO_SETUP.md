# 🏗️ Arduino Serial Setup Guide

Your Arduino code sends data via **Serial (USB cable)**, not WiFi. This guide shows how to connect it.

## Architecture

```
Arduino (DHT11/22)
    ↓ (Serial/USB)
arduino-bridge.js (Node.js)
    ↓ (HTTP)
Backend Server (port 3000)
    ↓
Dashboard (shows real-time data)
```

---

## ✅ Step 1: Upload Arduino Code

1. **Open Arduino IDE**
2. **Paste your code** into a new sketch
3. **Tools → Board** → Select your Arduino type:
   - Arduino Uno
   - Arduino Nano
   - Arduino Mega
4. **Tools → Port** → Select your COM port
5. **Click Upload** (→ button)
6. Wait for "Done uploading"

**✓ Arduino code is now running!**

---

## ✅ Step 2: Find Your Arduino's COM Port

### Windows:
1. **Connect Arduino via USB**
2. Open **Device Manager**
3. Look for **Ports (COM & LPT)**
4. You should see: **Arduino Uno (COM3)** or similar
5. **Write down the COM number** (COM3, COM4, etc.)

### Mac/Linux:
```bash
ls /dev/tty.*
# or
ls /dev/ttyUSB*
```

---

## ✅ Step 3: Update Bridge Configuration

Edit [arduino-bridge.js](../arduino-bridge.js):

```javascript
// Line 8 - Change COM3 to YOUR Arduino's port
const SERIAL_PORT = 'COM3';  // ← Update this!
```

**Before:**
```javascript
const SERIAL_PORT = 'COM3';
```

**After (example):**
```javascript
const SERIAL_PORT = 'COM5';   // Your Arduino's port
```

---

## ✅ Step 4: Start Everything

### Terminal 1 - Start Backend Server:
```powershell
cd "C:\Users\Francis\PROJECTS\IOT-Network-for-Disaster-Response"
npm run dev
```

Wait for message:
```
IoT Server running at http://localhost:3000
Connected to SQLite database
```

### Terminal 2 - Start Arduino Bridge:
```powershell
cd "C:\Users\Francis\PROJECTS\IOT-Network-for-Disaster-Response"
node arduino-bridge.js
```

You should see:
```
📡 Connecting to Serial Port: COM3 @ 9600 baud...
✓ Serial port opened successfully!
📤 Forwarding data to: http://localhost:3000/api/data/add

Waiting for Arduino data...
```

---

## ✅ Step 5: Open Dashboard

Open browser and go to:
```
http://localhost:3000
```

**You should see:**
- "Arduino_Sensor_01" appears in device list
- Temperature, humidity readings updating
- Data chart populating
- Events logged in real-time

---

## 🔧 Troubleshooting

### Arduino shows no data
**Problem:** Arduino isn't connecting or code crashed

**Fix:**
1. Open **Arduino IDE → Tools → Serial Monitor**
2. Set baud rate to **9600**
3. Check if you see JSON output like:
   ```json
   {"node_id":"NODE_01","temperature":22.5,"humidity":65%,"alert":"NORMAL"}
   ```
4. If nothing appears:
   - Check DHT sensor wiring
   - Verify VCC/GND connections
   - Try different USB cable

### Bridge says "Cannot find COM port"
**Problem:** Wrong port number

**Fix:**
1. Disconnect Arduino
2. Note ports in Device Manager
3. Connect Arduino
4. See which NEW port appears
5. Update `SERIAL_PORT = 'COMX'` with that port

### Dashboard shows no devices
**Problem:** Bridge not running or not forwarding data

**Fix:**
1. Check bridge terminal shows `✓ Sent to server`
2. Make sure server is running (port 3000 open)
3. Try sending manual test data from dashboard form

### "Port already open" error
**Problem:** Another program using the serial port

**Fix:**
```powershell
# Close all Arduino IDE windows
# Kill any stuck Node processes
taskkill /F /IM node.exe
# Try again
node arduino-bridge.js
```

---

## 📊 Expected Output

### Arduino Serial Monitor (9600 baud):
```
=== Disaster Response IoT Node Starting ===
Node ID: NODE_01
Location: Building A - Floor 1
==========================================
{"node_id":"NODE_01","location":"Building A - Floor 1","temperature":22.5,"humidity":65,"alert":"NORMAL"}
{"node_id":"NODE_01","location":"Building A - Floor 1","temperature":22.7,"humidity":64,"alert":"NORMAL"}
...
```

### Bridge Terminal:
```
📝 Raw from Arduino: {"node_id":"NODE_01","location":"Building A - Floor 1"...}
✓ Sent to server | Status: 200 | Node: NODE_01
  Temp: 22.5°C | Humidity: 65% | Alert: NORMAL
```

### Dashboard (http://localhost:3000):
```
Active Nodes: 1
Avg Temperature: 22.5°C
Avg Humidity: 65%
Alert Status: NORMAL

Live Sensor Nodes:
├─ NODE_01 (Building A - Floor 1)
│  ├─ Temperature: 22.5°C
│  ├─ Humidity: 65%
│  └─ Last update: 3:45:22 PM
```

---

## 🔄 Multiple Arduino Nodes

To connect multiple Arduinos:

1. **Arduino 1 (COM3):**
   - Node ID: NODE_01
   - Location: Building A

2. **Arduino 2 (COM4):**
   - Node ID: NODE_02
   - Location: Building B

Create separate bridges for each (or use a multi-port bridge script).

---

## 🎯 Next Steps

✅ Upload Arduino code  
✅ Find COM port  
✅ Update arduino-bridge.js  
✅ Start server & bridge  
✅ Monitor dashboard  
→ **Watch real-time IoT data!** 🎉

Got stuck? Check all steps again or provide error messages!
