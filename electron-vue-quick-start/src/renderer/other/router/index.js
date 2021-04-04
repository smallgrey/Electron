import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'otherPage',
      component: require('../views/Other').default
    },
    {
      path: '/otherPage',
      name: 'home',
      component: require('../views/Other').default
    }
  ]
})
