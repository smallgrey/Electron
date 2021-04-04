import { BrowserWindow, ipcMain } from 'electron'

let otherRoomWindow = null
const otherRoomWindowURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/other' : `file://${__dirname}/other/index.html`

const otherWidth = 500
const otherHeight = 600

function createOtherWindow () {
  otherRoomWindow = new BrowserWindow({
    width: otherWidth,
    height: otherHeight,
    minWidth: otherWidth,
    minHeight: otherHeight,
    center: true,
    frame: false, // 要创建无边框窗口
    movable: true, // 窗口是否可以移动
    show: true, // 先不让窗口显示
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  otherRoomWindow.loadURL(otherRoomWindowURL)

  // 监听渲染完成
  if (process.env.NODE_ENV === 'development') {
    otherRoomWindow.webContents.on('did-frame-finish-load', () => {
      otherRoomWindow.webContents.once('devtools-opened', () => {
        // chatRoomWindow.focus()
      })
      otherRoomWindow.webContents.openDevTools()
    })
  }

  otherRoomWindow.on('ready-to-show', function () {
    otherRoomWindow.show() // 初始化后再显示
  })

  // 监听窗口关闭
  otherRoomWindow.on('close', () => {
    otherRoomWindow = null
  })
}

/**
 * 监听创建新窗口
 */
ipcMain.on('showOtherWindow', (event) => {
  // 窗口存在检测
  if (otherRoomWindow) {
    otherRoomWindow.show()
    return
  }
  createOtherWindow()
})

ipcMain.on('closeOtherWindow', (e) => {
  if (otherRoomWindow) {
    otherRoomWindow.close()
  }
})

export { otherRoomWindow }
