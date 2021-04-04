//app.js
import { terminalSDK } from './utils/terminalSDK.js';
import userModel from './api/userModel';
const User = new userModel();
App({
	globalData:{
		isLogin: 0,
		allContacts: [], // 所有联系人
		chatHistory: [], // 聊天历史
		currentTalkObj: '', // 当前谈话对象
		tsdkClient: '',
		SdkEvents: {},
		online: true // 在线状态
	},
	onLaunch: function () {
		let that = this
		that.initSdk()
	},
	getUserInfo (callback){
		let that = this
		wx.login({
			success: function (res) {
				User.login({code: res.code}).then(ret => {
					that.globalData.userInfo = ret.result
					that.globalData.isLogin = 1
					typeof callback === 'function' && callback.call(null)
				})
			}
		})
	},
	initSdk: function () {
		let that = this
		let listeners =  {
			onEvtLoginSuccess: (ret) => {
				console.log("登录结果:", ret)
			},
			onEvtNewsInComing: (ret) => {
				if(that.globalData.currentTalkObj == ret.result.message.origin){
				    that.callEvent('onEvtNewsInComing', ret)
				}else{
					that.addUnReadMessage(ret)
				}
			},
			onEvtLadpSearchResult: (ret) => {
				console.log('联系人列表', ret)
				that.onEvtLadpSearchResult(ret)
			},
			onEvtWebSocketConnect: (ret) => {
			  that.webSocketLogin()
			},
			onEvtWebSocketClose: (ret) => {
				if(that.globalData.online) {
					wx.showToast({
						title: '服务器连接中断',
						icon: 'none'
					})
				}
			    that.globalData.online = false
			},
		}
		let AppConfigureParam = {
			svraddr: '',
			port: '',
		}
		that.globalData.tsdkClient = terminalSDK.tsdkCreateClient(AppConfigureParam, listeners)
	},
	webSocketLogin () {
		let that = this
		if(!that.globalData.userInfo){
			that.getUserInfo(that.webSocketLogin)
			return
		}
		let loginParam = {
			openid: that.globalData.userInfo.wx_openid,
			terminalType: 1
		}
		that.globalData.tsdkClient.login(loginParam, (ret) => {
			that.globalData.online = true
		})
	},
	onEvtLadpSearchResult (ret) {
		let that = this
		let userList = ret.result.users.map((item) => {
			return {
				uid: item.user_id,
				username: item.user_name,
				face: item.avatarUrl
			}
		})
		that.globalData.allContacts = userList
	},
	addUnReadMessage (ret) {
		let that = this
		let chatHistory = that.globalData.chatHistory
		let uid = ret.result.message.origin
		let nowDate = new Date();
		let flag = false;
		let pos = 0
		for(let i=0;i<chatHistory.length;i++) {
			if(chatHistory[i].uid == uid) {
				pos = i
				chatHistory[i].time = nowDate.getHours() + ":" + nowDate.getMinutes()
				chatHistory[i].lastMessage = `<div style="display: flex;align-items: center;">${ret.result.message.content.msg}</div>`
				chatHistory[i].unReadMessageSum += 1
				flag = true
				break
			}
		}
		if (!flag) {
		  let chatItem = that.globalData.allContacts.find((item) => {
			  return item.uid == uid
		  })
		  chatHistory.unshift(Object.assign({}, chatItem, {
			  time: nowDate.getHours() + ":" + nowDate.getMinutes(),
			  lastMessage: ret.result.message.content.msg,
			  unReadMessageSum: 1
		  }))
		} else {
			let NewMsgObj = chatHistory.splice(pos, 1)
			chatHistory.unshift(NewMsgObj[0])
		}
		that.globalData.chatHistory = chatHistory
		that.callEvent('addUnReadMessage', chatHistory)
	},
	registerEvent (event, listener) {
		let that = this
		that.globalData.SdkEvents[event] = listener
	},
	unregisterEvent (event, listener) {
		let that = this
		that.globalData.SdkEvents[event] = undefined
	},
	callEvent (event, result) {
		let that = this
		if (typeof that.globalData.SdkEvents[event] === 'function') {
		  that.globalData.SdkEvents[event].call(this, result)
		}
	}
})