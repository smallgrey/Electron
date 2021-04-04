const { execute, executeTransaction } = require('../db/execute');
const UserDao = require('../dao/userDao');

class UserService {
	static async getUserInfoByWxId (wxid) {
	    return await execute(UserDao.queryUserInfoByWxId, wxid);
	}
	
	static async getRoleList () {
	    return await execute(UserDao.queryRoleList);
	}
	
	static async bindInfo (info) {
	    return await execute(UserDao.bindInfo, info);
	}
	
	static async getUserInfoByAccountAndPwd (loginAccountInfo) {
	    return await execute(UserDao.getUserInfoByAccountAndPwd, loginAccountInfo);
	}
	
	static async searchLadp () {
	    return await execute(UserDao.searchLadp);
	}
}
 
module.exports = UserService;