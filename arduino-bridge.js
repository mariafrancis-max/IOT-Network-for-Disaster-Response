const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// Configuration
const SERIAL_PORT = 'COM3';  // Change this to your Arduino's COM port (COM3, COM4, etc.)
const BAUD_RATE = 9600;     // Must match Arduino code
const SERVER_URL = 'http://localhost:3000/api/data/add';

console.log('╔════════════════════════════════════════╗');
console.log('║  Arduino ↔ Server Serial Bridge        ║');
console.log('║  Disaster Response IoT System          ║');
console.log('╚════════════════════════════════════════╝\n');

console.log(`📡 Connecting to Serial Port: ${SERIAL_PORT} @ ${BAUD_RATE} baud...`);

const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('✓ Serial port opened successfully!');
  console.log(`📤 Forwarding data to: ${SERVER_URL}\n`);
});

parser.on('data', async (line) => {
  const trimmed = line.trim();
  
  // Skip empty lines
  if (!trimmed) return;
  
  // Log raw data
  console.log('📝 Raw from Arduino:', trimmed);

  try {
    // Parse JSON from Arduino
    const data = JSON.parse(trimmed);
    
    // Send to server
    const response = await axios.post(SERVER_URL, {
      device_name: data.node_id,
      location: data.location,
      temperature: parseFloat(data.temperature),
      humidity: parseFloat(data.humidity)
    });

    console.log(`✓ Sent to server | Status: ${response.status} | Node: ${data.node_id}`);
    console.log(`  Temp: ${data.temperature}°C | Humidity: ${data.humidity}% | Alert: ${data.alert}\n`);

  } catch (err) {
    if (err.response) {
      console.log(`✗ Server Error (${err.response.status}): ${err.response.data.error}`);
    } else if (err.code === 'ECONNREFUSED') {
      console.log('✗ Cannot reach server. Is Node.js server running on port 3000?');
    } else {
      console.log('✗ Error:', err.message);
    }
    console.log('');
  }
});

port.on('error', (err) => {
  console.log('✗ Serial Port Error:', err.message);
  console.log('\n⚠️  Troubleshooting:');
  console.log('  1. Is Arduino connected via USB?');
  console.log('  2. Find correct COM port:');
  console.log('     - Windows: Device Manager > Ports');
  console.log('     - Mac/Linux: ls /dev/tty.* or ls /dev/ttyUSB*');
  console.log('  3. Update SERIAL_PORT variable in this file\n');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down...');
  port.close(() => {
    console.log('Serial port closed');
    process.exit(0);
  });
});

console.log('💡 To find your Arduino COM port:');
console.log('   1. Connect Arduino via USB');
console.log('   2. Open Device Manager');
console.log('   3. Look under "Ports (COM & LPT)"');
console.log('   4. Update SERIAL_PORT = "COMX" in this file\n');
console.log('Waiting for Arduino data...\n');
