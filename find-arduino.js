const { SerialPort } = require('serialport');

console.log('╔════════════════════════════════════════╗');
console.log('║  🔍 Arduino Port Detector              ║');
console.log('║  Finding connected serial devices      ║');
console.log('╚════════════════════════════════════════╝\n');

SerialPort.list().then(ports => {
  if (ports.length === 0) {
    console.log('❌ No serial ports found!');
    console.log('\n⚠️  TROUBLESHOOTING:\n');
    console.log('1. Is Arduino connected via USB?');
    console.log('2. Try a different USB cable');
    console.log('3. Try a different USB port on your computer');
    console.log('4. Check if Arduino LED is blinking (indicating power)');
    console.log('5. Install/Update CH340 or FTDI drivers:');
    console.log('   - Search "CH340 driver" or "FTDI driver"');
    console.log('   - Download for Windows');
    console.log('   - Install and restart computer');
    console.log('6. Run this script again\n');
    process.exit(1);
  }

  console.log(`✓ Found ${ports.length} serial port(s):\n`);
  
  ports.forEach((port, index) => {
    console.log(`${index + 1}. ${port.path}`);
    console.log(`   Manufacturer: ${port.manufacturer || 'Unknown'}`);
    console.log(`   Serial Number: ${port.serialNumber || 'N/A'}`);
    console.log(`   Product ID: ${port.productId || 'N/A'}`);
    console.log('');
  });

  console.log('📝 NEXT STEPS:');
  console.log('');
  console.log('1. Edit arduino-bridge.js');
  console.log('2. Find this line (around line 8):');
  console.log('   const SERIAL_PORT = \'COM3\';');
  console.log('');
  console.log('3. Replace COM3 with the port listed above');
  console.log('   Example: const SERIAL_PORT = \'' + (ports[0]?.path || 'COM?') + '\';');
  console.log('');
  console.log('4. Save and run:');
  console.log('   npm run arduino');
  console.log('');

}).catch(err => {
  console.log('❌ Error listing ports:', err.message);
  process.exit(1);
});
