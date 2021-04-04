class Tunnel{
	static users = {}
	static online_sum = 0 // 在线总人数

	static bindWsByUserId(userId, ws) {
		if(!Tunnel.users[userId]){
			Tunnel.users[userId] = {}
		}
		const token = ++Tunnel.online_sum
		Tunnel.users[userId].ws = ws
	}
	
	static getUserWs(userId) {
		if(!Tunnel.users[userId]){
			return null
		}
		return Tunnel.users[userId].ws
	}
	
	static searchUserByWs(ws) {
		let allUsers = Object.keys(Tunnel.users)
		for(let i =0; i< allUsers.length; i++) {
			let userId = allUsers[i]
			if(Tunnel.users[userId].ws == ws) {
				return userId
			}
		}
		return -1;
	}
}
module.exports = Tunnel;