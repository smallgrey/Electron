import {
  app,
  // BrowserWindow,
  ipcMain,
  screen,
  globalShortcut
} from 'electron'

import {
  mainWindow,
  createMainWindow
} from './mainwin'
import {
  chatRoomWindow
} from './chat'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

global.screenSize = '' // 屏幕大小
global.userObj = null // 登录用户信息
global.LadpSearchObj = null // 地址本
global.chatPage = [] // 本地聊天对话框
global.unReadMessageList = [] // 未读消息列表

// 实现单例，在启动第二个实例后，激活主窗口，然后退出第二个实例
const gotTheLock = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

gotTheLock && app.quit()

app.on('ready', () => {
  globalShortcut.register('F5', () => {
    return false
  })

  globalShortcut.register('F11', () => {
    return false
  })

  createAllWindow()
})

app.on('will-quit', () => {
  globalShortcut.unregister('F5')
  globalShortcut.unregister('F11')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createAllWindow () {
  createMainWindow()
}

ipcMain.on('saveUserObj', (event, userInfo) => {
  global.userObj = userInfo
})

ipcMain.on('saveLadpSearchObj', (event, userList) => {
  global.LadpSearchObj = userList.map((item) => {
    return Object.assign({}, item, {
      unreadMessageSum: 0
    })
  })
})

ipcMain.on('saveUnReadMessage', (event, message) => {
  global.unReadMessageList.push(message)
  console.log('未读消息列表:', global.unReadMessageList)
})

ipcMain.on('changWindowSize', e => {
  mainWindow.setResizable(false)
  mainWindow.setMinimumSize(280, 600)
  mainWindow.setSize(280, 600)
  const screedSize = screen.getPrimaryDisplay().workAreaSize
  global.screenSize = screedSize
  mainWindow.setPosition(
    (screedSize.width - 330),
    (screedSize.height - 600) / 2
  )
})

ipcMain.on('close', (e, isUpdate) => {
  if (isUpdate) {
    console.log('isUpdate close')
  } else {
    closeWindowEvt()
  }
})

ipcMain.on('minimize', e =>
  mainWindow.minimize()
)

function closeWindowEvt () {
  console.log('onclose')
  // mainWindow.webContents.send('onClose')

  if (chatRoomWindow && !chatRoomWindow.isDestroyed()) {
    chatRoomWindow.close()
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close()
  }
}
