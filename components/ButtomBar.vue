<template>
	<u-tabbar v-model="current" :list="list" :mid-button="true" active-color='#2979ff' @change="changeBar"></u-tabbar>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						count: 0,
						isDot: false,
						customIcon: false,
					},
					{
						iconPath: "search",
						selectedIconPath: "search",
						text: '搜索',
						customIcon: false,
					},
					{
						iconPath: "setting",
						selectedIconPath: "setting-fill",
						text: '工具',
						midButton: true,
						customIcon: false,
					},
					{
						iconPath: "server-fill",
						selectedIconPath: "server-man",
						text: '客服',
						customIcon: false,
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						count: 0,
						isDot: false,
						customIcon: false,
					},
				],
				current: 0,
				pathMap: [ '/pages/index', '/pages/search', '/pages/post','/pages/chat', '/pages/users' ] /* '/pages/chat' */
			}
		},
		watch: {
			current() {
				this.current = uni.getStorageSync('key').next
			}
		},
		methods: {
			/**
			 * todo:切换导航栏
			 * @param {Object} item
			 */
			changeBar(item) {
				uni.setStorageSync('key', { 'current': item, 'next': this.current })
				this.$router.push({ path: this.pathMap[item] })
			}
		}
	}
</script>

<style>
</style>
