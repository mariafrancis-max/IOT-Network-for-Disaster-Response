const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Try COM3 first, then COM4 if not working
const PORTS_TO_TRY = ['COM3', 'COM4', 'COM5', 'COM6'];

console.log('╔════════════════════════════════════════╗');
console.log('║  📡 Arduino Serial Data Reader         ║');
console.log('║  Checking for sensor output            ║');
console.log('╚════════════════════════════════════════╝\n');

async function testPort(portName) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing ${portName}...`);
    
    const port = new SerialPort({ path: portName, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    let dataReceived = false;
    let timeout = setTimeout(() => {
      port.close();
      console.log(`   ❌ No data received from ${portName}\n`);
      resolve(false);
    }, 3000);

    port.on('error', (err) => {
      clearTimeout(timeout);
      port.close();
      console.log(`   ❌ Error: ${err.message}\n`);
      resolve(false);
    });

    port.on('open', () => {
      console.log(`   ✓ Port opened\n`);
    });

    parser.on('data', (line) => {
      if (!dataReceived) {
        dataReceived = true;
        clearTimeout(timeout);
        
        console.log(`   ✅ DATA FOUND ON ${portName}!\n`);
        console.log('Raw data from Arduino:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(line);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        port.close();
        resolve(true);
      }
    });
  });
}

async function findArduino() {
  console.log(`Checking ports: ${PORTS_TO_TRY.join(', ')}\n`);
  
  for (const port of PORTS_TO_TRY) {
    const found = await testPort(port);
    if (found) {
      console.log('✅ SUCCESS! Arduino found!\n');
      console.log('📝 UPDATE arduino-bridge.js:\n');
      console.log(`  const SERIAL_PORT = '${port}';  // ← Use this port\n`);
      console.log('Then run: npm run arduino\n');
      process.exit(0);
    }
  }

  console.log('❌ Arduino not responding on any port!\n');
  console.log('⚠️  SOLUTIONS:\n');
  console.log('1. Check if Arduino sketch is uploading successfully');
  console.log('2. Verify Serial.begin(9600) in your Arduino code');
  console.log('3. Try different USB cable or port');
  console.log('4. Install CH340 driver: https://bit.ly/CH340-driver');
  console.log('5. Restart computer after installing drivers');
  console.log('6. Open Arduino IDE Serial Monitor to verify Arduino is sending data');
  console.log('7. Check DHT sensor wiring\n');
  
  process.exit(1);
}

findArduino();
