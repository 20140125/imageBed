<template>
	<view class="index">
		<u-notice-bar mode="vertical" type="error" :list="noticList"></u-notice-bar>
		<lists ref="lists" :payload="payload" @setPayload="setPayload"></lists>
		<u-loadmore :status="status" icon-type="flower" :load-text="loadText"></u-loadmore>
		<ButtomBar></ButtomBar>
	</view>
</template>

<script>
	import socketIo from '@/components/js_sdk/socket-io/weapp.socket.io.js'
	import Lists from '@/components/Lists.vue'
	import API from '@/components/api.js'
	import ButtomBar from '@/components/ButtomBar.vue'
	export default {
		data() {
			return {
				status: 'loadmore',
				loadText: {
					loadmore: '加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的~'
				},
				noticList: [],
				payload: { page: 1, limit: 10, source: 'h5', total: 0, name: '', refresh: false },
				pages: 0
			};
		},
		components: {
			Lists,
			ButtomBar
		},
		async onShow() {
			if (this.$store.state.authorized.remember_token) {
				const socketService = socketIo(this.$store.state.authorized.socket, { transports: ['websocket'], autoConnect: true });
				/* todo:登录系统 */
				socketService.on('connect', () => {
					socketService.emit('login', this.$store.state.authorized.uuid);
				});
				/* todo:系统通知 */
				socketService.on('new_message', (message) => {
					this.noticList.push(message)
				})
				/* todo:链接断开 */
				socketService.on('disconnect', ($error) => {
					console.info(`【系统断开】${JSON.stringify($error)}`);
				});
				/* todo:链接错误 */
				socketService.on('connect_error', ($error) => {
					console.error(`【系统链接错误】${JSON.stringify($error)}`);
				});
				/* todo:链接关闭 */
				socketService.on('close', ($error) => {
					console.error(`【链接关闭】${JSON.stringify($error)}`);
				});
				/* 搜索进入 */
				this.payload.refresh = true;
				this.payload.name = API.getQueryString('name') ? decodeURIComponent(API.getQueryString('name')) : '';
				if(this.payload.name) {
					await this.$refs.lists.getNewImage(this.payload);
				}
			}
		},
		mounted() {
			this.$nextTick(async () => {
				if (API.getQueryString('token')) {
					uni.setStorageSync('token', decodeURIComponent(API.getQueryString('token')))
					setTimeout(() => {
						window.location.href = 'https://www.fanglonger.com'
					}, 200)
				}
				await this.getConfiguration();
			})
		},
		methods: {
			/**
			 * todo:设置参数
			 * @param {Object} payload
			 */
			setPayload(payload) {
				this.pages = Math.ceil(payload.total / payload.limit);
			},
			/**
			 * todo:获取站内通知
			 */
			async getConfiguration() {
				let response = await this.$u.api.getConfiguration({ keywords: 'NOTICE' });
				this.noticList = response.lists || []
			},
			/**
			 * todo:触底刷新
			 */
			async onReachBottom() {
				this.status = 'loading';
				this.payload.page += 1;
				this.payload.refresh = false;
				if (this.payload.page <= this.pages) {
					await this.$refs.lists.getNewImage(this.payload);
				} else {
					this.status = 'nomore'
				}
			}
		}
	}
</script>

<style>
</style>
