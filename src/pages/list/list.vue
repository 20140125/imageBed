<template>
	<view class="index">
		<view class="grid">
			<view class="grid-c-06" v-for="(item, index) in list" :key="index">
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
				token: '',
				source: 'app'
			}
		},
		components: {uniLoadMore},
		onLoad(e) {
			let data = JSON.parse(decodeURIComponent(e.data))
			this.id = data.id
			uni.setNavigationBarTitle({title: '专题-' + data.name})
			this.getData(this.id)
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			this.source = 'mini_program'
			// #endif
		},
		onReachBottom() {
			this.getData(this.id);
		},
		onPullDownRefresh() {
			this.getData(this.id);
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
				uni.getStorage({
					key:'token',
					success: (res) => {
						console.log(res)
						this.imageBed(res.data, id, this.source)
					},
					fail: ()=> {
						this.imageBed('', id, this.source)
					}
				})
			},
			/**
			 * todo：图床列表
			 * @param {Object} token
			 * @param {Object} id
			 * @param {Object} source 
			 */
			imageBed: function(token,id,source) {
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/bed',
					method: 'POST',
					data: {
						page: this.fetch.pageNum,
						limit: this.fetch.pageLimit,
						id: id,
						token: token,
						source: source
					},
					success: (ret) => {
						if (ret.data.code === 200) {
							uni.stopPullDownRefresh()
							this.fetch.total = ret.data.item.total
							this.list = this.list.concat(ret.data.item.data);
							this.loadMore = 'noMore'
						} else {
							uni.showToast({title: 'Please Login', icon: 'success'})
							uni.clearStorage()
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
				e.img_num = this.fetch.total
				uni.navigateTo({
					url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				})
			},
			/**
			 * todo:图片排序
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
