'use strict'

import { app, BrowserWindow, ipcMain, screen } from 'electron'

import {
  otherRoomWindow
} from './other'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/main`
  : `file://${__dirname}/main/index.html`

const homeWidth = 300
const homeHeight = 590

global.userObj = null // 登录用户信息

// 实现单例，在启动第二个实例后，激活主窗口，然后退出第二个实例
const gotTheLock = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

gotTheLock && app.quit()

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'Test Electron',
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
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    show: false,
    flashFrame: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('maximize', function () {
    mainWindow.webContents.send('main-window-max')
  })

  mainWindow.on('unmaximize', function () {
    mainWindow.webContents.send('main-window-unmax')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('minimize', (e) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize()
  }
})

ipcMain.on('close', (e) => {
  if (otherRoomWindow && !otherRoomWindow.isDestroyed()) {
    otherRoomWindow.close()
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close()
  }
})

ipcMain.on('saveUserObj', (event, userObjParams) => {
  if (userObjParams) {
    global.userObj = userObjParams
  }
})

const mainWidth = 1024
const mainHeight = 600

ipcMain.on('maximize', (event, isMaximize) => {
  if (isMaximize) {
    mainWindow.maximize()
  } else {
    mainWindow.setSize(mainWidth, mainHeight)
    const screedSize = screen.getPrimaryDisplay().workAreaSize
    mainWindow.setPosition(
      (screedSize.width - mainWidth) / 2,
      (screedSize.height - mainHeight) / 2
    )
  }
})

ipcMain.on('changWindowSize', (e) => {
  mainWindow.setSize(mainWidth, mainHeight)
  mainWindow.setResizable(true)
  mainWindow.setMinimumSize(mainWidth, mainHeight)
  const screedSize = screen.getPrimaryDisplay().workAreaSize
  mainWindow.setPosition(
    (screedSize.width - mainWidth) / 2,
    (screedSize.height - mainHeight) / 2
  )
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
