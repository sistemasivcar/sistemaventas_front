import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios';

const environment = '45.90.223.88';
const api_port = '80';

Vue.config.productionTip = false
axios.defaults.baseURL = `http://${environment}:${api_port}/api/`

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
