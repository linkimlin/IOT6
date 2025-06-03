// 配置参数
//const apiBase = window.location.origin;
//fetch(`${apiBase}/api/status`)
const API_URL = 'https://1e16-124-64-23-130.ngrok-free.app/api';

const UPDATE_INTERVAL = 1000;  // 更新间隔（毫秒）

// DOM元素
const elements = {
    temperature: document.getElementById('temperature'),
    humidity: document.getElementById('humidity'),
    light: document.getElementById('light'),
    lightAutoStatus: document.getElementById('light-auto-status'),
    acAutoStatus: document.getElementById('ac-auto-status')
};

// 按钮事件监听
document.getElementById('light-on').addEventListener('click', () => sendCommand('A'));
document.getElementById('light-off').addEventListener('click', () => sendCommand('B'));
document.getElementById('light-auto').addEventListener('click', () => sendCommand('H'));

document.getElementById('ac-on').addEventListener('click', () => sendCommand('F'));
document.getElementById('ac-off').addEventListener('click', () => sendCommand('G'));
document.getElementById('ac-auto').addEventListener('click', () => sendCommand('I'));

document.getElementById('curtain-open').addEventListener('click', () => sendCommand('C'));
document.getElementById('curtain-stop').addEventListener('click', () => sendCommand('D'));
document.getElementById('curtain-close').addEventListener('click', () => sendCommand('E'));

// 发送命令到服务器
async function sendCommand(command) {
    try {
        console.log('正在发送命令:', command);
        const response = await fetch(`${API_URL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command })
        });
        
        if (!response.ok) {
            throw new Error(`fishSend:HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('命令发送成功:', data);
        
        // 更新状态显示
        updateStatusDisplay(data);
    } catch (error) {
        console.error('发送命令错误:', error);
        alert('命令发送失败，请检查网络连接和服务器状态');
    }
}

// 更新状态显示
function updateStatusDisplay(data) {
    if (data.lightAuto !== undefined) {
        elements.lightAutoStatus.textContent = data.lightAuto ? '开启' : '关闭';
    }
    if (data.acAuto !== undefined) {
        elements.acAutoStatus.textContent = data.acAuto ? '开启' : '关闭';
    }
}

// 更新传感器数据
async function updateSensorData() {
    try {
        const response = await fetch(`${API_URL}/status`,{
    headers: {
      'ngrok-skip-browser-warning': '12345',
    },
    });
        if (!response.ok) {
            throw new Error(`fishUpdtHTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('收到数据:', data);
        
        // 更新传感器数据显示
        elements.temperature.textContent = `${data.temperature} ℃`;
        elements.humidity.textContent = `${data.humidity} %`;
        elements.light.textContent = `${data.light} lux`;
        
        // 更新状态显示
        updateStatusDisplay(data);
    } catch (error) {
        console.error('fish更新数据错误:', error);
    }
}

// 定期更新数据
setInterval(updateSensorData, UPDATE_INTERVAL);
updateSensorData();  // 立即执行一次更新 
