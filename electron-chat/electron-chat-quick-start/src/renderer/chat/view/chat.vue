<template>
	<div class="container flex_row">
		<div class="title-bar target_info flex_col">
			<img class="target_avatar" :src="targetUser.avatarUrl"></img>
			<div class="flex_grow">
				<div class="target_name">{{targetUser.user_name}}</div>
			</div>
			<img @click="minimize" src="~@/assets/icon_minimize_gery.png">
			<img @click="close" src="~@/assets/icon_close_gery.png">
		</div>
		<div class="flex_grow content_container">
			<div v-for="msgItem in msgList" :key="">
				<div v-if="msgItem.uid == myuid" class="flex_col myMessage" v-scroll="msgItem.id == (msgList.length - 1)">
					<img :src="targetUser.avatarUrl" class="myAvatar">
					<div v-html="msgItem.msg.content"></div>
				</div>
				<div v-else class="flex_col targetMessage" v-scroll="msgItem.id == (msgList.length - 1)">
					<img :src="targetUser.avatarUrl" class="targetAvatar">
					<div v-html="msgItem.msg.content"></div>
				</div>
			</div>
		</div>
		<div class="content-area">
			<div class="content-type flex_col">
				<div class="icon biaoqing" @click="switchEmoji"></div>
				<swiper :options="swiperOption" ref="mySwiper" v-show="showEmoji">
				  <swiper-slide v-for="item in emojiList" :key="">
					  <div class="emojiItem">
						  <div v-for="em in item" :key="" class="emoji_col">
							<img :src="getImgUrl(em.url)" @click="chooseEmoji(em.url)">
						  </div>
					  </div>
				  </swiper-slide>
				  <div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
			<div contenteditable="true" class="msg-content" v-model="inputMessage" @keydown="changeText($event)" ref="inputMessageDom">
			</div>
		</div>
	</div>
</template>

