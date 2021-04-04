import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('../views/Login').default,
      redirect: '/login',
      children: [
        {
          name: 'login',
          path: 'login',
          component: require('../views/Login').default
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: require('../views/Home').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
