const { _makeMsgImport } = require('../../util/util');
class ManageService {
	
	// 4002
	static onEvtLadpSearchResult (userlist) {
		let param = {
			users: userlist
		}
		return _makeMsgImport(4002, param, "ON_EVT_LADP_SEARCH_RESULT")
	}
}

module.exports = ManageService;