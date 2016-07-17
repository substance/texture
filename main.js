'use strict';
/*
  This is used by electron to setup the application.
  It spawns an extra browser window loading `index.html`.
*/
var electron = require('electron');
/*
 Hooks for serving files
*/
var app = electron.app;
var shell = electron.shell;
var BrowserWindow = electron.BrowserWindow;

var win;

function createWindow(url) {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    useContentSize: true,
    autoHideMenuBar: true,
  });
  win.loadURL(url);

  // Open the DevTools?
  // win.webContents.openDevTools();

  // it is important to dereference the created window object
  win.on('closed', function() {
    win = null;
  });
}

app.on('ready', function() {
  createWindow("http://localhost:5001/science-writer/");
  // make sure that external links are not opened within
  // the native application
  win.webContents.on('will-navigate', function(e, url) {
    if (!url.startsWith('http://localhost')) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

require('./server');
