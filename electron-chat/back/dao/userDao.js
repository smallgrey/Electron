const { query, queryOne, update, insert, del } = require('../db/curd');
 
class UserDao {	
	static async queryUserInfoByWxId (connection, wxid) {
	    const sql = `SELECT a.user_id, a.user_name, a.role, a.avatarUrl, a.wx_openid, a.bind_wx, b.role_desc
	               FROM sys_user as a left join sys_role as b on a.role = b.role_type
	               WHERE a.wx_openid = ?`;
	    let user = await queryOne(connection, sql, wxid);
		if(!user){
			const sql_ = `INSERT INTO sys_user SET ?`;
			const val = {
				user_name: "",
				role: 1,
				wx_openid: wxid
			}			
			const ret = await insert(connection, sql_, val,true);
			if(ret){
				user = await queryOne(connection, sql, wxid);
			}
		}
	    return user;
	}
	
	static async queryRoleList (connection) {
	    const sql = `SELECT role_desc, role_type FROM sys_role  order by role_type  asc`;
	    let ret = await query(connection, sql);
	    return ret;
	}
	
	static async bindInfo (connection, info) {
        let sql_ = `UPDATE sys_user SET user_name = ?, avatarUrl = ?, bind_wx = ? WHERE wx_openid = ?`
		let val_ = [info.user_name, info.avatarUrl, 1 ,info.wx_openid]
	    let ret = await update(connection, sql_, val_);
	    return ret;
	}
	
	static async getUserInfoByAccountAndPwd (connection, loginAccountInfo) {
	    const sql = `SELECT a.user_id, a.account, a.account_pwd, a.user_name, a.role, b.role_desc, a.avatarUrl
	               FROM sys_user as a left join sys_role as b on a.role = b.role_type
	               WHERE a.account = ? and a.account_pwd = ?`;
	    let val_ = [loginAccountInfo.account, loginAccountInfo.password]
	    let user = await queryOne(connection, sql, val_);
	    return user;
	}
	
	static async searchLadp (connection) {
	    const sql = `SELECT user_id, user_name, avatarUrl FROM sys_user WHERE role = 1`;
	    let ret = await query(connection, sql);
	    return ret;
	}
	
}
 
module.exports = UserDao;