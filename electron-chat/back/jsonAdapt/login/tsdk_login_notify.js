const { _makeMsgImport } = require('../../util/util');
class LoginService {
	
	// 1002
	static onEvtLoginSuccess (userInfo) {
		let param = {
			userInfo
		}
		return _makeMsgImport(1002, param, "ON_EVT_LOGIN_SUCESS")
	}
	
	// 1003
	static onEvtLoginFailed (reason) {
		let param = {
			reason
		}
		return _makeMsgImport(1003, param, "ON_EVT_LOGIN_Failed")
	}
}

module.exports = LoginService;