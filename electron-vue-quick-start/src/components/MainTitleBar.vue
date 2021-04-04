<template>
  <el-row class='main-title-bar'>
    <el-col :span='12' class='title'>Test Electron</el-col>
    <el-col :span='12' class='operate'>
      <img
        @click='minimize'
        class='minimize'
        :src='minSelectedSrc'
        @mouseover="changeIcon('minimize', 'minimizeHoverSrc')"
        @mouseout="changeIcon('minimize', 'minimizeSrc')"
      />
      <img
        @click='maximize'
        class='maximize'
        :src='maxSelectedSrc'
        @mouseover="changeIcon('maximize', 'over')"
        @mouseout="changeIcon('maximize', 'out')"
      />
      <img
        @click='close'
        class='close'
        :style='closeStyle'
        :src='closeSelectedSrc'
        @mouseover="changeIcon('close', 'closeHoverSrc')"
        @mouseout="changeIcon('close', 'closeSrc')"
      />
    </el-col>
  </el-row>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'MainTitleBar',
  data () {
    return {
      isMaximize: false,
      minimizeSrc: require('../assets/images/minsize_normal_new.png'),
      minimizeHoverSrc: require('../assets/images/minsize_click_new.png'),
      normalSrc: require('../assets/images/maxsize_normal_new.png'),
      normalHovereSrc: require('../assets/images/maxsize_click_new.png'),
      maximizeSrc: require('../assets/images/restore_normal_new.png'),
      maximizeHoverSrc: require('../assets/images/restore_click_new.png'),
      closeSrc: require('../assets/images/close_dialog_normal.png'),
      closeHoverSrc: require('../assets/images/close_hover.png'),
      minSelectedSrc: null,
      maxSelectedSrc: null,
      closeSelectedSrc: null,
      closeStyle: {},
      mainMenuStyles: {
        position: 'absolute',
        display: 'none',
        top: '30px',
        right: '120px',
        'z-index': '1000000'
      },
      dialogVisible: false,
      message: '',
      fullscreenLoading: false
    }
  },
  mounted () {
    this.minSelectedSrc = this.minimizeSrc
    this.maxSelectedSrc = this.normalSrc
    this.closeSelectedSrc = this.closeSrc
  },
  created () {
    ipcRenderer.on('main-window-max', (event) => {
      let _this = this
      _this.maxSelectedSrc = _this.maximizeSrc
    })
    ipcRenderer.on('main-window-unmax', (event) => {
      let _this = this
      _this.isMaximize = false
      _this.maxSelectedSrc = _this.normalSrc
    })
  },
  methods: {
    close () {
      this.$confirm('您确定要退出应用吗?', '提示', {
        cancelButtonText: '取消',
        cancelButtonClass: 'login-out-cancel-btn',
        confirmButtonText: '确定',
        customClass: 'login-out-box',
        iconClass: 'el-icon-warning-outline',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          ipcRenderer.send('close')
        })
        .catch(() => {})
    },
    minimize () {
      ipcRenderer.send('minimize')
    },
    maximize () {
      this.isMaximize = !this.isMaximize
      ipcRenderer.send('maximize', this.isMaximize)
    },
    changeIcon (type, name) {
      switch (type) {
        case 'minimize':
          this.minSelectedSrc = this[name]
          break
        case 'maximize':
          if (this.isMaximize) {
            this.maxSelectedSrc =
              name === 'over' ? this.maximizeHoverSrc : this.maximizeSrc
          } else {
            this.maxSelectedSrc =
              name === 'over' ? this.normalHovereSrc : this.normalSrc
          }
          break
        case 'close':
          this.closeSelectedSrc = this[name]

          if (name === 'closeHoverSrc') {
            this.closeStyle['background-color'] = 'red'
          } else {
            this.closeStyle['background-color'] = ''
          }
          break
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.main-title-bar {
  -webkit-app-region: drag;
  position: relative;
}

.main-title-bar {
  /deep/.title {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    font-family: Microsoft YaHei;
    font-size: 700;
    font-size: 14px;
    color: #2a2b2c;
    letter-spacing: 0;
    text-indent: 0;
  }
}

.main-title-bar .operate {
  text-align: right;
}

.main-title-bar .operate img {
  vertical-align: middle;
  -webkit-app-region: no-drag;
}

.main-title-bar .operate .close {
  width: 24px;
  height: 24px;
}

.main-title-bar .el-menu-item.is-active {
  color: #303133;
}

.main-title-bar .importDialog >>> .el-dialog__body {
  padding: 10px 20px 0px 20px;
}

.main-title-bar .import-error {
  color: red;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  word-break: break-all;
}

.el-button {
  width: 140px;
  height: 34px;
  border-radius: 2px;
  padding: 0;
}

.el-button > span {
  font-family: Microsoft YaHei;
  font-size: 14px;
  text-align: center;
  line-height: 34px;
}

.el-dialog .el-button {
  width: 60px;
  height: 26px;
  border-radius: 2px;
  padding: 0;
}

.el-dialog .el-button > span {
  font-family: Microsoft YaHei;
  font-size: 12px;
  text-align: center;
  line-height: 26px;
}
</style>
