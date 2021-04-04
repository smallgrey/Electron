const { _makeMsgSetAndSend } = require('../../util/util');
const MainService = require('./tsdk_main_notify');
class MainController {
	
	static uploadFile(ws) {
		let ret = _makeMsgSetAndSend(2001, 0, "tsdk_upload_file")
		
		setTimeout(()=> {
			let jsonValue = MainService.onEvtUploadFileSuccess()
			ws.send(jsonValue)
		},2000)
		
		return ret
	}
	
}

module.exports = MainController;