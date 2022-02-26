<template>
	<view>
		<u-card title="热门搜索" :foot-border-top="false">
			<view slot="body">
				<u-form-item>
					<u-search v-model="name" height="80" clearabled input-align="center" :show-action="false" @search="doSearch"></u-search>
				</u-form-item>
				<view class="hot-keywords">
					<view v-if="oldKeywordList.length > 0">历史搜索
						<u-icon @click="oldDelete" name="trash-fill" size="30"></u-icon>
					</view>
					<u-tag v-for="(item, index) in oldKeywordList" @click="doSearch(item)" type="warning" mode="plain" size="mini" :text="item" :key="index"></u-tag>
				</view>
				<view class="hot-keywords">
					<view>热门搜索
						<u-icon @click="hotToggle" :name="eyeName" size="40"></u-icon>
					</view>
					<u-tag v-if="togger" size="mini" type="warning" mode="plain" v-for="(item, index) in hotKeyWords" @click="doSearch(item)" :text="item" :key="index"></u-tag>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hotKeyWords: [],
				name: '',
				eyeName: 'eye-fill',
				togger: true,
				oldKeywordList: []
			}
		},
		onShow() {
			this.loadOldKeyword()
		},
		mounted() {
			this.$nextTick(async () =>{
				await this.getHotKeyWords()
			})
		},
		methods: {
			/**
			 * todo:获取热搜词
			 */
			async getHotKeyWords() {
				let response = await this.$u.api.getConfiguration({ keyword: 'HotKeyWord' });
				this.hotKeyWords = response.lists || [];
			},
			/**
			 * todo:关键词搜索
			 * @param {Object} item
			 */
			doSearch(item) {
				this.$router.push({ path: `/pages/index?name=${encodeURIComponent(item)}` })
				this.saveKeyword(item ? item : this.name)
			},
			/**
			 * todo:加载历史搜索,自动读取本地Storage
			 */
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						const OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
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
			 * todo:热门搜索切换
			 */
			hotToggle() {
				this.togger = !this.togger;
				this.eyeName = !this.togger ? 'eye-off' : 'eye-fill';
			}
		}
	}
</script>

<style scoped lang="scss">
.u-icon {
	float: right;
}
.u-card {
	min-height: 600px;
}
.u-row-between {
	justify-content:center;
}
.hot-keywords {
	margin: 60rpx 0;
	font-size: 12px;
	color: #606266;
}
.hot-keywords > view {
	margin-top: 20rpx;
}
</style>
