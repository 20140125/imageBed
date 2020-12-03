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
				imgShow: false,
				index: 0,
				showBtn: false,
				screenHeight: 0,
				providerList: [],
				swpierData: [],
				imageData: {},
				detailDec: ""
			}
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			if (plus.os.name === 'Android') {
				this.showBtn = true;
			}
			// #endif
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			console.log(decodeURIComponent(e.data))
			let data = JSON.parse(decodeURIComponent(e.data))
			console.log(data)
			uni.setNavigationBarTitle({title: data.type_name+'-'+data.name})
			this.swpierData.push(data);
			this.getData(data);
		},
		methods: {
			/**
			 * todo:图片下载
			 */
			download: function() {
				console.log(this.swpierData[this.index]);
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
				console.log(this.swpierData[this.index]);
				// uni.request({
				// 	url: this.$serverUrl + '/v1/wx/image/details',
				// 	method: 'POST',
				// 	data: {id: e.id, type: e.type},
				// 	success: (res) => {
				// 		if (res.data.code !== 200) {
				// 			uni.showModal({
				// 				content: '请求失败，失败原因：' + res.data.msg,
				// 				showCancel: false
				// 			})
				// 			return;
				// 		}
				// 		this.imageData = res.data.item.type
				// 		this.swpierData = this.swpierData.concat(res.data.item.data)
				// 	},
				// 	fail: () => {
				// 		uni.showModal({
				// 			content: '请求失败，请重试!',
				// 			showCancel: false
				// 		})
				// 	}
				// })
				uni.showToast({
					icon: 'none',
					title: '点击收藏按钮'
				})
			},
			/**
			 * todo:图片tab切换
			 * @param {Object} e
			 */
			swpierChange: function(e) {
				this.index = e.detail.current;
				console.log(this.swpierData[this.index]);
				uni.setNavigationBarTitle({title: this.imageData.name+'-'+this.swpierData[this.index].name});
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
						this.imageData = res.data.item.type
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
