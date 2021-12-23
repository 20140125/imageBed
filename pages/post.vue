<template>
	<u-card title="工具集" :foot-border-top="false">
		<view slot="body">
			<u-form :model="authorized" label-position="top" label-width="140rpx">
				<u-form-item label="脚本列表">
					<u-input  :height="80" border @click="show = true" v-model="keywords"></u-input>
					<u-select v-model="show" :list="spliderList" @confirm="confirm"></u-select>
				</u-form-item>
				<u-form-item :label="item.label" v-for="(item,index) in spiderParams" :key="index">
					<u-input  :height="80" border v-model="item.value"></u-input>
					<u-button type="primary" plain style="margin-left: 10rpx;" @click="syncSpider({ keywords: item.value, method: item.name })">开始同步</u-button>
				</u-form-item>
				<u-form-item label="输出信息" v-if="spiderParams.length > 0">
					<div ref="message" class="messageLists">
						<div v-for="(item, index) in messageLists" :key="index">
							<div v-if="item.message.indexOf('already') > -1">
							<div class="message-time" v-html="item.time" style="color: #E6A23C"></div>
							<div class="client-content" v-html="item.message" style="color: #E6A23C"></div>
						</div>
						<div v-else>
							<div class="message-time" v-html="item.time"></div>
							<div class="client-content" v-html="item.message"></div>
						</div>
					  </div>
					</div>
				</u-form-item>
				<u-form-item label="IP定位">
					<u-input  :height="80" border :placeholder="authorized.ip_address"></u-input>
					<u-button type="primary" plain style="margin-left: 10rpx;">查询</u-button>
				</u-form-item>
				<u-form-item>
					<u-input  border type="textarea" :placeholder="authorized.city"></u-input>
				</u-form-item>
				<u-form-item label="天气查询">
					<u-input  :height="80" border :placeholder="authorized.city"></u-input>
					<u-button type="primary" plain style="margin-left: 10rpx;">查询</u-button>
				</u-form-item>
				<u-form-item>
					<u-input :height="300" border type="textarea" :placeholder="JSON.stringify(authorized.weather)"></u-input>
				</u-form-item>
			</u-form>
			<u-modal v-model="showOAuth" @confirm="confirmOAuth" content="授权登录" :show-title="false" @cancel="cancelOAuth" show-cancel-button></u-modal>
			<OAuthLogin ref="oauth"></OAuthLogin>
		</view>
	</u-card>
</template>

<script>
	import socketIo from '@/components/js_sdk/socket-io/weapp.socket.io.js'
	import OAuthLogin from '@/components/OAuthLogin.vue'
	import API from '@/components/api.js'
	export default {
		data() {
			return {
				show: false,
				showOAuth: false,
				spliderList: [],
				lists: [],
				keywords: '',
				spiderParams: [],
				messageLists: []
			}
		},
		computed: {
			authorized() {
				return this.$store.state.authorized
			}
		},
		components: {
			OAuthLogin
		},
		onShow() {
			if (this.$store.state.authorized.remember_token) {
				const socketService = socketIo(this.$store.state.authorized.socket, { transports: ['websocket'], autoConnect: true });
				/* todo:登录系统 */
				socketService.on('connect', () => {
					socketService.emit('login', this.$store.state.authorized.uuid);
				});
				/* todo:脚本通知 */
				socketService.on('web_command', (message) => {
					if (this.messageLists.length > 100) {
						this.messageLists = [];
					}
					this.messageLists.push({ time: API.setTime({ timestamp: Date.parse(new Date()), language: 'ch' }), message: message });
					API.scrollToBottom('.messageLists');
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
			}
		},
		mounted() {
			this.$nextTick(async () => {
				if (uni.getStorageSync('token')) {
					await this.getSplider();
				} else {
					this.showOAuth = true
				}
			});
		},
		methods: {
			/**
			 * todo:获取脚本记录
			 */
			async getSplider() {
				const response = await this.$u.api.getSplider();
				this.lists = response.lists || [];
				this.lists.forEach(item => {
					this.spliderList.push({
						label: item.name,
						value: item.value[0].name
					})
				});
			},
			/**
			 * todo:取消弹框
			 */
			cancelOAuth() {
				window.location.href="/"
			},
			/**
			 * todo：确认授权登录
			 */
			async confirmOAuth() {
				await this.$refs.oauth.getOauthConfig()
			},
			/**
			 * todo:设置脚本命令
			 * @param {Object} item
			 */
			confirm(item) {
				this.keywords = item[0].label;
				this.lists.forEach(item => {
					if (item.name === this.keywords) {
						this.spiderParams = item.value;
					}
				});
			},
			/**
			 * todo:执行脚本
			 * @param {Object} params
			 */
			async syncSpider(params) {
				await this.$u.api.runingSplider(params);
			}
		}
	}
</script>
<style lang="scss">
 .messageLists {
    background-color: #393d49;
    max-height: 300px;
    height: 300px;
    color: #FFFFFF;
    padding-left: 10px;
    overflow: auto;
	width: 100%;

    .message-time {
      color: #67C23A;
    }

    .client-content {
      margin-left: 10px;
      color: #67C23A;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-size: 14px;
    }
  }
</style>