<script>
	// 引入插件
	import { swiper, swiperSlide } from "vue-awesome-swiper";
	import "swiper/dist/css/swiper.css";
	const { ipcRenderer, remote } = require('electron')
	export default {
	  name: 'ChatRoom',
	  components: {
	    swiper,
	    swiperSlide
	  },
	  directives: {
	    scroll: {
	      inserted(el) {
	        el.scrollIntoView()
	      }
	    }
	  },
	  data () {
	    return {
	      swiperOption: {
	        // 显示分页
	        pagination: {
	          el: ".swiper-pagination",
	          clickable: true // 允许分页点击跳转
	        },
	      },
	      inputMessage: '', // 输入框内容
	      showEmoji: false, // 表情选择
	      targetUser: '',
	      msg: '你好呀',
	      emojiList: [
	        [{ 'url': '100.gif', alt: '[微笑]' }, { 'url': '101.gif', alt: '[伤心]' }, { 'url': '102.gif', alt: '[美女]' }, { 'url': '103.gif', alt: '[发呆]' }, { 'url': '104.gif', alt: '[墨镜]' }, { 'url': '105.gif', alt: '[哭]' }, { 'url': '106.gif', alt: '[羞]' }, { 'url': '107.gif', alt: '[哑]' }, { 'url': '108.gif', alt: '[睡]' }, { 'url': '109.gif', alt: '[哭]' }, { 'url': '110.gif', alt: '[囧]' }, { 'url': '111.gif', alt: '[怒]' }, { 'url': '112.gif', alt: '[调皮]' }, { 'url': '113.gif', alt: '[笑]' }, { 'url': '114.gif', alt: '[惊讶]' }, { 'url': '115.gif', alt: '[难过]' }, { 'url': '116.gif', alt: '[酷]' }, { 'url': '117.gif', alt: '[汗]' }, { 'url': '118.gif', alt: '[抓狂]' }, { 'url': '119.gif', alt: '[吐]' }, { 'url': '120.gif', alt: '[笑]' }, { 'url': '121.gif', alt: '[快乐]' }, { 'url': '122.gif', alt: '[奇]' }, { 'url': '123.gif', alt: '[傲]' }, { 'url': '124.gif', alt: '[饿]' }, { 'url': '125.gif', alt: '[累]' }, { 'url': '126.gif', alt: '[吓]' }, { 'url': '127.gif', alt: '[汗]' }, { 'url': '128.gif', alt: '[高兴]' }, { 'url': '129.gif', alt: '[闲]' }, { 'url': '130.gif', alt: '[努力]' }, { 'url': '131.gif', alt: '[骂]' }],
	        [{ 'url': '132.gif', alt: '[疑问]' }, { 'url': '133.gif', alt: '[秘密]' }, { 'url': '134.gif', alt: '[乱]' }, { 'url': '135.gif', alt: '[疯]' }, { 'url': '136.gif', alt: '[哀]' }, { 'url': '137.gif', alt: '[鬼]' }, { 'url': '138.gif', alt: '[打击]' }, { 'url': '139.gif', alt: '[bye]' }, { 'url': '140.gif', alt: '[汗]' }, { 'url': '141.gif', alt: '[抠]' }, { 'url': '142.gif', alt: '[鼓掌]' }, { 'url': '143.gif', alt: '[糟糕]' }, { 'url': '144.gif', alt: '[恶搞]' }, { 'url': '145.gif', alt: '[什么]' }, { 'url': '146.gif', alt: '[什么]' }, { 'url': '147.gif', alt: '[累]' }, { 'url': '148.gif', alt: '[看]' }, { 'url': '149.gif', alt: '[难过]' }, { 'url': '150.gif', alt: '[难过]' }, { 'url': '151.gif', alt: '[坏]' }, { 'url': '152.gif', alt: '[亲]' }, { 'url': '153.gif', alt: '[吓]' }, { 'url': '154.gif', alt: '[可怜]' }, { 'url': '155.gif', alt: '[刀]' }, { 'url': '156.gif', alt: '[水果]' }, { 'url': '157.gif', alt: '[酒]' }, { 'url': '158.gif', alt: '[篮球]' }, { 'url': '159.gif', alt: '[乒乓]' }, { 'url': '160.gif', alt: '[咖啡]' }, { 'url': '161.gif', alt: '[美食]' }, { 'url': '162.gif', alt: '[动物]' }, { 'url': '163.gif', alt: '[鲜花]' }],
	        [{ 'url': '164.gif', alt: '[枯]' }, { 'url': '165.gif', alt: '[唇]' }, { 'url': '166.gif', alt: '[爱]' }, { 'url': '167.gif', alt: '[分手]' }, { 'url': '168.gif', alt: '[生日]' }, { 'url': '169.gif', alt: '[电]' }, { 'url': '170.gif', alt: '[炸弹]' }, { 'url': '171.gif', alt: '[刀子]' }, { 'url': '172.gif', alt: '[足球]' }, { 'url': '173.gif', alt: '[瓢虫]' }, { 'url': '174.gif', alt: '[翔]' }, { 'url': '175.gif', alt: '[月亮]' }, { 'url': '176.gif', alt: '[太阳]' }, { 'url': '177.gif', alt: '[礼物]' }, { 'url': '178.gif', alt: '[抱抱]' }, { 'url': '179.gif', alt: '[拇指]' }, { 'url': '180.gif', alt: '[贬低]' }, { 'url': '181.gif', alt: '[握手]' }, { 'url': '182.gif', alt: '[剪刀手]' }, { 'url': '183.gif', alt: '[抱拳]' }, { 'url': '184.gif', alt: '[勾引]' }, { 'url': '185.gif', alt: '[拳头]' }, { 'url': '186.gif', alt: '[小拇指]' }, { 'url': '187.gif', alt: '[拇指八]' }, { 'url': '188.gif', alt: '[食指]' }, { 'url': '189.gif', alt: '[ok]' }, { 'url': '190.gif', alt: '[情侣]' }, { 'url': '191.gif', alt: '[爱心]' }, { 'url': '192.gif', alt: '[蹦哒]' }, { 'url': '193.gif', alt: '[颤抖]' }, { 'url': '194.gif', alt: '[怄气]' }, { 'url': '195.gif', alt: '[跳舞]' }],
	        [{ 'url': '196.gif', alt: '[发呆]' }, { 'url': '197.gif', alt: '[背着]' }, { 'url': '198.gif', alt: '[伸手]' }, { 'url': '199.gif', alt: '[耍帅]' }, { 'url': '200.png', alt: '[微笑]' }, { 'url': '201.png', alt: '[生病]' }, { 'url': '202.png', alt: '[哭泣]' }, { 'url': '203.png', alt: '[吐舌]' }, { 'url': '204.png', alt: '[迷糊]' }, { 'url': '205.png', alt: '[瞪眼]' }, { 'url': '206.png', alt: '[恐怖]' }, { 'url': '207.png', alt: '[忧愁]' }, { 'url': '208.png', alt: '[眨眉]' }, { 'url': '209.png', alt: '[闭眼]' }, { 'url': '210.png', alt: '[鄙视]' }, { 'url': '211.png', alt: '[阴暗]' }, { 'url': '212.png', alt: '[小鬼]' }, { 'url': '213.png', alt: '[礼物]' }, { 'url': '214.png', alt: '[拜佛]' }, { 'url': '215.png', alt: '[力量]' }, { 'url': '216.png', alt: '[金钱]' }, { 'url': '217.png', alt: '[蛋糕]' }, { 'url': '218.png', alt: '[彩带]' }, { 'url': '219.png', alt: '[礼物]' }]
	      ],
	      myuid: remote.getGlobal('userObj').user_id,
	      msgList: []
	    }
	  },
	  computed: {
	    swiper() {
	      return this.$refs.mySwiper.swiper;
	    }
	  },
	  watch: {
	    inputMessage (newVal) {
		  this.$nextTick(function () {
	        this.keepLastIndex()
		  })
	    }
	  },
	  mounted () {
	    this.clearUnreadMessage()
	    window.addEventListener('keydown', (e) => {
	      if (e.keyCode === 13) {
	        this.sendMessage()
	      }
	    })
	  },
	  destroyed () {
	    window.removeEventListener('keydown', () => {
		}, false)
	  },
	  created () {
	    this.targetUser = remote.getGlobal('chatUserList').currentTalkObj
	    ipcRenderer.removeAllListeners('recvMessage')
	    ipcRenderer.on('recvMessage', (e, message) => {
	      this.dealMessage(message)
	    })
	  },
	  methods: {
	    clearUnreadMessage () {
	      ipcRenderer.sendTo(
	        remote.getGlobal('mainWindow').id,
	        'clearUnReadMessage',
	        {
	          userId: this.targetUser.user_id
	        }
	      )
		},
	    sendMessage (el) {
	      let inputMessage = this.$refs.inputMessageDom.innerHTML
	      if (!inputMessage) {
	        return
		  }
	      this.showEmoji = false
	      this.$refs.inputMessageDom.innerHTML = ''
	      let newsId = this.msgList.length
	      var nowDate = new Date()
	      this.msgList = this.msgList.concat([{
	        id: newsId, uid: this.myuid, time: nowDate.getHours() + ":" + nowDate.getMinutes(), type: "text", msg: { content: inputMessage }  
	      }])
	      let chatParam = {
	        target: this.targetUser.user_id, // userId
	        message: {
	            type: 'text',
	            msg: inputMessage
	        }
	      }
	      ipcRenderer.sendTo(
	        remote.getGlobal('mainWindow').id,
	        'sendMessage',
	        chatParam
	      )
	    },
	    getImgUrl (item) {
	      let url = require(`../../assets/img/emoji/${item}`)
	      return url
	    },
	    switchEmoji () {
	      this.showEmoji = !this.showEmoji
	    },
	    changeText (event) {
	      if(event.which === 13) {
	        event.preventDefault()
	        this.sendMessage()
	        return
		  }
	    },
	    chooseEmoji (emoji) {
	      let url = `https://127.0.0.1:3000/img/emoji/${emoji}`
	      let myValue = `<img src="${url}"></img>`
		  this.$refs.inputMessageDom.innerHTML += myValue
		  this.switchEmoji()
	    },
	    dealMessage (ret) {
	      let newsId = this.msgList.length
	      var nowDate = new Date()
	      this.msgList = this.msgList.concat([{
	        id: newsId, uid: ret.origin, time: nowDate.getHours() + ":" + nowDate.getMinutes(), type: "text", msg: { content: ret.content.msg.content }  
	      }])
	    },
	    minimize () { // 点击最小化按钮调用的方法
	      ipcRenderer.send('minimizeChatWindow', remote.getCurrentWindow().id)
	    },
	    close () { // 点击关闭按钮调用的方法// 点击关闭按钮调用的方法
	      ipcRenderer.send('closeChatWindow', remote.getCurrentWindow().id)
	    },
	    keepLastIndex () {
	      if (window.getSelection) {
	        let el = this.$refs.inputMessageDom
	        var range = window.getSelection() // 创建range
	        range.selectAllChildren(el) // range 选择obj下所有子内容
	        range.collapseToEnd() // 光标移至最后
		  }
	    }
	  }
	}
