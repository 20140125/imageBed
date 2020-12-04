import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// Vue.prototype.$serverUrl = 'https://www.fanglonger.com/api';
Vue.prototype.$serverUrl = 'http://www.laravel.com/api';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()