<template>
	<div class="container flex_row">
		<div class="flex_col title-bar flex_center">
			<img @click="minimize" src="~@/assets/icon_minimize_gery.png">
			<img @click="close" src="~@/assets/icon_close_gery.png">
		</div>
		<div class="title">
			<span>密码登录</span>
		</div>
		<div class="main flex_grow">
		    <div class="avatar">
		      <el-avatar :size="60" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
		    </div>
		    <div class="item">
		      <el-input placeholder="请输入账号" v-model="account" clearable prefix-icon="el-icon-user"></el-input>
		    </div>
		    <div class="item">
		      <el-input placeholder="请输入密码" v-model="password" show-password prefix-icon="el-icon-lock"></el-input>
		    </div>
		    <div class="item">
		      <el-button type="primary" round @click="login">登录</el-button>
		    </div>
		</div>
	</div>
</template>

<script>
	const { ipcRenderer } = require('electron')
	export default {
	  name: 'Login',
	  data () {
	    return {
	      account: '',
	      password: ''
	    }
	  },
	  created () {
	    this.registerEvent()
	  },
	  methods: {
	    registerEvent () {
	      window.registerEvent('onEvtLoginSuccess', this.onEvtLoginSuccess)
	      window.registerEvent('onEvtLoginFailed', this.onEvtLoginFailed)
	      window.registerEvent('onEvtLadpSearchResult', this.onEvtLadpSearchResult)
	    },
	    login () {
	      if (!this.account || !this.password) {
	        this.$message.error('账号或密码不能为空')
	        return
	      }
	      let loginParam = {
	        account: this.account,
	        password: this.password,
	        terminalType: 0 // pc
	      }
	      window.tsdkClient.login(loginParam, (ret) => {})
	    },
	    onEvtLoginSuccess (ret) {
	      ipcRenderer.send('saveUserObj', ret.result.userInfo)
	      this.$router.push('Contacts')
	    },
	    onEvtLoginFailed (ret) {
	      this.$message.error(ret.result.reason)
	    },
	    onEvtLadpSearchResult (ret) {
	      console.log(ret)
	      ipcRenderer.send('saveLadpSearchObj', ret.result.users)
	    },
	    minimize () { // 点击最小化按钮调用的方法
	      ipcRenderer.send('minimize')
	    },
	    close () { // 点击关闭按钮调用的方法// 点击关闭按钮调用的方法
	      ipcRenderer.send('close')
	    }
	  }
	}
</script>

<style scoped>  
  .title{
  	height:50px;
  	line-height:50px;
  	background-color:#409EFF;
  }
  
  .title span{
    color:white;
    display:inline;
    text-align:center;
    font-size:18px;
  }
  
  .main{
    padding: 0px 30px;
  }

  .avatar{
    margin-top:40px;
    margin-bottom:40px;
  }
  
  button{
    width:100%;
  }

  .item{
   margin-top:20px;
  }  
</style>