</script>

<style scoped>
  .target_info{
    padding: 10px 10px;
    background: #14dadd;
	align-items: center;
  }
  .target_avatar{
	width: 30px;
	height: 30px;
	border-radius: 50%;
	margin-right: 5px;
  }
  .target_name{
	padding: 2px 0px;
	font-size: 20px;
	word-break: break-word;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
  }
  .content-area{
	  border-top: 1px solid #ddd;
	  height: 150px;
  }
  .content-type{
	  position: relative;
	  height: 20%;
	  align-items: center;
	  padding: 0px 5px;
  }
  .msg-content{
	  padding: 5px;
	  width: 100%;
	  height: 80%;
	  overflow: hidden;
	  resize: none;
	  outline: none;
	  border: none;
	  color: fuchsia;
  }
  .swiper-container{
	position: absolute;
	top: -150px;
    height: 150px;
    width: 350px;
  }
  .swiper-wrapper .swiper-slide{
	width: 350px;
	height: 150px;
    background-color: ghostwhite;
  }
  .emojiItem{
	  padding: 5px 2%;
	  column-count: 8;
	  column-gap: 0px;
	  height: 100%;
  }
  .emoji_col{
	break-inside: avoid;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 20%;
  }
  .content_container{
    background-color: whitesmoke;
	overflow: scroll;
  }
  .content_container::-webkit-scrollbar {
    display: none;
	width: 0;
  }
  .myMessage{
    flex-direction: row-reverse;
	color: ghostwhite;
  }
  .myMessage, .targetMessage {
	align-items: center;
	padding: 5px 10px;
	box-sizing: border-box;
  }
  .myMessage div, .targetMessage div{
	width: auto;
	padding: 5px;
	background-color: #14dadd;
	border-radius: 3px;
  }
  .targetMessage div{
	  color: #777
  }
  .myAvatar, .targetAvatar{
    width: 36px;
	height: 36px;
	border-radius: 50%;
  }
</style>
