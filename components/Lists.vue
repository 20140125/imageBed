<template>
	<view class="grid">
		<view class="grid-c-06" v-for="(item, index) in imageLists" :key="index" v-if="item.href">
			<view class="panel" @click="goDetail(item)">
				<image class="card-img card-list2-img" :src="item.href || ''" referrerpolicy="no-referrer"></image>
				<text class="card-num-view card-list2-num-view">{{item.width || ''}}{{item.width ? 'P' : ''}}</text>
				<view class="card-bottm row">
					<view class="car-title-view row">
						<rich-text class="card-title card-list2-title" :nodes="item.name"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="show" @confirm="confirm" :content="content" :show-title="false" show-cancel-button></u-modal>
		<OAuthLogin ref="oauth"></OAuthLogin>
	</view>
</template>

<script>
	import API from '@/components/api.js'
	import OAuthLogin from '@/components/OAuthLogin.vue'
	export default {
		name: 'Lists',
		props: {
			payload: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				imageLists: [],
				show: false,
				content: '授权登录'
			};
		},
		mounted() {
			this.$nextTick(async () => {
				if (!this.payload.search) {
					await this.getNewImage(this.payload);
				}
			})
		},
		watch: {
			async $route() {
				this.payload.page = 1;
				this.payload.name = this.$route.query.name || ''
				await this.getNewImage(this.payload);
			}
		},
		components: {
			OAuthLogin
		},
		methods: {
			/**
			 * todo:获取图片列表
			 * @param {Object} payload
			 */
			async getNewImage(payload) {
				let response = await this.$u.api.getNewImage(payload);
				if (response.code !== 20000) {
					this.show = true;
					return false;
				}
				/* 刷新页面数据 */
				if (payload.refresh) {
					this.imageLists = []
				}
				let data = (response.lists || {}).data || []
				this.imageLists = Array.from(new Set(this.imageLists.concat(this.drawCorrelativeKeyword(data, payload.name))));
				this.payload.total =  (response.lists || {}).total || 0;
				this.$emit('setPayload', this.payload);
			},
			/**
			 * todo:高亮关键字
			 * @param {Object} keywords
			 * @param {Object} keyword
			 */
			drawCorrelativeKeyword(keywords, keyword) {
				keywords.forEach(item => {
					item.name = item.name.replace(keyword, '<span style="color:#409EFF">' + keyword + '</span>')
				})
				return keywords;
			},
			/**
			 * todo：确认授权登录
			 */
			async confirm() {
				await this.$refs.oauth.getOauthConfig()
			},
			/**
			 * todo:查看图片
			 * @param {Object} e
			 */
			goDetail(e) {
				window.open(e.href, '__target')
			}
		}
	}
</script>

<style lang="scss">

</style>
