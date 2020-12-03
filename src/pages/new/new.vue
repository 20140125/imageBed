<template>
	<view class="index" style="background: #FFFFFF;"> 
		<view class="grid" v-show="!isCanUse">
			<view class="grid-c-06" v-for="(item, index) in list" :key="index">
				<view class="panel" @click="goDetail(item)">
					<image class="card-img card-list2-img" :src="item.href"></image>
					<text class="card-num-view card-list2-num-view">{{item.width || 0}}P</text>
					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more v-show="!isCanUse"  :status="loadMore"></uni-load-more>
		<view class="grid" v-show="isCanUse">
			<view class="grid-c-12">
				<view class="panel">
					<open-data type="userAvatarUrl" style="width: 120upx;height: 120upx;margin-left: 40%;margin-bottom: 50upx;"></open-data>
					<view style="margin-left: 30upx;margin-bottom: 40upx;">申请获取以下权限</view>
					<text style="margin-left: 30upx;margin-bottom: 100upx;color: #9e9e9e;">获得你的公开信息(昵称，头像、地区等)</text>
					<button class="button" type='primary' style="border-radius: 50upx;vertical-align:middle;" open-type="getUserInfo" @getuserinfo="loginSystem">
						授权登录
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				providerList: [],
				list: [],
				fetch: {pageNum: 0, pageLimit: 10, total: 1},
				numArr: [2, 3, 4, 5, 6, 7, 8],
				id: 0,
				loadMore: 'more',
				userInfo:{},
				isCanUse: true
			}
		},
		components: {uniLoadMore},
		onLoad() {
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline'],
			})
		},
		onShow() {
			uni.getStorage({
				key:'token',
				success:()=>{
					this.isCanUse = false
					this.getData(this.id)
				},
				fail: () => {
					this.isCanUse = true
				}
			})
			this.id = this.numArr[(Math.random() * 7 | 0) + 1]
			setInterval(() => {
				this.shuffle()
			}, Math.random() * 600000 | 0)
		},
		onReachBottom() {
			!this.isCanUse ? this.getData(this.id) : console.log('请登录');
		},
		onPullDownRefresh() {
			!this.isCanUse ? this.getData(this.id) : console.log('请登录');
		},
		methods: {
			/**
			 * todo:数据获取
			 * @param {Object} id
			 */
			getData: function(id) {
				this.loadMore = 'loading'
				this.fetch.pageNum++
				if(this.fetch.total === this.list.length) {
					this.loadMore = 'noMore'
					return false
				}
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/bed',
					method: 'POST',
					data: {
						page: this.fetch.pageNum,
						limit: this.fetch.pageLimit,
						id: id
					},
					success: (ret) => {
						if (ret.data.code === 200) {
							uni.stopPullDownRefresh()
							this.fetch.total = ret.data.item.total
							this.list = this.list.concat(ret.data.item.data);
						}
					},
					fail: () => {
						this.isCanUse = true
						uni.showModal({
							content: '请求失败，请重试!',
							showCancel: false
						})
					}
				});
			},
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
														this.isCanUse = false
														this.getData(this.id)
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
			/**
			 * todo:图片详情
			 * @param {Object} e
			 */
			goDetail: function(e) {
				uni.navigateTo({
					url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				})
			},
			/**
			 * todo:数据排序
			 */
			shuffle: function () {
				this.list.sort(function () {
					return Math.random() - 0.5
				})
			}
		}
	}
</script>

<style>
	.grid{
		padding-top: 10px;
	}
</style>
