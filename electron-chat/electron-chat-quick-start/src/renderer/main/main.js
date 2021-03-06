import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
