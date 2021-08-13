<template>
	<view class="index"> 
		<view class="grid">
			<view class="grid-c-06" v-for="(item, index) in list" :key="index" v-if="item.href">
				<view class="panel" @click="goDetail(item)">
					<image class="card-img card-list2-img" :src="item.href || ''"></image>
					<text class="card-num-view card-list2-num-view">{{item.width || ''}}{{item.width ? 'P' : ''}}</text>
					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadMore"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				list: [],
				fetch: {pageNum: 0, pageLimit: 10, total: 1},
				id: 0,
				loadMore: 'more',
				source: 'app'
			}
		},
		components: {uniLoadMore},
		onLoad() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline'],
			})
			this.source = 'mini_program'
			// #endif
		},
		onShow() {
			uni.getStorage({
				key:'token',
				success: (res) => {
					this.getData(res.data)
				},
				fail: ()=> {
					this.getData()
				}
			})
		},
		onReachBottom() {
			uni.getStorage({
				key:'token',
				success: (res) => {
					this.getData(res.data)
				},
				fail: ()=> {
					this.getData()
				}
			})
		},
		onPullDownRefresh() {
			this.lits = []
			this.fetch = { pageNum: 1, pageLimit: 10 }
			uni.getStorage({
				key:'token',
				success: (res) => {
					this.getData(res.data)
				},
				fail: ()=> {
					this.getData()
				}
			})
		},
		methods: {
			/**
			 * todo:数据获取
			 */
			getData: function(token = '') {
				this.loadMore = 'loading'
				this.fetch.pageNum++
				if(this.fetch.total === this.list.length) {
					this.loadMore = 'noMore'
					return false
				}
				uni.request({
					url: this.$serverUrl + '/v1/image/newLists',
					method: 'POST',
					data: {
						page: this.fetch.pageNum,
						limit: this.fetch.pageLimit,
						source: this.source,
						token: token
					},
					success: (ret) => {
						if (ret.data.item.code === 20000) {
							uni.stopPullDownRefresh()
							this.fetch.total = ret.data.item.lists.total
							this.list = Array.from(new Set(this.list.concat(ret.data.item.lists.data)));
						} else {
							uni.showToast({ title: 'Please Login', icon: 'success' })
							this.loadMore = 'noMore'
						}
					},
					fail: () => {
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
