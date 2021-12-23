<template>
	<u-popup v-model="popup" mode="bottom" height="150px">
		<u-grid :col="3">
			<u-grid-item v-for="(item, index) in oauthLogin" :key="index" @click="loginSYS(item)">
				<u-icon :name="item.icon" size="50" color="#303133"></u-icon>
				<view class="grid-text"v-html="item.name"></view>
			</u-grid-item>
		</u-grid>
	</u-popup>
</template>

<script>
	export default {
		name: 'OAuthLogin',
		data() {
			return {
				popup: false,
				oauthLogin: [],
				iconMap: { QQ: 'qq-fill', GITHUB: 'github-circle-fill', WEIBO: 'weibo', BAIDU: 'baidu', GITEE: 'account-fill', OSCHINA: 'account' }
			};
		},
		methods: {
			/**
			 * todo：确认授权登录
			 */
			async getOauthConfig() {
				let response = await this.$u.api.getOauthConfig({ name: 'Oauth', login: 'before' });
				this.oauthLogin = (response.lists || {}).children || [];
				this.oauthLogin.forEach(item => {
					item.name = item.name.toUpperCase();
					item.icon = this.iconMap[item.name.toUpperCase()];
				});
				this.popup = true;
			},
			/**
			 * todo:授权登录
			 * @param {Object} item
			 */
			loginSYS(item) {
				window.location.href = item.value +'/'+ Date.parse(new Date());
			},
		}
	}
</script>

<style>

</style>
