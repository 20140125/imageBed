<template>
	<view class="center">
		<view class="logo" @click="open">
			<button class="button"  @click="loginSystem">
				<image class="logo-img" :src="avatarUrl"></image>
				<view class="login-title">{{!isCanUse ? '授权登录' : ''}}</view>
			</button>
		</view>
		<view class="center-list" @click="open">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe603;</text>
				<text class="list-text">我的收藏</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">账号管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="about">
			<view class="content">
				<text class="tip">版权申明</text>
				<view class="desc">本站表情来于互联网，版权归原作者所有。</view>
				<view class="desc">本站不存储表情图资源，表情图请勿商用。</view>
				<view class="desc">如有侵犯您权利的资源，请联系我们处理。</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<image src="../../static/wx_program.jpg" style="display: fix;justify-content: center;object-fit: cover;"></image>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				avatarUrl: '/static/logo.png',
				isCanUse: false
			}
		},
		components:{ uniPopup },
		onShow(){
			uni.getStorage({
				key:'token',
				success:(res)=>{
					this.isCanUse = true
				},
				fail: () => {
					this.isCanUse = false
				}
			})
			uni.getStorage({
				'key':'image',
				success:(res)=>{
					this.avatarUrl = res.data
				},
				fail: () => {
					
				}
			})
		},
		methods: {
			open() {
				// #ifdef APP-PLUS
				this.$refs.popup.open()
				// #endif
			},
			/**
			 * todo:数据保存
			 * @param {Object} key
			 * @param {Object} value
			 */
			setStorage (key,value) {
				try {
					uni.setStorageSync(key, value)
				} catch (e) {
					console.log(e)
				}
			},
			/**
			 * todo:登录系统
			 */
			loginSystem() {
				uni.login({
					provider: 'weixin',
					success:  (loginRes) => {
						uni.request({
							url: this.$serverUrl + '/v1/mini_program/openid',
							method: 'POST',
							data: {code: loginRes.code},
							success: (ret) => {
								console.log(ret.data)
								uni.getUserProfile({
									desc: '获取用户信息',
									success: (infoRes) => {
										console.log(infoRes)
										this.userInfo = infoRes.userInfo
										this.userInfo.code2Session = ret.data.item.lists
										console.log(this.userInfo.code2Session)
										uni.request({
											url: this.$serverUrl + '/v1/mini_program/login',
											method: 'POST',
											data: this.userInfo,
											success: (login) => {
												this.userInfo = login.data.item.lists
												this.setStorage('token',login.data.item.lists.remember_token)
												this.avatarUrl = login.data.item.lists.avatar_url
												this.setStorage('image',login.data.item.lists.avatar_url)
												this.isCanUse = true
												console.log(login)
											},
										})
									}
								})
							},
							fail: () => {
								uni.showModal({
									content: '请求失败，请重试!',
									showCancel: false
								})
							}
						})
					}
				});
			},
		}
	}
</script>

<style>
	.about {
		flex-direction: column;
		flex: 1;
		margin-top: 300upx;
		text-align: center;
		background-color: #FFFFFF;
	}
	.content {
		flex: 1;
		padding: 30upx;
		flex-direction: column;
		justify-content: center;
		font-size: 30upx;
		color: #353333;
	}
	.tip {
		margin-top: 20upx;
		color: #000000;
		text-align: center;
	}
	.desc {
		margin-top: 30upx;
		display: block;
		font-size: 28upx;
	}
</style>
