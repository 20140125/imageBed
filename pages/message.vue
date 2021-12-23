<template>
	<u-card :foot-border-top="false" class="chat" :title="`${users.post_name}`"
		:sub-title="`${users.post_online ? '[在线]' : '[离线]'}`">
		<view slot="body">
			<u-avatar :size="80" :src="users.post_img"></u-avatar>
		</view>
	</u-card>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			authorized() {
				return this.$store.state.authorized || []
			},
			users() {
				return this.$route.query.users ? JSON.parse(decodeURIComponent(this.$route.query.users)) : []
			},
		},
		watch: {
			$route() {
				uni.setNavigationBarTitle({
					title: (this.users || {}).post_name || '魔盒逗图-联系人'
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				uni.setNavigationBarTitle({
					title: (this.users || {}).post_name || '魔盒逗图-联系人'
				})
			})
		}
	}
</script>

<style>
</style>
