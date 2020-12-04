<template>
	<view class="center">
		<view class="logo">
			<button class="button" open-type="getUserInfo" @getuserinfo="loginSystem">
				<image class="logo-img" :src="avatarUrl"></image>
				<view class="login-title">{{!isCanUse ? '授权登录' : ''}}</view>
			</button>
		</view>
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
		
		<view class="about">
			<view class="content">
				<text class="tip">版权申明</text>
				<view class="desc">本站表情来于互联网，版权归原作者所有。</view>
				<view class="desc">本站不存储表情图资源，表情图请勿商用。</view>
				<view class="desc">如有侵犯您权利的资源，请联系我们处理。</view>
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
