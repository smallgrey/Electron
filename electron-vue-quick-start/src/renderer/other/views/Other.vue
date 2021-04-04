<template>
    <div>
        其他页面
        <el-button @click="closePage">关闭</el-button>
    </div>
</template>

<script>
export default {
  name: 'other_page_home',
  methods: {
    closePage () {
      this.$electron.ipcRenderer.send('closeOtherWindow')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
