const { _makeMsgSetAndSend } = require('../../util/util');
const Tunnel = require('../../util/Tunnel');
const ChatService = require('./tsdk_chat_notify');
class ChatController {
	/*
	chatParam: {
	   target // 发送对象
	   message
	} */
	static async singlePersonChat(chatInfo, ws) {
		let ret 
		let targetWs = Tunnel.getUserWs(chatInfo.target)
		if(targetWs==null){
			ret = _makeMsgSetAndSend(3001, 300101, "tsdk_single_person_chat")
			ws.send(ret)
			return false
		}
		
		let originUser = Tunnel.searchUserByWs(ws)
		let messageInfo = {
			origin: originUser,
			content: chatInfo.message
		}
		let jsonValue = ChatService.onEvtNewsInComing(messageInfo)
		ret = _makeMsgSetAndSend(3001, 0, "tsdk_single_person_chat")
		ws.send(ret)
		targetWs.send(jsonValue)
	}
	
}

module.exports = ChatController;