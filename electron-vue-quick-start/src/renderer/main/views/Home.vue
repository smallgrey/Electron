<template>
    <div>
        <main-title-bar></main-title-bar>
        首页
        <el-button @click="openNewPage">打开子页面</el-button>
    </div>
</template>

<script>
import MainTitleBar from '../../../components/MainTitleBar'
export default {
  name: 'Home_View',
  components: {
    'main-title-bar': MainTitleBar
  },
  mounted () {
    this.changeWindowSize()
  },
  methods: {
    changeWindowSize () {
      this.$electron.ipcRenderer.send('changWindowSize')
    },
    openNewPage () {
      this.$electron.ipcRenderer.send('showOtherWindow')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
