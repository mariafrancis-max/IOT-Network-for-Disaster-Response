/*
  IoT Disaster Response - Arduino DHT Sensor
  Self-Organizing Edge Network
  
  HARDWARE SETUP:
  - DHT11 or DHT22 sensor
  - Pin 2 → DHT data pin
  - 5V → DHT power
  - GND → DHT ground
  - 10kΩ resistor (optional, pull-up between data and 5V)
  
  BAUD RATE: 9600
  
  OUTPUT: JSON format
  {"node_id":"NODE_01","location":"Building A","temperature":22.5,"humidity":65.2,"alert":false}
*/

#include <DHT.h>

// ==================== CONFIGURATION ====================
#define DHTPIN 2           // Pin connected to DHT sensor
#define DHTTYPE DHT22      // DHT22 (AM2302) - Change to DHT11 if using DHT11
#define NODE_ID "NODE_01"  // Unique identifier for this node
#define LOCATION "Building A"  // Physical location of this sensor
#define SEND_INTERVAL 3000 // Send data every 3 seconds (in milliseconds)

// ==================== SETUP ====================
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(9600);  // Must match Server bridge (9600 baud)
  delay(2000);         // Wait for serial to stabilize
  
  dht.begin();
  
  Serial.println("");
  Serial.println("╔═══════════════════════════════════════╗");
  Serial.println("║  IoT Disaster Response - Arduino     ║");
  Serial.println("║  DHT Sensor Node                     ║");
  Serial.println("╚═══════════════════════════════════════╝");
  Serial.print("Node ID: ");
  Serial.println(NODE_ID);
  Serial.print("Location: ");
  Serial.println(LOCATION);
  Serial.println("Waiting 5 seconds for sensor warm-up...");
  delay(5000);
  Serial.println("✓ Ready! Sending sensor data...\n");
}

// ==================== MAIN LOOP ====================
void loop() {
  unsigned long currentTime = millis();
  
  // Send data at specified intervals
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;
    sendSensorData();
  }
}

// ==================== FUNCTIONS ====================
void sendSensorData() {
  // Read sensor values
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();  // Celsius
  
  // Check if reading is valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("❌ DHT sensor error - check wiring!");
    return;
  }
  
  // Determine alert status (alert if temp > 30°C or humidity > 80%)
  boolean alert = (temperature > 30.0) || (humidity > 80.0);
  
  // Build JSON payload
  Serial.print("{");
  Serial.print("\"node_id\":\"");
  Serial.print(NODE_ID);
  Serial.print("\",");
  
  Serial.print("\"location\":\"");
  Serial.print(LOCATION);
  Serial.print("\",");
  
  Serial.print("\"temperature\":");
  Serial.print(temperature, 1);  // 1 decimal place
  Serial.print(",");
  
  Serial.print("\"humidity\":");
  Serial.print(humidity, 1);  // 1 decimal place
  Serial.print(",");
  
  Serial.print("\"alert\":");
  Serial.print(alert ? "true" : "false");
  
  Serial.println("}");
  
  // Debug info (optional - comment out to remove)
  // Serial.print("  ✓ Temp: ");
  // Serial.print(temperature);
  // Serial.print("°C, Humidity: ");
  // Serial.print(humidity);
  // Serial.println("%");
}
