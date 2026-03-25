#!/usr/bin/env python3
"""
Arduino ↔ Server Serial Bridge
Self-Organizing Edge Network - Disaster Response IoT
"""

import serial
import json
import requests
import time
import sys
from datetime import datetime

# ⚠️  CONFIGURATION - CHANGE THESE FOR YOUR SETUP
SERIAL_PORT = 'COM3'  # ← UPDATE THIS TO YOUR ARDUINO'S COM PORT!
BAUD_RATE = 9600
SERVER_URL = 'http://localhost:3000/api/data/add'

# List of ports to try if auto-detection is needed
PORTS_TO_TRY = ['COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8']

def find_arduino_port():
    """Try to find Arduino port automatically"""
    import serial.tools.list_ports
    ports = serial.tools.list_ports.comports()
    
    if not ports:
        print("❌ No serial ports found!")
        return None
    
    print(f"✓ Found {len(ports)} serial port(s):")
    for i, port in enumerate(ports):
        print(f"  {i+1}. {port.device} - {port.description}")
    
    # Prefer USB devices (likely Arduino) over Bluetooth
    usb_ports = [p for p in ports if 'USB' in p.description]
    test_ports = usb_ports + ports if usb_ports else ports
    
    # Try each port (prioritizing USB)
    for port in test_ports:
        try:
            print(f"  Testing {port.device}...", end=" ", flush=True)
            ser = serial.Serial(port.device, BAUD_RATE, timeout=1)
            time.sleep(0.5)
            ser.close()
            print("✓")
            return port.device
        except Exception as e:
            print("✗")
            pass
    
    return None

def send_to_server(data):
    """Send sensor data to backend server"""
    try:
        payload = {
            'device_name': data.get('node_id', 'Arduino'),
            'location': data.get('location', 'Unknown'),
            'temperature': float(data.get('temperature', 0)),
            'humidity': float(data.get('humidity', 0))
        }
        
        response = requests.post(SERVER_URL, json=payload, timeout=5)
        
        if response.status_code == 200:
            print(f"✓ [{datetime.now().strftime('%H:%M:%S')}] Sent | {payload['device_name']} | "
                  f"Temp: {payload['temperature']}°C | Humidity: {payload['humidity']}%")
            return True
        else:
            print(f"✗ Server error ({response.status_code}): {response.text}")
            return False
            
    except requests.ConnectionError:
        print(f"✗ Cannot reach server. Is Node.js running on port 3000?")
        return False
    except Exception as e:
        print(f"✗ Error sending data: {str(e)}")
        return False

def main():
    print("╔════════════════════════════════════════╗")
    print("║  Arduino ↔ Server Serial Bridge        ║")
    print("║  Python Version                        ║")
    print("╚════════════════════════════════════════╝\n")
    
    # Try to auto-detect Arduino port
    print("🔍 Scanning for Arduino...\n")
    port = find_arduino_port()
    
    if not port:
        print(f"\n⚠️  Auto-detection failed. Trying default: {SERIAL_PORT}\n")
        port = SERIAL_PORT
    
    print(f"📡 Attempting to connect to {port} @ {BAUD_RATE} baud...\n")
    
    try:
        ser = serial.Serial(port, BAUD_RATE, timeout=2)
        print(f"✓ Connected to {port}!")
        print(f"📤 Forwarding data to: {SERVER_URL}\n")
        print("Waiting for Arduino data...\n")
        
        while True:
            try:
                if ser.in_waiting:
                    line = ser.readline().decode('utf-8', errors='replace').strip()
                    
                    if not line:
                        continue
                    
                    # Try to parse JSON
                    try:
                        data = json.loads(line)
                        send_to_server(data)
                    except json.JSONDecodeError:
                        # Show hex values to help diagnose
                        hex_chars = ' '.join(f'{ord(c):02x}' for c in line)
                        print(f"📝 Raw (HEX): {hex_chars}")
                        print(f"📝 Raw (TXT): {line}")
                        
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"⚠️  Error: {str(e)}")
                time.sleep(1)
    
    except serial.SerialException as e:
        print(f"❌ Cannot open port {port}")
        print(f"\n⚠️  Error: {str(e)}\n")
        print("SOLUTIONS:")
        print("1. Connect Arduino via USB")
        print("2. Find correct COM port:")
        print("   - Device Manager → Ports (COM & LPT)")
        print("   - Look for 'Arduino' or 'USB Device'")
        print("3. Update SERIAL_PORT = 'COMX' in this file")
        print("4. If no ports shown, install CH340 driver:")
        print("   - Search 'CH340 driver' online")
        print("   - Download and install for Windows")
        print("   - Restart computer")
        print("5. Run this script again\n")
        
        sys.exit(1)
    
    finally:
        if 'ser' in locals():
            ser.close()
            print("\n✓ Serial connection closed")

if __name__ == '__main__':
    main()
