var electron = require('electron');

electron.ipcRenderer.on('zoom', function(event, message) {
    electron.webFrame.setZoomFactor(message);
});

electron.ipcRenderer.on('jump-to-unread', function(event, message) {
    // Try to click a mention first
    let mentions = $('.hc-badge.hc-mention').size();
    if (mentions > 0) {
        $('.hc-badge.hc-mention').first().click();
    } else {
        $('.hc-badge').first().click();
    }
});