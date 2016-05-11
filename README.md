# HipChat Electron

An Electron wrapper for the HipChat web client.

This client is **unofficial** and not affiliated with HipChat or Atlassian.

## Features

- Remembers which HipChat instance you use
- Opens links in your default browser
- Minimizes to a tray icon
- Desktop notifications
- Enhanced keyboard shortcuts

## Added Keyboard shortcuts

(The ones built into HipChat should work too, except where overridden by your OS)

* `Ctrl`+`N`: Start a new chat
* `Ctrl`+`PgUp`: Navigate up one room
* `Ctrl`+`PgDn`: Navigate down one room
* `Ctrl`+`G`: Go to next room with unread messages
* `Ctrl`+`Q`: Quit application

## Installation and Usage

Until I build proper packages, do the following:

1. Checkout this repository and install dependencies

        $ git checkout https://github.com/BHSPitMonkey/hipchat-electron
        $ cd hipchat-electron
        $ npm install

2. Start Electron

        $ electron .

If you don't already have `electron` installed, install it with npm globally:

    $ npm install -g electron-prebuilt
