// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import Axios from 'axios'

import 'iview/dist/styles/iview.css'
// import 'jquery'
Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.$http = Vue.$http = Axios

let $baseUrl = process.env.NODE_ENV === 'development' ? 'http://www.cx-tech.co:8010' : 'http://172.19.92.233:8010'
// let $baseUrl = process.env.NODE_ENV === 'development' ? 'http://10.3.149.56:8010' : 'http://172.19.92.233:8010'
console.log($baseUrl)
Vue.prototype.$baseUrl = Vue.$baseUrl = $baseUrl
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
