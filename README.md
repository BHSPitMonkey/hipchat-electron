# HipChat Electron

An Electron wrapper for the HipChat web client.

This client is unofficial and not affiliated with HipChat or Atlassian.

## Features

- Remembers which HipChat instance you use
- Opens links in your default browser
- Minimizes to a tray icon
- Desktop notifications

## Known Issues

- Not all of HipChat's built-in keyboard shortcuts work yet

## Usage

Until I build proper packages, do the following:

1. Checkout this repository and install dependencies

        $ git checkout https://github.com/BHSPitMonkey/hipchat-electron
        $ cd hipchat-electron
        $ npm install

2. Start Electron

        $ electron .

If you don't already have `electron` installed, install it with npm globally:

    $ npm install -g electron-prebuilt
