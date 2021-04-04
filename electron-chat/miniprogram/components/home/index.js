var app = getApp()
Component({
	properties: {
	},
	options: {
		addGlobalClass: true,
		styleIsolation: 'isolated' ,// 样式隔离
	},
	data: {
		username: "",
		defaultImage: ""
	},
	// 组建方法列表
	methods: {
		init () {
		}
	},
	ready:function(){
		let that = this
		that.init()
	}
	
})