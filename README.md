# HipChat Electron

[![Build Status](https://travis-ci.org/BHSPitMonkey/hipchat-electron.svg?branch=master)](https://travis-ci.org/BHSPitMonkey/hipchat-electron)

An Electron wrapper for the HipChat web client.

This client is **unofficial** and not affiliated with HipChat or Atlassian.

![](http://i.imgur.com/8QogqnT.png)

## Download

Downloads are available on the [Releases](https://github.com/BHSPitMonkey/hipchat-electron/releases) page.

## Features

- Remembers which HipChat instance you use
- Opens links in your default browser
- Minimizes to a tray icon
- Desktop notifications
- Enhanced keyboard shortcuts

## Additional keyboard shortcuts

(The shortcuts built into HipChat should work too, except when overridden by your OS.)

* `Ctrl`+`N`: Start a new chat
* `Ctrl`+`PgUp`: Navigate up one room
* `Ctrl`+`PgDn`: Navigate down one room
* `Ctrl`+`W`: Close the active conversation
* `Ctrl`+`G`: Go to next room with unread messages
* `Ctrl`+`Q`: Quit application

## Build and run from source

1. Checkout this repository and install dependencies

        $ git checkout https://github.com/BHSPitMonkey/hipchat-electron
        $ cd hipchat-electron
        $ npm install

2. Start the application

        $ npm start
