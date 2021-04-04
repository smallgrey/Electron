const { _makeMsgImport } = require('../../util/util');
class ChatService {
	
	// 3002
	static onEvtNewsInComing (messageInfo) {
		let param = {  
			message: messageInfo
		}
		return _makeMsgImport(3002, param, "ON_EVT_NEWS_INCOMING")
	}
}

module.exports = ChatService;