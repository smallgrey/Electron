const MsgList = [
	{code: 200, msg: '成功'},
	{code: 1001, msg: '用户不存在!'},
	{code: 1002, msg: '角色类型查询失败！'},
	{code: 1003, msg: '登录码输入错误'},
	{code: 1004, msg: '绑定失败'},
	{code: 1005, msg: '获取微信信息失败!'},
]

function UserMsg(code){
	let res = MsgList.find((item) => {
		return item.code == code
	})
	return res;
}

module.exports = {UserMsg}