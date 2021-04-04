var app = getApp()
Component({
	properties: {
		chatList: {
			type: Array
		},
	},
	options: {
		addGlobalClass: true,
		styleIsolation: 'isolated' ,// 样式隔离
	},
	data: {
	},
	// 组建方法列表
	methods: {
		toChat(e) {
			this.triggerEvent('clearUnread',{uid: e.currentTarget.dataset.user.uid})
			let user = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.user))
			let url = `/pages/chat/chat?user=${user}`
			wx.navigateTo({
				url
			})
		}
	},
	attached: function () {
	   console.log("attached:" + this.data.chatList);
    },
	ready:function(){
		let that = this
		let chatList = app.globalData.chatHistory
		that.setData({
			chatList
		})
	}
})