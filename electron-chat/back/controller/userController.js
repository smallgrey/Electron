const UserService = require('../service/userService');
const { getWxUserOpenId } = require('../wx/wxUser');
const { UserMsg } = require('../msgCode/userMsg');
 
class UserControler {
	//登录
	static async login(ctx) {
		let response = {}
		const code = ctx.query.code;
		let ret = await getWxUserOpenId(code).then((res)=> {
			return JSON.parse(res)
		}, (error) => {
			return error
		})
		
		if(!ret.openid){
			return UserMsg(1005);
		}

		let user = await UserService.getUserInfoByWxId(ret.openid);
		if (user) {
			response = Object.assign({}, UserMsg(200),{
				result: user
			})
		} else {
			response = UserMsg(1001)
		}
		
		return response;
	}
	
	static async roleList() {
		let response = {}
		let roles = await UserService.getRoleList();
		if (roles) {
			response = Object.assign({}, UserMsg(200),{
				result: roles
			})
		} else {
			response = UserMsg(1002)
		}
		return response;
	}
	
	static async bindInfo(ctx){
		let response = {}
		let res = await UserService.bindInfo(ctx.query);
		if (res) {
			switch (res) {
				case -2:
					response = UserMsg(1003)
					break;
				default:
					response = Object.assign({}, UserMsg(200),{
						msg: "绑定成功"
					})
					break;
			}
		} else {
			response = UserMsg(1004)
		}
		return response;
	}
	
	// PC用户登录流程
	static async getUserInfoByAccountAndPwd(param){
		let res = await UserService.getUserInfoByAccountAndPwd(param);
		return res
	}
}

module.exports = UserControler;