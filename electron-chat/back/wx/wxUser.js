var request = require('request');
const appId = "wx5fe23c261821b4c4";
const secret = "2149227c5c2aeded7ded6f0e9345436b"
async function getWxUserOpenId (code){
	let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
	return new Promise((resolve, reject)=>{
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve(body)
			}else{
				reject(error)
			}
		});
	})	
}

module.exports = {getWxUserOpenId}

