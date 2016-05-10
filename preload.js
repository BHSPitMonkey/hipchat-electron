var electron = require('electron');

electron.ipcRenderer.on('zoom', function(event, message) {
    console.log("Got zoom request", event, message);
    electron.webFrame.setZoomFactor(message);
});