var app = getApp()
Page({ 
	data: {
		userList: []
	},
	onLoad (options) {
		if(!app.globalData.isLogin){
			app.getUserInfo(() => {
				this.setData({
					userInfo: app.globalData.userInfo
				})
			})
		}
	},
	onShow () {
		this.setData({
			userList: app.globalData.allContacts
		})
		if( app.globalData.allContacts.length == 0) {
			app.globalData.tsdkClient.searchLadp((ret) => {})
		}
	},
	toChat(e) {
		let user = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.user))
		let url = `/pages/chat/chat?user=${user}`
		wx.navigateTo({
			url
		})
	}
})

