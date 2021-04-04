const ErrorCode = {
	300101: "用户不存在或未上线"
}
/*
** 时间戳转换成指定格式日期
** eg. 
** dateFormat(11111111111111, 'Y年m月d日 H时i分')
** → "2322年02月06日 03时45分"
*/
var dateFormat = function (timestamp, formats) {
    // formats格式包括
    // 1. Y-m-d
    // 2. Y-m-d H:i:s
    // 3. Y年m月d日
    // 4. Y年m月d日 H时i分
    formats = formats || 'Y-m-d';

    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    var myDate = timestamp? new Date(timestamp): new Date();

    var year = myDate.getFullYear();
    var month = zero(myDate.getMonth() + 1);
    var day = zero(myDate.getDate());

    var hour = zero(myDate.getHours());
    var minite = zero(myDate.getMinutes());
    var second = zero(myDate.getSeconds());

    return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minite,
            s: second
        })[matches];
    });
};

// 接口调用的返回格式
function _makeMsgSetAndSend (rsp, code, description) {
	let JsonParam = {
		 description: description,
		 result: code == 0? code : {errorCode: code, reason: ErrorCode[code]},
		 rsp: rsp,
	}
	return JSON.stringify(JsonParam)
}

// 接口回调或通知事件的返回格式
function _makeMsgImport(notify, result, description){
	let JsonParam = {
		 description: description,
		 result: result,
		 notify: notify,
	}
	return JSON.stringify(JsonParam)
}

module.exports = { dateFormat, _makeMsgSetAndSend, _makeMsgImport }