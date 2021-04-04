import Request from '../common/Request'
class userModel extends Request {
	
  login (params) {
    return this.request('user/login', params, {}, "GET")
  }
  
  roleType () {
    return this.request('user/roleType', {}, {}, "GET")
  }
  
  bindInfo (params) {
    return this.request('user/bindInfo', params, {}, "GET")
  }
}

export default userModel