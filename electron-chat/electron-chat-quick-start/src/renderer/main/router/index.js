import Vue from 'vue'
import Router from 'vue-router'
import Contacts from '../views/Contacts.vue'
import Login from '../views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Contacts',
      name: 'Contacts',
      component: Contacts
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
