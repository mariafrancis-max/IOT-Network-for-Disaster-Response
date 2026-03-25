/*
  IoT Disaster Response - Arduino Example Code
  
  This code connects an Arduino with WiFi (ESP8266 or ESP32) to the Node.js backend
  and sends sensor data (temperature, humidity, location) to the web server.
  
  Required Libraries:
  - MQTT or WiFiClient
  - DHT sensor library (for temperature/humidity)
  
  Hardware Needed:
  - Arduino/ESP8266/ESP32
  - DHT22 Temperature/Humidity Sensor (optional)
  - WiFi Shield or built-in WiFi
*/

#include <WiFi.h>
#include <HTTPClient.h>

// ========== WiFi Configuration ==========
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ========== Server Configuration ==========
const char* serverName = "http://192.168.1.XXX:3000/api/data/add";  // Change IP to your computer's local IP
const char* deviceName = "Arduino_Sensor_01";  // Unique device name
const char* deviceType = "ESP32";

// ========== Sensor Pins (for DHT22) ==========
#define DHTPIN 4  // GPIO pin connected to DHT22
#define DHTTYPE DHT22

// Include DHT library if you have sensors
// #include <DHT.h>
// DHT dht(DHTPIN, DHTTYPE);

// ========== Timing ==========
unsigned long lastTime = 0;
unsigned long timerDelay = 30000;  // Send data every 30 seconds

// ========== WiFi Connection Function ==========
void connectToWiFi() {
  Serial.println("\n\nStarting WiFi connection...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    attempts++;
    if (attempts > 20) {
      Serial.println("\nFailed to connect to WiFi");
      return;
    }
  }
  
  Serial.println("");
  Serial.println("WiFi connected successfully!");
  Serial.print("Connected to: ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ========== Send Data to Server ==========
void sendDataToServer(float temperature, float humidity, int signalStrength) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Create JSON payload
    String payload = "{";
    payload += "\"device_name\":\"" + String(deviceName) + "\",";
    payload += "\"temperature\":" + String(temperature) + ",";
    payload += "\"humidity\":" + String(humidity) + ",";
    payload += "\"location\":\"Disaster_Site_A\",";
    payload += "\"signal_strength\":" + String(signalStrength);
    payload += "}";
    
    Serial.println("\n=== Sending Data to Server ===");
    Serial.print("URL: ");
    Serial.println(serverName);
    Serial.print("Payload: ");
    Serial.println(payload);
    
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
      
      String response = http.getString();
      Serial.print("Server Response: ");
      Serial.println(response);
      
      if (httpResponseCode == 200) {
        Serial.println("✓ Data sent successfully!");
      }
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi is disconnected. Reconnecting...");
    connectToWiFi();
  }
}

// ========== Read Sensors ==========
void readSensors(float &temperature, float &humidity) {
  // If you're using DHT22 sensor:
  // temperature = dht.readTemperature();
  // humidity = dht.readHumidity();
  
  // For testing without sensors, generate random values:
  temperature = 20.0 + (random(-50, 50) / 10.0);  // 15-25°C
  humidity = 40.0 + (random(-200, 200) / 10.0);   // 20-60%
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
}

// ========== Get Signal Strength ==========
int getSignalStrength() {
  int rssi = WiFi.RSSI();
  // Convert RSSI to percentage (0-100)
  // Typical range: -100 (weak) to -30 (strong)
  int strength = map(rssi, -100, -30, 0, 100);
  strength = constrain(strength, 0, 100);
  return strength;
}

// ========== Setup ==========
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=== IoT Disaster Response System ===");
  Serial.println("Starting Arduino IoT Client...");
  
  // Initialize DHT sensor (if using DHT22)
  // dht.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("\nSystem ready! Waiting to send data...");
}

// ========== Main Loop ==========
void loop() {
  // Check if it's time to send data
  if ((millis() - lastTime) > timerDelay) {
    Serial.println("\n--- Data Collection Cycle ---");
    
    // Read sensor values
    float temperature = 0;
    float humidity = 0;
    readSensors(temperature, humidity);
    
    // Get signal strength
    int signalStrength = getSignalStrength();
    Serial.print("WiFi Signal Strength: ");
    Serial.print(signalStrength);
    Serial.println("%");
    
    // Send data to server
    sendDataToServer(temperature, humidity, signalStrength);
    
    lastTime = millis();
  }
}

/*
  SETUP INSTRUCTIONS:
  
  1. Install Arduino IDE: https://www.arduino.cc/en/software
  
  2. For ESP32, add board:
     - Go to File > Preferences
     - Add this URL to "Additional Board Manager URLs":
       https://dl.espressif.com/dl/package_esp32_index.json
     - Go to Tools > Board > Boards Manager
     - Search for "esp32" and install
  
  3. Install required libraries:
     - Sketch > Include Library > Manage Libraries
     - Search and install "DHT sensor library" (optional, for real sensors)
  
  4. Configuration:
     - Replace "YOUR_WIFI_SSID" with your WiFi network name
     - Replace "YOUR_WIFI_PASSWORD" with your WiFi password
     - Replace "192.168.1.XXX" with your computer's LOCAL IP address
       (Find it: Windows Command Prompt > ipconfig > IPv4 Address)
  
  5. Upload:
     - Connect Arduino via USB
     - Select correct Board and Port in Tools menu
     - Click Upload
  
  6. Monitor:
     - Open Serial Monitor (Tools > Serial Monitor)
     - Set baud rate to 115200
     - Watch data being sent to server
*/
