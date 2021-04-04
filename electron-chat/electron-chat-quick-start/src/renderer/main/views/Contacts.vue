<template>
	<div class="container flex_row">
		<div class="title-bar account_info flex_col">
			<img class="account_avatar" :src="userInfo.avatarUrl" :class="offline? 'offline_img': ''"></img>
			<div class="flex_grow">
				<div class="account" @click="searchLdap">{{userInfo.user_name}}</div>
				<div class="account_sign">{{account_sign}}</div>
			</div>
		</div>
		<div class="contacts-container flex_grow">
			<div  v-for="item in attendList" :key="item.id" class="contacts flex_col" @click="talk(item)">
				<img class="avatar" :src="item.avatarUrl" alt :class="offline? 'offline_img': ''"/>
				<div class="name flex_grow">{{item.user_name}}</div>
				<div class="tis" v-if="item.unreadMessageSum > 0">{{item.unreadMessageSum}}</div>
			 </div>
		</div>
	</div>
</template>

<script>
	const { ipcRenderer, remote } = require('electron')
	
	export default {
	  name: 'Home',
	  data () {
	    return {
	      userInfo: '',
	      name: 'test',
	      account_sign: 'Love is so short, forgetting is so long',
	      attendList: [],
	      offline: false // 在线状态
	    }
	  },
	  created () {
	    ipcRenderer.removeAllListeners('sendMessage')
	    ipcRenderer.removeAllListeners('clearUnReadMessage')
	    ipcRenderer.on('sendMessage', (e, message) => {
	      window.tsdkClient.singlePersonChat(message, (ret) => {
	        console.log('发消息：', ret)
	      })
	    })
	    ipcRenderer.on('clearUnReadMessage', (e, target) => {
	      this.clearUnReadFlag(target)
	    })
	  },
	  mounted () {
	    this.changeWindowSize()
	    this.registerEvent()
	    this.userInfo = remote.getGlobal('userObj')
	    this.attendList = remote.getGlobal('LadpSearchObj')
	  },
	  methods: {
	    registerEvent () {
	      window.registerEvent('onEvtLadpSearchResult', this.onEvtLadpSearchResult)
	      window.registerEvent('onEvtNewsInComing', this.onEvtNewsInComing)
	      window.registerEvent('onEvtOffline', () => {
	        this.offline = true
		  })
	      window.registerEvent('onEvtOnline', () => {
	        this.offline = false
	      })
	    },
	    changeWindowSize () {
	      ipcRenderer.send('changWindowSize')
	    },
	    minimize () {
	      ipcRenderer.send('minimize')
	    },
	    close () {
	      ipcRenderer.send('close')
	    },
	    searchLdap () {
	      window.tsdkClient.searchLadp((ret) => {
	        console.log('查询联系人消息：', ret)
	      })
	    },
	    onEvtLadpSearchResult (ret) {
	      ipcRenderer.send('saveLadpSearchObj', ret.result.users)
	      this.attendList = ret.result.users.map((item) => {
	          return Object.assign({}, item, {
	          unreadMessageSum: 0
	        })
	      })
	    },
	    onEvtNewsInComing (ret) {
	      let message = ret.result.message
	      let chatPages = remote.getGlobal('chatPage')
	      let flag = chatPages.find((item) => {
	        return item.userId === parseInt(message.origin)
	      })
	      if (flag) {
	        ipcRenderer.send('messageComing', ret) // 将消息发送至相应窗口
	      } else {
	        let allContacts = this.attendList // 加入对应用户的未读消息中
	        for (let i = 0; i<allContacts.length; i++) {
	          if (allContacts[i].user_id === parseInt(message.origin)) {
	            if (!allContacts[i].unreadMessageSum) {
	              allContacts[i].unreadMessageSum = 0
				}
	            allContacts[i].unreadMessageSum++
	            break
	          }
	        }
	        ipcRenderer.send('saveUnReadMessage', message) // 将消息添加至未读消息列表中
	        this.attendList = allContacts
	      }
	    },
	    talk (user) {
	      ipcRenderer.send('showChatWindow', user)
	    },
	    clearUnReadFlag (targetUser) {
	      let allContacts = this.attendList // 加入对应用户的未读消息中
	      for (let i = 0; i<allContacts.length; i++) {
	        if (allContacts[i].user_id === parseInt(targetUser.userId)) {
	          allContacts[i].unreadMessageSum = 0
	          break
	        }
	      }
	      this.attendList = allContacts
	    }
	  }
	}
</script>

<style scoped>
	.account_info{
		padding: 20px 10px;
		background: #14dadd;
	}
	.account_avatar{
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}
	
	.account_info .account, .account_info .account_sign{
		padding: 2px 0px;
		font-size: 20px;
		word-break: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	.account_info .account_sign{
		font-size: 12px;
		-webkit-line-clamp: 2;
	}
	.contacts .name{
		font-size: 14px;
	}
	.contacts-container{
		background-color: #f3f3f3;
		padding: 0px 10px;
	}
	.contacts{
		align-items: center;
		padding: 5px 0;
	}
	.contacts .avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}
	.contacts .name{
		padding: 0px 5px;
	}
	.tis{
		width: 18px;
		height: 18px;
		border-radius: 100%;
		background-color: #eb1d16;
		color: white;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
