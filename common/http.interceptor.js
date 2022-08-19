const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'https://api.fanglonger.com/api',
		header: {
			'content-type': 'application/json',
			'Accept': 'application/json, text/plain, */*'
		}
	});
	const vuex_remember_token = uni.getStorageSync('token')
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.Authorization = vuex_remember_token;
		config.data.token = vuex_remember_token;
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.code == 200) {
			return res.item;  
		}
		return false
	}
}

export default {
	install
}