'use strict';

const electron = require('electron');
const open = require('open');
const storage = require('electron-json-storage');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Menu = electron.Menu;
const Tray = electron.Tray;
const dialog = electron.dialog;

const DEFAULT_CHAT_URL = "https://www.hipchat.com/chat";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var appIcon = null;
var prefs = {};
var forceQuit = false;

// Save current contents of prefs to disk
function persistPrefs() {
  storage.set('prefs', prefs, function(error) {
    if (error) console.log("Couldn't persist prefs due to storage error: ", error);
  });
}

// Actually quit the app (just calling app.quit() gets thwarted by our window close handler)
function quit() {
  forceQuit = true;
  app.quit();
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Load prefs
  storage.get('prefs', function(error, data) {
    if (error) console.log("Could not load prefs from storage:", error, data);
    prefs = data;

    function logOut() {
      mainWindow.webContents.session.clearStorageData({}, function() { mainWindow.loadURL(DEFAULT_CHAT_URL); });
      delete prefs['custom_chat_url'];
      persistPrefs();
    }

    // Adjust main window zoom level. Mode should be 1 to zoom in, 0 to reset, or -1 to zoom out.
    function zoom(mode) {
        if (!prefs['zoom']) {
            prefs['zoom'] = 1.0;
        }

        // Modify zoom
        if (mode == 0) {
            prefs['zoom'] = 1.0;
        } else {
            prefs['zoom'] += (mode * 0.2);
        }

        // Modify mainWindow zoom to newZoom
        // TODO: Communicate this to the renderer process and use webFrame.setZoomFactor
        dialog.showMessageBox(null, {
            type: "info",
            title: "Zoom level changed",
            message: "Zoom level will be " + (prefs['zoom']).toFixed(1) + " after restart.",
            buttons: ["Okay"],
        });

        persistPrefs();
    }

    // Get display info
    var electronScreen = electron.screen;
    var primaryDisplay = electronScreen.getPrimaryDisplay();
    var defaultWidth = ('windowWidth' in prefs) ? prefs['windowWidth'] : Math.floor(primaryDisplay.workAreaSize.width * 0.9);
    var defaultHeight = ('windowHeight' in prefs) ? prefs['windowHeight'] : Math.floor(primaryDisplay.workAreaSize.height * 0.9);
    var defaultX = ('windowX' in prefs) ? prefs['windowX'] : Math.floor(primaryDisplay.workAreaSize.height * 0.9);
    var defaultY = ('windowY' in prefs) ? prefs['windowY'] : Math.floor(primaryDisplay.workAreaSize.height * 0.9);
    var defaultZoom = ('zoom' in prefs) ? prefs['zoom'] : 1.0;

    // Prepare window options
    var windowOptions = {
      width: defaultWidth,
      height: defaultHeight,
      icon: 'images/256x256/hipchat.png',
      webPreferences: {
        zoomFactor: defaultZoom, // TODO: allow CLI override
        nodeIntegration: false,
      }
    };
    if ('windowX' in prefs) windowOptions['x'] = prefs['windowX'];
    if ('windowY' in prefs) windowOptions['y'] = prefs['windowX'];

    // Create the browser window
    mainWindow = new BrowserWindow(windowOptions);

    // Prevent closing the window (only hide it)
    mainWindow.on('close', function (event) {
      if (!forceQuit) {
        event.preventDefault();
        mainWindow.hide();
      }
    });

    // Handle resize events and save to prefs
    mainWindow.on('resize', function (event) {
      var size = mainWindow.getSize();
      prefs['windowWidth'] = size[0];
      prefs['windowHeight'] = size[1];
      persistPrefs();
    });

    // Handle move events and save to prefs
    mainWindow.on('move', function (event) {
      var position = mainWindow.getPosition();
      prefs['windowX'] = position[0];
      prefs['windowY'] = position[1];
      persistPrefs();
    });

    mainWindow.setMenu(Menu.buildFromTemplate([
      {
        label: "HipChat",
        submenu: [
            { label: "Logout", click: function() { logOut(); } },
            { label: "Quit", click: function() { quit(); } },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          },
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.reload();
            }
          },
          {
            label: 'Toggle Full Screen',
            accelerator: (function() {
              if (process.platform == 'darwin')
                return 'Ctrl+Command+F';
              else
                return 'F11';
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
              if (process.platform == 'darwin')
                return 'Alt+Command+I';
              else
                return 'Ctrl+Shift+I';
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.webContents.toggleDevTools();
            }
          },
          { type: 'separator' },
          { label: "Zoom In", accelerator: 'CmdOrCtrl+=', click: function() { zoom(1); } },
          { label: "Zoom Out", accelerator: 'CmdOrCtrl+-', click: function() { zoom(-1); } },
          { label: "Reset Zoom", accelerator: 'CmdOrCtrl+0', click: function() { zoom(0); } },
        ]
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
        ]
      }
    ]));

    // Intercept 'new-window' event so we can open links in the OS default browser
    mainWindow.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      open(url);
    });

    // Intercept 'did-navigate' event so we can learn when we've been redirected to a specific chat portal
    mainWindow.webContents.on('did-navigate', function(event, url) {
      // If URL looks like a /chat portal, save it to storage
      if (url.match(/^https:\/\/.*\.hipchat\.com\/chat/) !== null) {
        prefs['custom_chat_url'] = url;
        persistPrefs();
      }

      // If URL looks like a /home page, log out
      if (url.match(/^https:\/\/.*\.hipchat\.com\/home/) !== null) {
        logOut();
      }
    });

    // Load the URL (from storage, else use default)
    var chat_url = DEFAULT_CHAT_URL;
    if ('custom_chat_url' in prefs && prefs['custom_chat_url'] !== null) {
      chat_url = prefs['custom_chat_url'];
      console.log("Got custom chat URL from prefs: " + chat_url);
    }
    mainWindow.loadURL(chat_url);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    // Set up tray icon
    appIcon = new Tray('images/32x32/hipchat-mono.png'); // TODO: Use different icon for each OS
    var contextMenu = Menu.buildFromTemplate([
      { label: 'Show HipChat', type: 'normal', click: function() { mainWindow.show(); mainWindow.focus(); } },
      //{ type: 'separator' }, // TODO: Figure these actions out
      //{ label: 'Join Chat', type: 'normal' },
      //{ type: 'separator' },
      //{ label: 'Settings', type: 'normal' },
      { type: 'separator' },
      { label: 'Logout', type: 'normal', click: function() { logOut(); } },
      { label: 'Quit HipChat', type: 'normal', click: function() { quit(); } },
    ]);
    appIcon.setToolTip('HipChat');
    appIcon.setContextMenu(contextMenu);
  });
});
