import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router/router'
import vuetify from './plugins/vuetify'
import store from '@/store/store'
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
