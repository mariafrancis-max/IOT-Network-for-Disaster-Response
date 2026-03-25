const API_URL = 'http://localhost:3000/api';
let refreshInterval;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Auto-refresh every 5 seconds
    refreshInterval = setInterval(loadData, 5000);
    
    // Form submission
    document.getElementById('data-form').addEventListener('submit', handleFormSubmit);
    
    console.log('Dashboard initialized');
});

// Load all data
async function loadData() {
    try {
        // Load stats
        const statsResponse = await fetch(`${API_URL}/stats`);
        const stats = await statsResponse.json();
        updateStats(stats);
        
        // Load devices
        const devicesResponse = await fetch(`${API_URL}/devices`);
        const devices = await devicesResponse.json();
        displayDevices(devices);
        
        // Update network status
        updateNetworkStatus(devices.length > 0);
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        updateNetworkStatus(false);
    }
}

// Update stats display
function updateStats(stats) {
    document.getElementById('device-count').textContent = stats.total_devices || 0;
    document.getElementById('reading-count').textContent = stats.total_readings || 0;
    
    // Display latest readings
    if (stats.latest_data && stats.latest_data.length > 0) {
        displayLatestData(stats.latest_data);
    }
}

// Display all connected devices
function displayDevices(devices) {
    const devicesList = document.getElementById('devices-list');
    
    if (devices.length === 0) {
        devicesList.innerHTML = '<p class="loading">No devices connected yet</p>';
        return;
    }
    
    devicesList.innerHTML = devices.map(device => `
        <div class="device-card">
            <h3>📱 ${device.device_name}</h3>
            <div class="device-info">
                <strong>Type:</strong> ${device.device_type || 'Unknown'}
            </div>
            <div class="device-info">
                <strong>Status:</strong> 
                <span class="device-status ${device.status}">
                    ${device.status.toUpperCase()}
                </span>
            </div>
            <div class="device-info">
                <strong>Last Seen:</strong> ${formatTime(device.last_seen)}
            </div>
            <button onclick="showDeviceDetails('${device.device_name}')">View Details</button>
        </div>
    `).join('');
}

// Display latest sensor readings
function displayLatestData(data) {
    const liveData = document.getElementById('live-data');
    
    if (data.length === 0) {
        liveData.innerHTML = '<p class="loading">No readings available</p>';
        return;
    }
    
    liveData.innerHTML = data.map(reading => `
        <div class="data-entry">
            <h4>Reading ID: ${reading.id}</h4>
            <div class="data-values">
                ${reading.temperature !== null ? `
                    <div class="data-value">
                        <span class="data-label">🌡️ Temp:</span>
                        <span class="data-val">${reading.temperature}°C</span>
                    </div>
                ` : ''}
                ${reading.humidity !== null ? `
                    <div class="data-value">
                        <span class="data-label">💧 Humidity:</span>
                        <span class="data-val">${reading.humidity}%</span>
                    </div>
                ` : ''}
                ${reading.signal_strength !== null ? `
                    <div class="data-value">
                        <span class="data-label">📶 Signal:</span>
                        <span class="data-val">${reading.signal_strength}%</span>
                    </div>
                ` : ''}
                ${reading.location ? `
                    <div class="data-value">
                        <span class="data-label">📍 Location:</span>
                        <span class="data-val">${reading.location}</span>
                    </div>
                ` : ''}
                <div class="data-value">
                    <span class="data-label">⏰ Time:</span>
                    <span class="data-val">${formatTime(reading.timestamp)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show device details
async function showDeviceDetails(deviceName) {
    try {
        const response = await fetch(`${API_URL}/devices/${deviceName}`);
        const data = await response.json();
        
        if (data.length === 0) {
            alert('No data for this device yet');
            return;
        }
        
        let details = `Device: ${deviceName}\n\nRecent Readings:\n\n`;
        data.slice(0, 5).forEach((reading, index) => {
            details += `Reading ${index + 1}:\n`;
            if (reading.temperature) details += `  Temperature: ${reading.temperature}°C\n`;
            if (reading.humidity) details += `  Humidity: ${reading.humidity}%\n`;
            if (reading.location) details += `  Location: ${reading.location}\n`;
            if (reading.signal_strength) details += `  Signal: ${reading.signal_strength}%\n`;
            details += `  Time: ${formatTime(reading.timestamp)}\n\n`;
        });
        
        alert(details);
    } catch (error) {
        alert('Error loading device details');
        console.error(error);
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const deviceName = document.getElementById('device-name').value.trim();
    const temperature = parseFloat(document.getElementById('temperature').value) || null;
    const humidity = parseFloat(document.getElementById('humidity').value) || null;
    const location = document.getElementById('location').value.trim() || null;
    const signalStrength = parseInt(document.getElementById('signal').value) || null;
    
    try {
        const response = await fetch(`${API_URL}/data/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device_name: deviceName,
                temperature,
                humidity,
                location,
                signal_strength: signalStrength
            })
        });
        
        const result = await response.json();
        
        const messageDiv = document.getElementById('form-message');
        if (response.ok) {
            messageDiv.textContent = '✓ Data sent successfully!';
            messageDiv.className = 'success';
            document.getElementById('data-form').reset();
            loadData(); // Refresh immediately
        } else {
            messageDiv.textContent = '✗ Error: ' + result.error;
            messageDiv.className = 'error';
        }
        
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = '✗ Connection error';
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
        console.error('Error sending data:', error);
    }
}

// Update network status
function updateNetworkStatus(isOnline) {
    const statusElement = document.getElementById('network-status');
    if (isOnline) {
        statusElement.textContent = '🟢 ONLINE';
        statusElement.className = 'stat-status online';
    } else {
        statusElement.textContent = '🔴 OFFLINE';
        statusElement.className = 'stat-status';
    }
}

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(refreshInterval);
});
