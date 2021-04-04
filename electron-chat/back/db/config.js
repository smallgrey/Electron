module.exports = {
    mysql: {	// mysql数据库配置
        host: 'localhost', // 主机
        port: 3306, // 端口
        user: 'root', // 用户名
        password: 'root', // 密码
        database: 'ws_chat', // 数据库名
        connectionLimit: 50, // 连接池允许创建的最大连接数，默认值为10
        queueLimit: 0 // 允许挂起的最大连接数,默认值为0,代表挂起的连接数无限制
    }
};