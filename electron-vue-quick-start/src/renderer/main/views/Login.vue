<template>
    <div id="wrapper" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.03)">
        <home-title-bar :titled='title'></home-title-bar>
        <div class="content">
          <div class="login-body">
            <div class="login-form">
              <el-row class="login-form-item-row">
                <el-col :span="24">
                  <el-input :autofocus="true" v-model="loginParam.userName" clearable prefix-icon="el-icon-user" placeholder="帐号" @input="changeEvt($event)"></el-input>
                </el-col>
              </el-row>

              <el-row class="login-form-item-row">
                <el-col :span="24">
                  <img class="key_img" src="../../../assets/images/key.png" alt />
                  <el-input class="pwinput" ref="passwordEle" :autofocus="autofocus" v-model.trim="loginParam.password" :type="pwinptType" placeholder="密码" autocomplete="new-password" @input="update($event)">
                   <img draggable="false" :src="eyesrc" slot="suffix" class="el-icon-edit el-input__icon" :style="{display:showClearIcon}" />
                  </el-input>
                </el-col>
              </el-row>

              <el-row style="margin-top:6px;" v-if="isShowTips">
                <span class="toolTips">{{ errorInfo }}</span>
              </el-row>
            </div>
          </div>
          <div class="button-container loginbtn">
            <el-button size="medium" style="border: 1px solid #fff;border-radius:1.6px; width: 100%;background:#0D94FF;" @click="loginClick">登录</el-button>
          </div>
        </div>
    </div>
</template>

<script>
import validate from '../../../util/validate'
import HomeTitleBar from '../../../components/HomeTitleBar'
import logger from '../../../util/logUtils'
const { ipcRenderer } = require('electron')

export default {
  name: 'loginPage',
  components: {
    'home-title-bar': HomeTitleBar
  },
  data () {
    return {
      title: 'Test Electron',
      loading: false,
      loginParam: {
        password: null,
        userName: null
      },
      autofocus: false,
      pwinptType: 'password',
      showClearIcon: 'inline-block',
      eyesrc: require('../../../assets/images/clear-eye-copy2.svg'),
      isShowTips: false,
      errorInfo: ''
    }
  },
  mounted () {
    var _this = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        if (_this.$route.path === '/login') {
          _this.loginClick()
        }
      }
    }
  },
  methods: {
    changeEvt (e) {
      this.$forceUpdate(e)
      this.loginParam.password = ''
    },
    update (e) {
      this.$forceUpdate(e) // 刷新
    },
    loginClick () {
      let loginInfo = this.loginParam
      if (validate.isEmpty(loginInfo.userName) || validate.isEmpty(loginInfo.password)) {
        this.errorInfo = '请输入帐号或密码'
        this.isShowTips = true
        logger.error('login Failed==>' + JSON.stringify(loginInfo))
        return
      }
      logger.info('loginParam==>' + JSON.stringify(loginInfo))
      ipcRenderer.send('saveUserObj', loginInfo)
      this.$router.push('/home')
    }
  }
}
</script>

<style lang='scss' scoped>
#wrapper{
  width: 100%;
  height: 100%;
  .content {
    position: relative;
    padding: 0px 20px;
    height: calc(100% - 30px);
    .login-body {
      padding-top: 82px;
      box-sizing: border-box;
    }
    
    /deep/.login-form-item-row.el-row {
      height: 48px;
    }

    .el-col.el-col-24 {
      position: relative;
      height: 100%;
      /deep/.el-input__prefix {
        top: 5px;
      }
      // /deep/.el-input__suffix {
        // top: 5px;
        // display: none;
      // }
    }

    /deep/ i.el-input__icon.el-icon-user {
      height: auto;
      width: 25px;
      text-align: center;
      -webkit-transition: all .3s;
      transition: all .3s;
      line-height: normal;
    }


    /deep/ .el-input__suffix-inner {
      pointer-events: all;
      display: flex;
      align-items: center;
    }

    /deep/ img.el-icon-edit.el-input__icon {
      height: 20px;
      width: 18px;
      display: inline-block;
      cursor: pointer;
    }

    /deep/ i.el-input__icon.el-icon-circle-close {
      width: 18px;
      height: 26px;
      display: inline-block;
      cursor: pointer;
      margin-right: 5px;
      &:hover {
        .el-icon-circle-close:before {
          color: #999;
        }
      }
    }

    /deep/.el-input.el-input--prefix.el-input--suffix {
      height: 100%;
    }
    
    /deep/ input.el-input__inner {
      background: transparent;
      color: #333;
      padding-left: 30px;
    }

    /deep/span.el-input__prefix {
      left: 0;
    }

    /deep/.el-icon-user:before {
      content: "\E6E3";
      font-size: 18px;
    }

    .el-col.el-col-24 > img {
      position: absolute;
      left: 0;
      top: 5px;
      z-index: 10;
    }

    .pwinput {
      /deep/input.el-input__inner {
        padding-left: 30px !important;
        padding-right: 57px !important;
        position: relative;
      }
    }

    .toolTips {
      color: #f34b4b;
      font-size: 12px;
    }

    .button-container {
      border-radius: 2px;
      outline: none;
      margin-top: 10px;
    }

    .button-container.loginbtn {
      position: absolute;
      width: calc(100% - 40px);
      box-sizing: border-box;
      bottom: 184px;
      /deep/button span {
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>