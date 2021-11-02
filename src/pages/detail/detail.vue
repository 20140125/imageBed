<template>
	<view class="index">
		<swiper @change="swpierChange" :style="{height:screenHeight + 'px'}">
			<swiper-item v-for="(image,index) in swpierData" :key="index">
				<image :src="image.href" mode="widthFix" @longtap="download"></image>
			</swiper-item>
		</swiper>
		<view class="detail-btn-view">
			<view class="download" @click="download"></view>
		</view>
	</view>
</template>

<script>
	import func from '@/api/methods.js'
	export default {
		data() {
			return {
				index: 0,
				screenHeight: 0,
				swpierData: [],
			}
		},
		onLoad(e) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			let data = JSON.parse(decodeURIComponent(e.data))
			uni.setNavigationBarTitle({
				title: data.name
			})
			this.swpierData.push(data)
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.getData(data, res.data)
				},
				fail: () => {
					uni.showToast({
						title: 'Please Login'
					})
				}
			})
		},
		methods: {
			/**
			 * todo:图片下载
			 */
			download: function() {
				func.downloadFile(this.swpierData[this.index].href)
			},
			/**
			 * todo:图片tab切换
			 * @param {Object} e
			 */
			swpierChange: function(e) {
				this.index = e.detail.current
				uni.setNavigationBarTitle({
					title: this.swpierData[this.index].name
				})
			},
			/**
			 * todo:数据获取
			 * @param {Object} e
			 */
			getData: function(e, token = '') {
				uni.request({
					url: this.$serverUrl + '/v1/image/lists',
					method: 'POST',
					data: {
						id: e.type,
						page: 1,
						limit: 30,
						source: 'mini_program',
						token: token
					},
					success: (res) => {
						if (ret.statusCode !== 200) {
							uni.clearStorage();
							return false;
						}
						this.swpierData = this.swpierData.concat(res.data.item.lists.data)
					},
					fail: () => {
						uni.showModal({
							content: '请求失败，请重试!',
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #000;
		height: 100%;
	}

	swiper {
		flex: 1;
		width: 750upx;
		background-color: #000;
		display: flex;
		flex-direction: column;
	}

	swiper-item {
		display: flex;
		align-items: center;
	}

	image {
		width: 750upx;
		height: 1125upx;
	}
</style>
