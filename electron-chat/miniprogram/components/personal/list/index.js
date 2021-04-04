Component({
	properties: {
	},
	options: {
		addGlobalClass: true,
		styleIsolation: 'isolated' ,// 样式隔离
	},
	data: {
		tabs: [{
			icon: "contacts",
			title: "联系人",
			type: "contacts",
			color: "#999"
		},{
			icon: "text",
			title: "我的考试",
			type: "exam",
			color: "#999"
		}]
	},
	// 组建方法列表
	methods: {
		look(e){
			this.triggerEvent('look',{type: e.currentTarget.dataset.type})
		}
	}
	
})