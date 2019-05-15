const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')

const isCoverage = Boolean(process.argv.find(p => p === '--coverage'))

app.on('ready', () => {
  let editorWindow = new BrowserWindow({ width: 1024, height: 768 })
  let mainUrl = url.format({
    pathname: isCoverage ? path.join(__dirname, 'coverage.html') : path.join(__dirname, 'browser.html'),
    protocol: 'file:',
    slashes: true
  })
  editorWindow.webContents.openDevTools()
  editorWindow.loadURL(mainUrl)
})

app.on('window-all-closed', () => {
  process.exit(0)
  // app.quit()
})
