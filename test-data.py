#!/usr/bin/env python3
"""
Quick Test - Send sample Arduino data to verify system works
"""

import requests
import json
from datetime import datetime

SERVER_URL = 'http://localhost:3000/api/data/add'

print('╔════════════════════════════════════════╗')
print('║  🧪 IoT System Test                    ║')
print('║  Sending sample sensor data            ║')
print('╚════════════════════════════════════════╝\n')

test_data = [
    {
        'device_name': 'NODE_01',
        'location': 'Building A - Floor 1',
        'temperature': 22.5,
        'humidity': 65,
        'signal_strength': 85
    },
    {
        'device_name': 'NODE_02',
        'location': 'Building B - Floor 2',
        'temperature': 23.1,
        'humidity': 62,
        'signal_strength': 78
    },
    {
        'device_name': 'NODE_03',
        'location': 'Building C - Outdoor',
        'temperature': 19.8,
        'humidity': 71,
        'signal_strength': 92
    }
]

print(f'📤 Sending {len(test_data)} test readings to {SERVER_URL}\n')

for data in test_data:
    try:
        response = requests.post(SERVER_URL, json=data, timeout=5)
        
        if response.status_code == 200:
            print(f'✅ {data["device_name"]} | {data["temperature"]}°C | {data["humidity"]}%')
        else:
            print(f'❌ Error ({response.status_code}): {response.text}')
    except requests.ConnectionError:
        print('❌ Cannot reach server! Is backend running on port 3000?')
        exit(1)
    except Exception as e:
        print(f'❌ Error: {str(e)}')

print('\n✅ Test complete!')
print('\n🌐 Open dashboard: http://localhost:3000')
print('You should now see 3 devices with sensor data!')
