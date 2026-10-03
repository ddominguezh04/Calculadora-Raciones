const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // ✨ seguridad: evita que JS acceda a tu sistema
            contextIsolation: true, // ✨ seguridad extra
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);
document.getElementById('calcular').addEventListener('click', () => {
    const personas = parseInt(document.getElementById('personas').value) || 0;
    const raciones = parseInt(document.getElementById('raciones').value) || 0;
    const total = personas * raciones;
    document.getElementById('resultado').textContent = `Total de raciones: ${total}`;
});

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch(err => console.log('Error SW:', err));
}