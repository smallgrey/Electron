const { _makeMsgSetAndSend } = require('../../util/util');
const Tunnel = require('../../util/Tunnel');
const ManageService = require('./tsdk_manage_notify');
const UserService = require('../../service/userService');
class ManageController {

	static async searchLadp(ws) {
		let ret = _makeMsgSetAndSend(4001, 0, "tsdk_searchLadp")
		ws.send(ret)

		let userlist = await UserService.searchLadp()
		let LadpSearchResult = ManageService.onEvtLadpSearchResult(userlist)
		ws.send(LadpSearchResult)
	}
	
}

module.exports = ManageController;