'use strict'

import { app, BrowserWindow } from 'electron'
app.commandLine.appendSwitch('ignore-certificate-errors')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
const homeWidth = 300
const homeHeight = 590
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/main`
  : `file://${__dirname}/main/index.html`

function createMainWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'Electron-chat',
    height: homeHeight,
    width: homeWidth,
    minHeight: homeHeight,
    minWidth: homeWidth,
    frame: false,
    center: true,
    transparent: false,
    backgroundColor: '#FFFFFF',
    maximizable: false,
    minimizable: true,
    movable: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    show: false,
    flashFrame: true
  })

  mainWindow.loadURL(winURL)
  global.mainWindow = {
    id: mainWindow.webContents.id
  }

  mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

export { mainWindow, createMainWindow }
