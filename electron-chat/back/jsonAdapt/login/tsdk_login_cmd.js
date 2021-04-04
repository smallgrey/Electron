const { _makeMsgSetAndSend } = require('../../util/util');
const Tunnel = require('../../util/Tunnel');
const LoginService = require('./tsdk_login_notify');
const ManageService = require('../manage/tsdk_manage_notify');
const UserController = require('../../controller/userController');
const UserService = require('../../service/userService');
class LoginController {
	/*
	loginParam: {
	   account
	   password
	   terminalType  0: PC或者app、1：微信
	} */
	static async login(loginParam, ws) {
		let ret = _makeMsgSetAndSend(1001, 0, "tsdk_login")
		ws.send(ret)
		
		let userInfo, jsonValue
		switch (loginParam.terminalType) {
			case 0:
			  userInfo = await UserController.getUserInfoByAccountAndPwd(loginParam)
			  break;
			case 1:
			  userInfo = await UserService.getUserInfoByWxId(loginParam.openid)
			  break;
			default:
			  break;
		}

		if(userInfo){
			jsonValue = LoginService.onEvtLoginSuccess(userInfo)
			await Tunnel.bindWsByUserId(userInfo.user_id, ws)
		}else{
			jsonValue = LoginService.onEvtLoginFailed("account or password is incorrect")
		}
		ws.send(jsonValue)
		
		if(userInfo){ // 查询地址本
		    let userlist = await UserService.searchLadp()
		    let LadpSearchResult = ManageService.onEvtLadpSearchResult(userlist)
			ws.send(LadpSearchResult)
		}
	}
	
	static async reconnectBindWs(userId, ws) {
		Tunnel.bindWsByUserId(userId, ws)
		let ret = _makeMsgSetAndSend(1002, 0, "tsdk_reconnect_bind_ws")
		ws.send(ret)
	}
	
}

module.exports = LoginController;