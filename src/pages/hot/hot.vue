<template>
	<view style="width: 100%;background-color: #FFFFFF;">
		<view class="search-box">				
			<view class="input-box">
				<input type="text" :adjust-position="true" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
				 placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<view class="search-btn" @tap="doSearch(false)">搜索</view>
		</view>
		
		<view class="search-keyword" v-show="showSearchBox">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<block v-for="(row,index) in keywordList" :key="index">
					<view class="keyword-entry" hover-class="keyword-entry-tap" >
						<view class="keyword-text" @tap.stop="doSearch(row)">
							<rich-text :nodes="row.name"></rich-text>
						</view>
						<view class="keyword-img" @tap.stop="setKeyword(row)">
							<image src="/static/HM-search/back.png"></image>
						</view>
					</view>
				</block>
			</scroll-view>
			
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(keyword,index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>热门搜索</view>
						<view>
							<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="(keyword,index) in hotKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜热门搜索已隐藏</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="index" v-show="showImageItme">
			<view class="grid">
				<view class="grid-c-06" v-for="(item, index) in list" :key="index">
					<view class="panel" @click="goDetail(item)">
						<image class="card-img card-list2-img" :src="item.href || 0"></image>
						<text class="card-num-view card-list2-num-view">{{item.width || 0}}P</text>
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
		
		
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				defaultKeyword: "请输入关键词查询",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				showSearchBox: false,
				showImageItme: false,
				
				list: [],
				fetch: {pageNum: 0, pageLimit: 10, total: 1},
				id: 0,
				loadMore: 'more',
				token: ''
			}
		},
		onLoad() {
			this.init()
			this.showImageItme = false
			this.showSearchBox = true
		},
		onShow() {
			this.showImageItme = false
			this.showSearchBox = true
		},
		methods: {
			init: function() {
				this.loadOldKeyword();
				this.loadHotKeyword();
			},
			blur: function(){
				uni.hideKeyboard()
			},
			/**
			 * todo:加载历史搜索,自动读取本地Storage
			 */
			loadOldKeyword: function() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			/**
			 * todo:加载热门搜索
			 */
			loadHotKeyword: function() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
				this.hotKeywordList = ['键盘', '鼠标', '显示器', '电脑主机', '蓝牙音箱', '笔记本电脑', '鼠标垫', 'USB', 'USB3.0'];
			}, 
			/**
			 * todo:监听输入
			 * @param {Object} event
			 */
			inputChange: function(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/type',
					method:'POST',
					data:{name:keyword},
					success: (res) => {
						this.showSearchBox = res.data.item.length > 0
						this.keywordList = [];
						this.keywordList = res.data.item;
						console.log(this.keywordList)
					}
				});
			},
			/**
			 * todo:高亮关键字
			 * @param {Object} keywords
			 * @param {Object} keyword
			 */
			drawCorrelativeKeyword: function(keywords, keyword) {
				return keywordArr;
			},
			/**
			 * todo:顶置关键字
			 * @param {Object} item
			 */
			setKeyword: function(item) {
				this.keyword = item.name;
			},
			/**
			 * 清除历史搜索
			 */
			oldDelete: function() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			/**
			 * todo:热门搜索开关
			 */
			hotToggle: function() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			/**
			 * todo:执行搜索
			 * @param {Object} keyword
			 */
			doSearch: function(item) {
				this.keyword = item.name;
				this.saveKeyword(this.keyword); //保存为历史 
				uni.showToast({
					title: this.keyword,
					icon: 'none',
					duration: 2000
				});
				this.getData(item.id)
			},
			/**
			 * todo:保存关键字到历史记录
			 * @param {Object} keyword
			 */
			saveKeyword: function(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			},
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
						this.imageBed(res.data,id)
					},
					fail: ()=> {
						this.imageBed('',id)
					}
				})
			},
			/**
			 * todo：图床列表
			 * @param {Object} token
			 * @param {Object} id
			 */
			imageBed: function(token,id) {
				uni.request({
					url: this.$serverUrl + '/v1/wx/image/bed',
					method: 'POST',
					data: {
						page: this.fetch.pageNum,
						limit: this.fetch.pageLimit,
						id: id,
						token: token
					},
					success: (ret) => {
						if (ret.data.code === 200) {
							uni.stopPullDownRefresh()
							this.fetch.total = ret.data.item.total
							this.list = this.list.concat(ret.data.item.data);
							this.loadMore = 'noMore'
							this.showImageItme = true
							this.showSearchBox = false
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
		}
	}
</script>
<style>
	view{display:block;}
	.uni-input-placeholder{padding-left: 20upx!important;}
	.search-box {width:95%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;position:sticky;top: 0;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:#409EFF;border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 110upx);padding-top:10upx;border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:80upx;margin:0 3%;font-size:30upx;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1upx #e7e7e7;}
	.keyword-entry image {width:60upx;height:60upx;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:80upx;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 110upx);border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:10upx 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:10upx 3%;font-size:27upx;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:40upx;height:40upx;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:28upx;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:60upx;padding:0 20upx;margin:10upx 20upx 10upx 0;height:60upx;font-size:28upx;background-color:rgb(242,242,242);color:#6b6b6b;}
</style>
