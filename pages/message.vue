<template>
	<u-card :foot-border-top="false" class="chat">
		<view slot="head">
			<u-badge :offset="[95, 565]" absolute isDot :type="users.post_online ? 'success' : 'info'"></u-badge>
			<u-avatar class="image" :size="80" :src="users.post_img"></u-avatar>
			<span class="username">{{users.post_name}}</span>
		</view>
		<view slot="body">
			<u-form>
				<u-form-item>
					<div ref="message" class="messageLists">
						<div v-for="(item, index) in messageLists" :key="index">
							<div class="userinfo">
								<u-avatar class="client-img" :src="item.client_img" :size="30"></u-avatar>
								<span class="from-client-name" v-html="item.from_client_name"></span>
								<span class="message-time" v-html="item.time"></span>
							</div>
							<div class="client-content" v-html="replaceContent(item.content)"></div>
						</div>
					</div>
				</u-form-item>
				<u-form-item>
					<u-icon name='photo' :size="50" color="#393d49"></u-icon>
					<u-icon name='camera-fill' :size="50" color="#393d49"></u-icon>
				</u-form-item>
				<u-form-item>
					<div contentEditable="true" ref="message" class="input-content"></div>
				</u-form-item>
			</u-form>
		</view>
		<view slot="foot">
			<div class="input-button">
				<u-button type="success" size="medium" plain shape="circle">发送</u-button>
			</div>
		</view>
	</u-card>
</template>

<script>
	export default {
		data() {
			return {
				messageLists: []
			}
		},
		computed: {
			authorized() {
				return this.$store.state.authorized || []
			},
			users() {
				return this.$route.query.users ? JSON.parse(decodeURIComponent(this.$route.query.users)) : []
			},
		},
		watch: {
			$route() {
				uni.setNavigationBarTitle({
					title: (this.users || {}).post_name || '魔盒逗图-联系人'
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				uni.setNavigationBarTitle({
					title: (this.users || {}).post_name || '魔盒逗图-联系人'
				})
			})
		},
		methods: {
			/**
			 * todo:字符串替换
			 */
			replaceContent(content) {
				return content.replace(new RegExp(/&lt;/g), '<').replace(new RegExp(/&gt;/g), '>').replace(new RegExp(
					/&quot;/g), '"');
			},
		}
	}
</script>

<style>
	.u-card {
		background-color: #f9f9f9 !important;
	}

	.image {
		margin-left: 20rpx;
	}

	.username {
		position: absolute;
		margin-top: 30rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		font-family: "新宋体", serif;
	}

	.userinfo {
		display: flex;
		align-items: center;
		position: relative;
		margin: 15px 0;
	}

	.client-img {
		margin-left: 10px;
		text-align: left;
	}

	.from-client-name {
		margin-left: 10px;
	}

	.message-time {
		margin-left: 15px;
		font-size: 12px;
	}

	.client-content {
		margin-left: 20px;
		line-height: 30px;
		font-size: 14px;
	}

	.messageLists {
		border: 2rpx solid #eee;
		height: 550rpx;
		padding: 20rpx;
		overflow: scroll;
		overflow-x: hidden;
		margin-bottom: 20rpx;
		width: 100%;
	}

	.input-content {
		border: 2rpx solid #585252;
		height: 150rpx;
		padding: 15rpx;
		width: 100%;
		overflow: scroll;
		overflow-x: hidden;
		font-size: 28rpx;
		font-family: "新宋体", serif;
	}

	.input-button {
		float: right;
		margin-top: -40rpx;
		margin-bottom: 30rpx;
	}
</style>
