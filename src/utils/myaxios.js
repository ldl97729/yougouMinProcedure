import axios from 'axios'
var myaxios = {}
myaxios.install = function(Vue) {
    Vue.prototype.$http = axios
}

export default myaxios