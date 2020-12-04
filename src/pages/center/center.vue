<template>
	<view class="center">
		<view class="logo">
			<button class="button" open-type="getUserInfo" @getuserinfo="loginSystem">
				<image class="logo-img" :src="avatarUrl"></image>
				<view class="login-title">{{!isCanUse ? '授权登录' : ''}}</view>
			</button>
		</view>
		<!-- <view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60c;</text>
				<text class="list-text">收藏图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe60d;</text>
				<text class="list-text">收藏图集</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">管理图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe61a;</text>
				<text class="list-text">上传图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view> -->
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe603;</text>
				<text class="list-text">关于</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">账号管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: '/static/logo.png',
				isCanUse: false
			}
		},
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
			/**
			 * todo:数据保存
			 * @param {Object} key
			 * @param {Object} value
			 */
			setStorage:function (key,value) {
				try {
					uni.setStorageSync(key, value)
				} catch (e) {
					console.log(e)
				}
			},
			/**
			 * todo:登录系统
			 */
			loginSystem:function() {
				uni.login({
					provider: 'weixin',
					success:  (loginRes) => {
						console.log(loginRes)
						uni.request({
							url: this.$serverUrl + '/v1/wx/openid',
							method: 'POST',
							data: {code: loginRes.code},
							success: (ret) => {
								if (ret.data.code === 200) {
									console.log(ret.data)
									uni.getUserInfo({
										provider: 'weixin',
										success: (infoRes) => {
											this.userInfo = infoRes.userInfo
											this.userInfo.code2Session = ret.data.item
											console.log(this.userInfo.code2Session)
											uni.request({
												url: this.$serverUrl + '/v1/wx/login',
												method: 'POST',
												data: this.userInfo,
												success: (login) => {
													if (login.data.code === 200) {
														this.userInfo = login.data.item
														this.setStorage('token',login.data.item.remember_token)
														this.avatarUrl = login.data.item.avatar_url
														this.setStorage('image',login.data.item.avatar_url)
														this.isCanUse = true
														console.log(login)
													}
												},
											})
										}
									})
								}
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
</style>
