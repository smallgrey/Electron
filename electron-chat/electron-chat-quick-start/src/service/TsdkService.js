import { remote } from 'electron'
export default {
  initTsdk () {
    createSdkEvent()
    window.tsdkClient = createSdkClient()
    if (window.tsdkClient == null) {
      // logger.error('Create SDK Client is failed!')
    }
  }
}

function createSdkClient () {
  let AppConfigureParam = {
    svraddr: '',
    port: '',
    ssl: 1
  }
  let listeners = {
    onEvtLoginSuccess: (ret) => {
      callEvent('onEvtLoginSuccess', ret)
    },
    onEvtLoginFailed: (ret) => {
      callEvent('onEvtLoginFailed', ret)
    },
    onEvtNewsInComing: (ret) => {
      callEvent('onEvtNewsInComing', ret)
    },
    onEvtUploadFileSuccess: (ret) => {
      callEvent('onEvtUploadFileSuccess', ret)
    },
    onEvtLadpSearchResult: (ret) => {
      callEvent('onEvtLadpSearchResult', ret)
    },
    onEvtWebSocketConnect: (ret) => {
      bindWs()
    },
    onEvtWebSocketClose: (ret) => {
      callEvent('onEvtOffline', ret)
    },
  }
  return window.terminalSDK.tsdkCreateClient(AppConfigureParam, listeners)
}

function createSdkEvent () {
  window.SdkEvents = {}
  window.registerEvent = function (event, listener) {
    window.SdkEvents[event] = listener
  }
  window.unregisterEvent = function (event) {
    window.SdkEvents[event] = undefined
  }
}

function callEvent (event, result) {
  if (typeof window.SdkEvents[event] === 'function') {
    window.SdkEvents[event].call(this, result)
  }
}

function bindWs() {
  if (remote.getGlobal('userObj')) {
    window.tsdkClient.reconnectBindWs(remote.getGlobal('userObj').user_id, (ret) => {
      callEvent('onEvtOnline', ret)
    })
  }
}
