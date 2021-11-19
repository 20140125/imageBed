// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
const newImageLists = 'v1/image/newLists';
const checkAuthorization = 'v1/check/authorized';
const oauthConfig = 'v1/oauth/config';
const configuration = 'v1/image/hotKeyWord';
const splider = 'v1/spider/index';
const imageSpider = 'v1/image/spider';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
const install = (Vue, vm) => {
	// 获取图片地址
	const getNewImage = (params = {}) => vm.$u.post(newImageLists, params);
	// 用户鉴权
	const getAuthorization = (params = {}) => vm.$u.post(checkAuthorization, params);
	// 获取登录授权
	const getOauthConfig = (params = {}) => vm.$u.post(oauthConfig, params);
	// 获取系统配置
	const getConfiguration = (params = {}) => vm.$u.post(configuration, params);
	// 获取爬虫列表
	const getSplider = (params = {}) => vm.$u.post(splider, params);
	// 执行脚本
	const runingSplider = (params = {}) => vm.$u.post(imageSpider, params);
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = { getNewImage, getAuthorization, getOauthConfig, getConfiguration, getSplider, runingSplider };
}

export default {
	install
}