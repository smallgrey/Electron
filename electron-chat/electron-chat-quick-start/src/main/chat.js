import { BrowserWindow, ipcMain, screen } from 'electron'

let chatRoomWindow = null
const chatRoomWindowURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/chat' : `file://${__dirname}/chat/index.html`

function createChatWindow () {
  chatRoomWindow = new BrowserWindow({
    width: 750,
    height: 550,
    minWidth: 750,
    minHeight: 550,
    center: true,
    frame: false, // 要创建无边框窗口
    movable: true, // 窗口是否可以移动
    show: true, // 先不让窗口显示
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
  chatRoomWindow.loadURL(chatRoomWindowURL)
  const screedSize = screen.getPrimaryDisplay().workAreaSize
  chatRoomWindow.setPosition((screedSize.width - 330 - 850), (screedSize.height - 550) / 2)
  // 监听渲染完成
  if (process.env.NODE_ENV === 'development') {
    chatRoomWindow.webContents.on('did-frame-finish-load', () => {
      chatRoomWindow.webContents.once('devtools-opened', () => {
        // chatRoomWindow.focus()
      })
      chatRoomWindow.webContents.openDevTools()
    })
  }

  chatRoomWindow.on('ready-to-show', function () {
    chatRoomWindow.show() // 初始化后再显示
  })

  // 监听窗口关闭
  chatRoomWindow.on('close', () => {
    chatRoomWindow = null
  })
  let dialogInfo = {
    windowObj: chatRoomWindow,
    id: chatRoomWindow.id,
    userId: global.chatUserList.currentTalkObj.user_id
  }
  global.chatPage.push(dialogInfo)
}

/**
 * 监听创建新窗口
 */
ipcMain.on('showChatWindow', (event, user) => {
  // 窗口存在检测
  let chatPages = global.chatPage
  let currentUser = user.user_id
  let flag = chatPages.find((item) => {
    return item.userId === currentUser
  })
  global.chatUserList = {
    currentTalkObj: user
  }
  if (flag) {
    flag.windowObj.show()
    return
  }
  createChatWindow()
})

ipcMain.on('messageComing', (event, ret) => {
  let message = ret.result.message
  let chatPages = global.chatPage
  let flag = chatPages.find((item) => {
    return item.userId === parseInt(message.origin)
  })
  if (flag) {
    flag.windowObj.webContents.send('recvMessage', message)
  }
})

ipcMain.on('closeChatWindow', (e, windowId) => {
  let chatPages = global.chatPage
  let flag = chatPages.find((item) => {
    return item.id === windowId
  })
  if (flag) {
    flag.windowObj.close()
    global.chatPage = chatPages.filter((item) => {
      return item.id !== windowId
    })
  }
})

ipcMain.on('minimizeChatWindow', (e, windowId) => {
  let chatPages = global.chatPage
  let flag = chatPages.find((item) => {
    return item.id === windowId
  })
  if (flag) {
    flag.windowObj.minimize()
  }
})

export { chatRoomWindow }
