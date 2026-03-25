# 🚀 Quick Arduino Setup - FINAL VERSION

## ⚡ The Problem
You have Arduino with DHT sensor sending data via Serial (USB), but it's not showing in dashboard.

## ✅ The Solution  
Use **Python bridge** - it's simpler and more reliable than Node.js for serial ports.

---

## 🎯 Complete Setup in 5 Minutes

### **Step 1: Make sure code is uploaded**
Open Arduino IDE → Load your sketch → Click **Upload**  
Wait for "Done uploading" message ✓

### **Step 2: Find your Arduino's COM port**

In **PowerShell**, run:
```powershell
Get-WmiObject Win32_PnPEntity | Where-Object { $_.Name -match 'COM' } | Select-Object Name
```

Or manually: **Device Manager → Ports (COM & LPT) → Look for Arduino**

**Write down the port:** COM3, COM4, COM5, etc.

### **Step 3: Update the bridge**

Edit file: [arduino-bridge.py](./arduino-bridge.py)

Line 13, change to YOUR port:
```python
SERIAL_PORT = 'COM3'  # ← Change to YOUR port number
```

**Example:** If you found COM5, write:
```python
SERIAL_PORT = 'COM5'
```

### **Step 4: Start everything (2 terminals needed)**

**Terminal 1 - Backend Server:**
```powershell
cd "C:\Users\Francis\PROJECTS\IOT-Network-for-Disaster-Response\backend"
node server.js
```

Wait for:
```
IoT Server running at http://localhost:3000
Connected to SQLite database
```

**Terminal 2 - Arduino Bridge:**
```powershell
cd "C:\Users\Francis\PROJECTS\IOT-Network-for-Disaster-Response"
python arduino-bridge.py
```

You should see:
```
✓ Connected to COM3!
📤 Forwarding data to: http://localhost:3000/api/data/add
Waiting for Arduino data...
```

### **Step 5: Check your Arduino is sending data**

Open **Arduino IDE → Tools → Serial Monitor**  
Set baud to **9600**  
You should see JSON output like:
```json
{"node_id":"NODE_01","location":"Building A - Floor 1","temperature":22.5,"humidity":65,"alert":"NORMAL"}
```

If no data appears:
- Check DHT wiring
- Verify resistor is connected
- Try different USB cable

### **Step 6: Check Dashboard**

Open browser: **http://localhost:3000**

✅ You should see:
```
Active Nodes: 1
Avg Temperature: 22.5°C
Avg Humidity: 65%

NODE_01 (Building A - Floor 1)
└─ Temperature: 22.5°C
└─ Humidity: 65%
```

---

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| "Cannot open port COM3" | Check correct port in Device Manager, update arduino-bridge.py |
| No data in Arduino Serial Monitor | Verify DHT sensor wiring, check power |
| Bridge connects but no data in dashboard | Arduino Serial Monitor showing JSON? If yes, check SERVER_URL |
| "Cannot reach server on port 3000" | Is backend running? Check Terminal 1 |
| Still not working | Try COM4, COM5, or COM6 if you have multiple ports |

---

## 📋 Checklist

- [ ] Arduino code uploaded
- [ ] Serial Monitor shows JSON (9600 baud)
- [ ] Found Arduino's COM port
- [ ] Updated SERIAL_PORT in arduino-bridge.py
- [ ] Backend running (Terminal 1)
- [ ] Bridge running (Terminal 2) 
- [ ] Dashboard shows device at http://localhost:3000
- [ ] Real-time data updating ✨

---

## 🚀 Once it works

You can add more Arduino nodes - just update NODE_ID and LOCATION in each device's code!

```cpp
String NODE_ID = "NODE_02";        // Different for each Arduino
String LOCATION = "Building B - Floor 2";
```

Need help? Post error messages in Terminal 2 output! 🎉
