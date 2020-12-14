<template>
	<view class="index">
		<swiper @change="swpierChange" :style="{height:screenHeight + 'px'}">
			<swiper-item v-for="(image,index) in swpierData" :key="index">
				<image :src="image.href" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		<view class="detail-btn-view">
			<view class="download" @click="download"></view>
			<view class="collect" @click="collect"></view>
		</view>
	</view>
</template>

<script>
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
			uni.setNavigationBarTitle({title: data.name})
			this.swpierData.push(data);
			this.getData(data);
		},
		methods: {
			/**
			 * todo:图片下载
			 */
			download: function() {
				uni.downloadFile({
					url: this.swpierData[this.index].href,
					success: (e) => {
						console.log(e);
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: () => {
								uni.showToast({
									icon: 'none',
									title: '已保存到手机相册'
								})
							},
							fail: () => {
								uni.showToast({
									icon: 'none',
									title: '保存到手机相册失败'
								})
							}
						});
					},
					fail: (e) => {
						uni.showModal({
							content: '下载失败，' + e.errMsg,
							showCancel: false
						})
					}
				})
			},
			/**
			 * todo:图片收藏
			 */
			collect: function() {
				uni.getStorage({
					key:'token',
					success:(token)=>{
						uni.request({
							url: this.$serverUrl + '/v1/wx/image/collect',
							method: 'POST',
							data: {token: token.data, post: this.swpierData[this.index],'act':1},
							success: (res) => {
								if (res.data.code !== 200) {
									uni.showModal({
										content: '请求失败，请重试!',
										showCancel: false
									})
									return;
								}
								uni.showToast({
									icon: 'success',
									title: '收藏图片成功'
								})
							},
							fail: () => {
								uni.showModal({
									content: '请求失败，请重试!',
									showCancel: false
								})
							}
						})
					},fail:()=>{
						uni.showToast({
							icon: 'none',
							title: '请先登录'
						})
					}
				})
				
			},
			/**
			 * todo:图片tab切换
			 * @param {Object} e
			 */
			swpierChange: function(e) {
				this.index = e.detail.current;
				uni.setNavigationBarTitle({title: this.swpierData[this.index].name});
			},
			/**
			 * todo:数据获取
			 * @param {Object} e
			 */
			getData: function(e) {
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/details',
					method: 'POST',
					data: {id: e.id, type: e.type},
					success: (res) => {
						if (res.data.code !== 200) {
							uni.showModal({
								content: '请求失败，失败原因：' + res.data.msg,
								showCancel: false
							})
							return;
						}
						this.swpierData = this.swpierData.concat(res.data.item.data)
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
