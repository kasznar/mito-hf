import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import lodash from 'lodash'

Vue.prototype.$http = axios
Vue.prototype.$lodash = lodash
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
