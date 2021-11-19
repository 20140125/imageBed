<script>
export default {
	async onLaunch() {
		const vuex_remember_token = uni.getStorageSync('token')
		if (vuex_remember_token) {
			let response = await this.$u.api.getAuthorization({ token: vuex_remember_token }).catch(() => {
				uni.clearStorage()
			});
			await this.$store.commit('UPDATE_MUTATIONS', { authorized: response.lists });
		}
	},
}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "common/demo.scss";
</style>