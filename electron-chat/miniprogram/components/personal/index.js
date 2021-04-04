var app = getApp()
import userModel from '../../api/userModel';
const User = new userModel();
Component({
	properties: {
	},
	options: {
		addGlobalClass: true,
		styleIsolation: 'isolated' ,// 样式隔离
	},
	data: {
		canIUse: false,
		username: "",
		avatarUrl: ""
	},
	// 组建方法列表
	methods: {
		init () {
			let that = this
			that.setData({
				canIUse: wx.canIUse('button.open-type.getUserInfo') && app.globalData.isLogin == 1 && !app.globalData.userInfo.bind_wx ? true : false,
				username: app.globalData.userInfo.user_name,
				avatarUrl: app.globalData.userInfo.avatarUrl
			})
		},
		bindGetUserInfo: function(e) {
		  let that = this
		  let userInfo = e.detail.userInfo
		  let param = {
			user_name: userInfo.nickName,
			avatarUrl: userInfo.avatarUrl,
			wx_openid: app.globalData.userInfo.wx_openid
		  }
		  User.bindInfo(param).then(ret => {
			if(ret.code == 200){
			  app.globalData.userInfo =  Object.assign(app.globalData.userInfo, param, { bind_wx: 1 })
			  that.setData({
			  	canIUse: false,
			  	username: param.user_name,
			  	avatarUrl: param.avatarUrl
			  })
			}
		  })
		},
		look (res) {
			let url = ""
			switch(res.detail.type){
				case "contacts":
					url = "/pages/contacts/index"
					break;
			}
			wx.navigateTo({
				url
			})
		},
		myInfo (){
			wx.navigateTo({
				url: `/pages/personal/info/index`
			})
		}
	},
	ready:function(){
		let that = this
		that.init()
	}
	
})