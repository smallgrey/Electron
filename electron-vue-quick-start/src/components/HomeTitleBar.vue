<template>
  <el-row class='main-title-bar'>
    <el-col :span='12' class='title'>{{ titled }}</el-col>
    <el-col :span='12' class='operate'>
      <img
        @click='minimize'
        class='minimize'
        :src='minSelectedSrc'
        @mouseover="changeIcon('minimize', 'minimizeHoverSrc')"
        @mouseout="changeIcon('minimize', 'minimizeSrc')"
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
export default {
  name: 'HomeTitleBar',
  props: {
    titled: String
  },

  data () {
    return {
      isMaximize: false,
      minimizeSrc: require('../assets/images/minsize_normal_new.png'),
      minimizeHoverSrc: require('../assets/images/minsize_click_new.png'),
      closeSrc: require('../assets/images/close_dialog_normal.png'),
      closeHoverSrc: require('../assets/images/close_hover.png'),
      minSelectedSrc: null,
      closeSelectedSrc: null,
      closeStyle: {}
    }
  },
  mounted () {
    this.minSelectedSrc = this.minimizeSrc
    this.closeSelectedSrc = this.closeSrc
    this.showlistsSelectedSrc = this.showlistsSrc
  },

  methods: {
    close () {
      this.$confirm('您确定要退出应用吗?', '提示', {
        cancelButtonText: '取消',
        cancelButtonClass: 'login-out-cancel-btn',
        confirmButtonText: '确定',
        iconClass: 'el-icon-warning-outline',
        customClass: 'login-out-box',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$electron.ipcRenderer.send('close')
        })
        .catch(() => {})
    },
    minimize () {
      this.$electron.ipcRenderer.send('minimize')
    },
    changeIcon (type, name) {
      switch (type) {
        case 'minimize': {
          this.minSelectedSrc = this[name]
          break
        }
        case 'close': {
          this.closeSelectedSrc = this[name]
          if (name === 'closeHoverSrc') {
            this.closeStyle['background-color'] = 'red'
          } else {
            this.closeStyle['background-color'] = ''
          }
          break
        }
        default:
          break
      }
    }
  }
}
</script>

<style>
.operate img {
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.main-title-bar {
  -webkit-app-region: drag;
}
.main-title-bar .title {
  height: 30px;
  line-height: 30px;
  display: inline-block;
  font-family: Microsoft YaHei;
  font-weight: 700;
  color: #2a2b2c;
  font-size: 14px;
  letter-spacing: 0;
  text-indent: 10px;
}
.main-title-bar.el-row {
  display: flex;
  align-items: center;
}
.main-title-bar .operate {
  text-align: right;
}

.main-title-bar .operate img {
  vertical-align: middle;
}

.main-title-bar .operate .close {
  width: 24px;
  height: 24px;
}
</style>
