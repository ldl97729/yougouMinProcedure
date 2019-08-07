import Vue from 'vue'
import App from './App'
// import myaxios from './utils/myaxios'
// Vue.use(myaxios)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
