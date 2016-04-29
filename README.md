# HipChat Electron

An Electron wrapper for the HipChat web client.

This client is unofficial and not affiliated with HipChat or Atlassian.

## Features

- Remembers which HipChat instance you use
- Opens links in your default browser

## Known Issues

- No support for pasting images from clipboard yet
- No zoom controls yet (can be set manually by adding a 'zoom' key in prefs.json)

## Usage

Until I build proper packages, do the following:

1. Checkout this repository and install dependencies

       $ git checkout https://github.com/BHSPitMonkey/hipchat-electron
       $ cd hipchat-electron
       $ npm install

2. Start Electron

       $ electron hipchat-electron

If you don't already have `electron` installed, install it with npm globally:

    $ npm install -g electron-prebuilt
