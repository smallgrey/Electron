const { _makeMsgImport } = require('../../util/util');
class MainService {
	
	// 2002
	static onEvtUploadFileSuccess () {
		let param = {
			fileInfo: {
				filename : "smallgrey",
				fileLink: "http://www/baidu.com"
			}
		}
		return _makeMsgImport(2002, param, "ON_EVT_UPLOAD_FILE_SUCESS")
	}
}

module.exports = MainService;