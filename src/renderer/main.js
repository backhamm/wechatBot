import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import './common/globalComponents'

import VueSocketIo from 'vue-socket.io'

Vue.use(
  // new VueSocketIo({connection: 'http://192.168.8.26:5060'})
  new VueSocketIo({
    connection: 'http://localhost:5060',
    vuex: {
      store,
      actionPrefix: 'socket_' // 服务端会触发vuex中带有socket_字段的actions方法
    }
  })
)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
