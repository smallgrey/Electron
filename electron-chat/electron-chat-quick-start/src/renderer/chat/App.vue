<template>
  <div id="chatRoom">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'chat'
}
</script>

<style>
/* CSS */
#app {
  -webkit-app-region: drag;
}
#inviteWin{
  width: 100%;
  height: 100%;
}
</style>
