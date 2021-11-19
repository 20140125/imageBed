<template>
	<view>
		<u-card title="个人简介" :sub-title="authorized.now_time" :foot-border-top="false">
			<view slot="body">
				<u-form :model="authorized" label-position="top" label-width="140rpx">
					<u-form-item>
						<u-avatar :src="authorized.avatar_url" mode="circle"></u-avatar>
					</u-form-item>
					<u-form-item>
						<u-icon name="account" size="45"></u-icon>
						<text v-html="authorized.username"></text>
					</u-form-item>
					<u-form-item>
						<u-icon name="map" size="45"></u-icon>
						<text v-html="authorized.city"></text>
					</u-form-item>
					<u-form-item>
						<u-icon name="email" size="45"></u-icon>
						<text v-html="authorized.email"></text>
					</u-form-item>
					<u-form-item>
						<u-icon name="map-fill" size="45"></u-icon>
						<text v-html="authorized.ip_address"></text>
					</u-form-item>
					<u-form-item>
						<u-icon name="chat-fill" size="45"></u-icon>
						<text v-html="authorized.uuid"></text>
					</u-form-item>
				</u-form>
				<u-modal v-model="showOAuth" @confirm="confirmOAuth" content="授权登录" :show-title="false" show-cancel-button></u-modal>
				<OAuthLogin ref="oauth"></OAuthLogin>
			</view>
		</u-card>
	</view>
</template>

<script>
	import OAuthLogin from '@/components/OAuthLogin.vue'
	export default {
		data() {
			return {
				showOAuth: false
			}
		},
		computed: {
			authorized() {
				return this.$store.state.authorized
			}
		},
		mounted() {
			this.$nextTick(async () =>{
				if (!uni.getStorageSync('token')) {
					this.showOAuth = true
				}
			})
		},
		components: {
			OAuthLogin
		},
		methods: {
			/**
			 * todo：确认授权登录
			 */
			async confirmOAuth() {
				await this.$refs.oauth.getOauthConfig()
			},
		}
	}
</script>

<style scoped lang="scss">
	.u-avatar {
		margin-left: 40%;
	}
	.u-card {
		background-color: #f8faff!important;
	}
	.u-icon {
		margin-right: 30rpx;
	}
</style>
