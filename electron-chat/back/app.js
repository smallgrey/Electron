var express = require("express");
var https = require('https');
var fs = require('fs');
var WebSocket = require('ws');
var privateKey  = fs.readFileSync('./cert/private.pem', 'utf8');
var certificate = fs.readFileSync('./cert/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = express();

const UserController = require('./controller/userController');

const LoginController = require('./jsonAdapt/login/tsdk_login_cmd');
const MainController = require('./jsonAdapt/main/tsdk_main_cmd');
const ChatController = require('./jsonAdapt/chat/tsdk_chat_cmd');
const ManageController = require('./jsonAdapt/manage/tsdk_manage_cmd');

// 静态资源托管
app.use(express.static("./static"))

app.get('/', function(req, res){
	res.send('Hello,myServer'); //服务器响应请求
});

// 系统登录
app.get('/user/login', async function(req, res){
	let result = await UserController.login(req);
	res.send(result);
});

//绑定微信用户信息
app.get('/user/bindInfo', async function(req, res){
	let result = await UserController.bindInfo(req);
	res.send(result);
});

// 系统角色列表
app.get('/user/roleType', async function(req, res){
	let result = await UserController.roleList();
	res.send(result);
});



// 从excel 读取数据
app.get('/excel/read', async function(req, res){
	let result = await ExcelController.readData(req);
	res.send(result);
});

// 上传文件
app.post('/file/uploadFile', async function(req, res){
	let result = await ExcelController.uploadExcel(req);
	res.send(result);
});

var httpsServer = https.createServer(credentials, app);
const PORT = 3000;
const hostname = '0.0.0.0';
httpsServer.listen(PORT,hostname, function() {
    console.log('Websocket Server is running on: https://'+hostname+':%s', PORT);
});

// 聊天-websocket
var wss = new WebSocket.Server({server: httpsServer});
wss.on('connection', function connection(ws) {
	console.log('链接成功！');
	ws.on('message', async function incoming(data) {
		 /**
		  * 把消息发送到所有的客户端
		  * wss.clients获取所有链接的客户端
		  */
		 let message = JSON.parse(data)
		 console.log(message)
		 // wss.clients.forEach(function each(client) {
			//  client.send(data);
		 // });
		 await jsonAdapt(message, ws)
	});
});

function  jsonAdapt(message, ws) {
	let result = ""
	switch (message.cmd) {
		case 1001:
		    LoginController.login(message.param.loginParam, ws)
			break;
		case 1002:
		    LoginController.reconnectBindWs(message.param.userId, ws)
			break;
		case 2001:
		    result = MainController.uploadFile(ws)
			ws.send(result)
			break;
		case 3001:
		    ChatController.singlePersonChat(message.param.chatInfo , ws)
			break;
		case 4001:
		    ManageController.searchLadp(ws)
			break;	
	}
}
