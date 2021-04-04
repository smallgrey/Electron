import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/chat/view/chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'chat',
      component: chat
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    }
  ]
})
