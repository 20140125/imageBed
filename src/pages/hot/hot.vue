<template>
	<view style="width: 100%;">
		<view class="search-box">				
			<view class="input-box">
				<input type="text" :adjust-position="true" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword"
				 placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<button class="search-btn button" @tap="doSearch(keyword)">搜索</button>
		</view>
		
		<view class="search-keyword" v-show="showSearchBox">
			<scroll-view class="keyword-box" scroll-y>
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
							<image style="right: 25upx;" @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
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
				<view class="grid-c-06" v-for="(item, index) in list" :key="index" v-if="item.href">
					<view class="panel" @click="goDetail(item)">
						<image class="card-img card-list2-img" :src="item.href || ''" @longtap="download(item.href)"></image>
						<text class="card-num-view card-list2-num-view">{{item.width || ''}}{{item.width ? 'P' : ''}}</text>
						<view class="card-bottm row">
							<view class="car-title-view row">
								<rich-text class="card-title card-list2-title" :nodes="item.HighlightName"></rich-text>
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
	import func from '@/api/methods.js'
	export default {
		data() {
			return {
				defaultKeyword: "请输入关键词查询",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				forbid: '',
				showSearchBox: false,
				showImageItme: false,
				
				list: [],
				fetch: {pageNum: 1, pageLimit: 10, total: 1},
				id: 0,
				loadMore: 'more',
				token: '',
				source: 'app'
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline'],
			})
			this.source = 'mini_program'
			// #endif
			this.showImageItme = false
			this.showSearchBox = true
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			this.fetch.pageNum++
			if(this.keyword && this.showImageItme) {
				this.getData(this.keyword)
			}
		},
		onPullDownRefresh() {
			this.fetch.pageNum++
			if(this.keyword && this.showImageItme) {
				this.getData(this.keyword)
			}
		},
		methods: {
			/**
			 * todo:图片下载
			 * @param {String} href 
			 */
			download: function(href) {
				func.downloadFile(href)
			},
			/**
			 * todo:数据保存
			 * @param {Object} key
			 * @param {Object} value
			 */
			setStorage (key,value) {
				try {
					uni.setStorageSync(key, value)
				} catch (e) {
					console.log(e)
				}
			},
			init() {
				this.loadOldKeyword();
				uni.getStorage({
					key:'token',
					success: (res) => {
						this.loadHotKeyword(res.data);
					},
					fail: ()=> {
						this.loadHotKeyword();
					}
				})
			},
			/**
			 * todo:加载历史搜索,自动读取本地Storage
			 */
			loadOldKeyword() {
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
			 * @param token  
			 */
			loadHotKeyword(token = '') {
				uni.request({
					url: this.$serverUrl + '/v1/image/hotKeyWord',
					method:'POST',
					data:{ token: token },
					success: (res) => {
						this.hotKeywordList = res.data.item.lists;
					}
				});
			},
			/**
			 * todo：获取字节长度
			 * @param {Object} str
			 */
			getStrLength(str){
				let len = 0;
				for (let i=0; i<str.length; i++) {
					let c = str.charCodeAt(i);
					//单字节加1
					if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
						len++;
					} else {
						len+=2;
					}
				}
				return len;
			},
			/**
			 * todo:监听输入
			 * @param {Object} event
			 */
			inputChange(event) {
				var keyword = event.detail ? event.detail.value : ''
				if (!keyword) {
					this.showSearchBox = true
					this.showImageItme = false
					this.list = [];
					return;
				}
			},
			/**
			 * todo:高亮关键字
			 * @param {Object} keywords
			 * @param {Object} keyword
			 */
			drawCorrelativeKeyword(keywords, keyword) {
				keywords.map(item=>{
					item.HighlightName = item.name.replace(keyword,'<span style="color:#409EFF">'+keyword+'</span>')
				})
				return keywords;
			},
			/**
			 * todo:顶置关键字
			 * @param {Object} item
			 */
			setKeyword(item) {
				this.keyword = item.name;
			},
			/**
			 * 清除历史搜索
			 */
			oldDelete() {
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
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			/**
			 * todo:执行搜索
			 * @param {Object} keyword
			 */
			doSearch(item) {
				this.keyword = item.name ? item.name : item
				if(!this.keyword || this.keyword === '') {
					uni.showToast({
						title: '输入关键词查询',
						icon: 'none',
						duration: 2000
					});
					this.list = [];
					this.showImageItme = false
					this.showSearchBox = true
					return false
				}
				this.saveKeyword(this.keyword); //保存为历史 
				uni.showToast({
					title: this.keyword,
					icon: 'none',
					duration: 2000
				});
				this.fetch.pageNum = 1
				this.list = []
				uni.setNavigationBarTitle({title: '热搜 -- '+this.keyword})
				this.showImageItme = true
				this.showSearchBox = false
				this.getData(this.keyword)
			},
			/**
			 * todo:保存关键字到历史记录
			 * @param {Object} keyword
			 */
			saveKeyword(keyword) {
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
			getData(keyword) {
				this.loadMore = 'loading'
				if(this.fetch.total === this.list.length) {
					this.loadMore = 'noMore'
					return false
				}
				uni.getStorage({
					key:'token',
					success: (res) => {
						this.imageBed(res.data, keyword, this.source)
					},
					fail: ()=> {
						this.imageBed('', keyword, this.source)
					}
				})
			},
			/**
			 * todo：图床列表
			 * @param {Object} token
			 * @param {Object} id
			 * @param {Object} source 
			 */
			imageBed(token,keyword,source) {
				uni.request({
					url: this.$serverUrl + '/v1/image/hotLists',
					method: 'POST',
					data: {
						page: this.fetch.pageNum,
						limit: this.fetch.pageLimit,
						name: keyword,
						token: token,
						source: source
					},
					success: (ret) => {
						if (ret.data.item.code === 20000) {
							uni.stopPullDownRefresh()
							this.fetch.total = ret.data.item.lists.total
							this.loadMore = this.fetch.total === 0 ? 'noMore' :  'more'
							this.list = Array.from(new Set(this.list.concat(this.drawCorrelativeKeyword(ret.data.item.lists.data,keyword))));
						} else {
							uni.clearStorage()
							uni.showModal({
							    title: '提示',
							    content: '授权登录',
							    success: (res) => {
							        if (res.confirm) {
							            this.loginSystem()
							        } else if (res.cancel) {
							           uni.showToast({ title: 'Please Login', icon: 'success' })
							        }
							    }
							})
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
			goDetail(e) {
				e.img_num = this.fetch.total
				uni.navigateTo({
					url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				})
			},
			/**
			 * todo:授权登录
			 */
			loginSystem() {
				func.loginSystem()
			},
		}
	}
</script>
<style>
	view{display:block}
	
</style>
