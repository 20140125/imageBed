<template>
	<view class="index" style="background: #FFFFFF;"> 
		<view class="grid">
			<view class="grid-c-06" v-for="(item, index) in list" :key="index">
				<view class="panel" @click="goDetail(item)">
					<image class="card-img card-list2-img" :src="item.href || ''"></image>
					<text class="card-num-view card-list2-num-view">{{item.width || 0}}P</text>
					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more  :status="loadMore"></uni-load-more>
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
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline'],
			})
			// #endif
			this.id = this.numArr[(Math.random() * 7 | 0) + 1]
		},
		onShow() {
			this.id = this.numArr[(Math.random() * 7 | 0) + 1]
			this.getData(this.id)
		},
		onReachBottom() {
			this.getData(this.id)
		},
		onPullDownRefresh() {
			this.lits = []
			this.id = this.numArr[(Math.random() * 7 | 0) + 1]
			this.getData(this.id)
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
			 * todo:图片详情
			 * @param {Object} e
			 */
			goDetail: function(e) {
				uni.navigateTo({
					url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
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
