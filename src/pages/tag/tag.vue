<template>
	<view class="index">
		<view class="grid grid-c-12" style="margin-top: 60upx;">
			<uni-list class="grid-c-12">
				 <uni-list-item v-for="(item, index) in data":key="item.id":clickable='true' :title="item.name" @click="goBack(item)">
					<view slot="footer" style="right: 10upx;">
						<uni-icons :type="type"></uni-icons>
					</view>
			    </uni-list-item>
			</uni-list>
		</view>
		<uni-load-more :status="loadMore" :contentText="contentText"></uni-load-more>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		data() {
			return {
				data: [],
				type: 'arrowright',
				loadMore: 'more',
				contentText:{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: ''},
				userInfo:{}
			}
		},
		components: {uniNavBar,uniList,uniListItem,uniLoadMore},
		onShow(){
			this.getData()
		},
		methods: {
			/**
			 * todo:获取分类数据
			 */
			getData: function() {
				this.type = 'arrowright'
				this.loadMore = 'loading'
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/bed',
					method: 'POST',
					data: {},
					success: (ret) => {
						this.loadMore = 'noMore'
						this.data = ret.data.code === 200 ? ret.data.item : []
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
			 * todo:数据返回
			 * @param {Object} item
			 * @param {Object} type
			 */
			goBack: function(item) {
				item.children.length > 0 ? this.getSeond(item) : this.goList(item)
			},
			/**
			 * todo:获取子集
			 * @param {Object} item
			 */
			getSeond: function(item) {
				this.data = item.children;
			},
			/**
			 * todo:页面跳转
			 * @param {Object} item
			 */
			goList: function(item) {
				uni.navigateTo({
					url: '../list/list?data=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style>

</style>
