var app = getApp()
Page({ 
	data: {
		tabbarIndex: 0, //默认显示  tab1
		userRole: "",
		list: [
			{
				"text": "首页",
				"iconPath": "/images/tab/user.png",
				"selectedIconPath": "/images/tab/user-on.png",
				dot: true
			},
			{
				"text": "我的",
				"iconPath": "/images/tab/user.png",
				"selectedIconPath": "/images/tab/user-on.png",
				badge: 'New'
			 }
		],
		titles: [
			{
				index: 0,
				title: "消息列表"
			},
			{
				index: 1,
				title: "个人中心"
			}
		],
		chatList: []
	},
	onLoad () {
		this.init()
	},
	tabChange(e) {
	    //获取到底部栏元素的下标
	    let index = e.detail.index;
		let temp = this.data.titles.find((item) => {
			return item.index == index
		})
		this.setData({
			tabbarIndex: index
		})
		wx.setNavigationBarTitle({
			title: temp.title
		})
	},
	init () {
		app.registerEvent('addUnReadMessage', this.addUnReadMessage)
	},
	addUnReadMessage (ret) {
		this.setData({
			chatList: ret
		})
	},
	clearUnread (e) {
		let uid = e.detail.uid
		let chatList = this.data.chatList
		let nowDate = new Date();
		for(let i=0;i<chatList.length;i++) {
			if(chatList[i].uid == uid) {
				chatList[i].time = nowDate.getHours() + ":" + nowDate.getMinutes()
				chatList[i].unReadMessageSum  = 0 
				break
			}
		}
		this.setData({
			chatList
		})
		app.globalData.chatHistory = chatList
	}
})

