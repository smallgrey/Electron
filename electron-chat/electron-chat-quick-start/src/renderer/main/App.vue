<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import sdkService from '../../service/TsdkService'
  export default {
    name: 'chat-app',
    created () {
      this.initApp()
    },
    methods: {
      initApp () {
        sdkService.initTsdk()
      }
    }
  }
</script>

<style scoped>
  *{
	padding: 0;
	margin: 0;
  }
  
  #app{
    font-family:Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    text-align:center;
    color:#2c3e50;
  }
</style>
