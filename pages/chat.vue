<template>
	<u-card :foot-border-top="false" class="chat" title="联系人" :sub-title="authorized.now_time">
		<view slot="body">
			<u-index-list :indexList="indexLists" :scrollTop="scrollTop">
				<div v-for="(item, itemIndex) in usersLists" :key="itemIndex">
					<u-index-anchor :index="indexLists[itemIndex]"></u-index-anchor>
					<div v-for="(user, userIndex) in item" :key="userIndex">
						<div class="content" @click="getUser(user)">
							<u-avatar :src="user.client_img" :size="80"></u-avatar>
							<span v-html="`${user.online ? '[在线]' : '[离线]'}`" class="state"
								:style="`${user.online ? 'color: #2979FF' : 'color: #9d9a9a'}`"></span>
							<span v-html="user.client_name" class="username"
								:style="`${user.online ? 'color: #2979FF' : 'color: #9d9a9a'}`"></span>
							<span v-html="(user.centerInfo || {}).desc || ''" class="desc"></span>
							<u-line></u-line>
						</div>
					</div>
				</div>
			</u-index-list>
		</view>
	</u-card>
</template>

<script>
	import API from '@/components/api.js'
	export default {
		data() {
			return {
				usersLists: [],
				indexLists: [],
				scrollTop: 0
			}
		},
		computed: {
			authorized() {
				return this.$store.state.authorized
			},
		},
		onShow() {
			if (this.$store.state.authorized.remember_token) {
				this.getConnection(this.$store.state.authorized.websocket);
			}
		},
		methods: {
			/**
			 * todo:长链接
			 * @param {Object} webSocketServer
			 */
			getConnection(websocket) {
				const webSocketServer = new WebSocket(websocket);
				// 监听打开事件
				webSocketServer.addEventListener('open', () => {
					const jsonStr = {
						type: 'login',
						from_client_id: this.$store.state.authorized.uuid,
						client_name: this.$store.state.authorized.username,
						room_id: this.$store.state.authorized.room_id,
						client_img: this.$store.state.authorized.avatar_url,
						uuid: this.$store.state.authorized.uuid
					};
					webSocketServer.send(JSON.stringify(jsonStr));
				});
				// 监听发送消息事件
				webSocketServer.addEventListener('message', (events) => {
					const message = JSON.parse(events.data);
					switch (message.type) {
						case 'ping':
							webSocketServer.send('{"type":"pong"}');
							break;
						case 'login':
							// 用户列表
							const clientLists = (message || {}).client_lists || [];
							this.indexLists = [];
							for (let i in clientLists) {
								if (this.indexLists.indexOf(clientLists[i].char) < 0) {
									this.indexLists.push(clientLists[i].char);
								}
							}
							this.indexLists.sort();
							this.usersLists = []
							for (let j in this.indexLists) {
								const item = [];
								for (let k in clientLists) {
									if (this.indexLists[j] === clientLists[k].char) {
										item.push(clientLists[k])
									}
								}
								this.usersLists[j] = item
							}
							break;
					}
				});
				webSocketServer.addEventListener('close', () => {
					console.error('链接被关闭')
				});
				webSocketServer.addEventListener('error', () => {
					console.error('链接异常')
				});
			},
			/**
			 * todo:设置高亮
			 * @param {Object} e
			 */
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			/**
			 * todo:获取用户信息
			 * @param {Object} item
			 */
			getUser(item) {
				const users = {
					post_name: item.client_name,
					post_img: item.client_img,
					post_uuid: item.uuid,
					post_type: item.type,
					post_online: item.online,
					now_time: this.authorized.now_time
				}
				this.$router.push({
					path: '/pages/message',
					query: {
						users: encodeURIComponent(JSON.stringify(users))
					}
				})
			},
			/**
			 * todo:下拉刷新
			 */
			onPullDownRefresh() {
				if (this.$store.state.authorized.remember_token) {
					this.getConnection(this.$store.state.authorized.websocket);
				}
			},
		}
	}
</script>

<style>
	.chat {
		background-color: #f9f9f9;
	}

	.u-line {
		margin-top: 10px !important;
	}

	.content {
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.state {
		margin-left: 15px;
		position: absolute;
		margin-top: 8px;
		font-size: 10px;
	}

	.username {
		margin-left: 50px;
		position: absolute;
		margin-top: 7px;
	}

	.desc {
		margin-left: 15px;
		position: relative;
		margin-top: 8px;
		color: #9d9a9a;
		font-size: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
