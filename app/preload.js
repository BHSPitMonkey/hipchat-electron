const electron = require('electron');

// Check for unread messages every n seconds and tell the main process
function refreshMentionCount() {
  let mentions = $('.hc-badge.hc-mention').size();
  electron.ipcRenderer.send('unread-count', mentions);
}
setInterval(refreshMentionCount, 2000);

// Handle zoom command from main process
electron.ipcRenderer.on('zoom', function(event, message) {
    electron.webFrame.setZoomFactor(message);
});

// Handle jump-to-unread command from main process
electron.ipcRenderer.on('jump-to-unread', function(event, message) {
    // Try to click a mention first
    let mentions = $('.hc-badge.hc-mention').size();
    if (mentions > 0) {
        $('.hc-badge.hc-mention').first().click();
    } else {
        $('.hc-badge').first().click();
    }

    refreshMentionCount();
});

// Handle close-room command from main process
electron.ipcRenderer.on('close-room', function(event, message) {
    // Click the close icon in the selected nav entry
    $('.aui-nav-selected').find('.hc-close-icon').click()
});