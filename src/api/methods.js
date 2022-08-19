export default {
    /**
     * todo:下载图片
     * @param {Object} href
     */
    downloadFile(href) {
        uni.downloadFile({
            url: href,
            success: (e) => {
                uni.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: () => {
                        uni.showToast({ icon: 'success', title: '已保存到手机相册' })
                    },
                    fail: () => {
                        uni.showModal({
                            content: '检测到您没打开获取信息功能权限，是否去设置打开？',
                            confirmText: "确认",
                            cancelText: '取消',
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openSetting({
                                        success: (res) => {
                                            uni.showToast({ title: "请重新点击分享保存图片～", icon: "none" })
                                        }
                                    })
                                } else {
                                    uni.showToast({ title: "保存失败，请打开权限功能重试", icon: "none" })
                                }
                            }
                        })
                    }
                })
            },
            fail: (e) => {
                uni.showModal({ content: '图片保存失败', showCancel: false })
            }
        })
    },
    /**
     * todo:数据保存
     * @param {Object} key
     * @param {Object} value
     */
    setStorage(key, value) {
        try {
            uni.setStorageSync(key, value)
        } catch (e) {
            console.log(e)
        }
    },
    /**
     * todo:登录系统
     */
    async loginSystem() {
        let userInfo = {}
        await uni.getUserProfile({
            desc: '用于完善会员资料',
            provider: 'weixin',
            success: (infoRes) => {
                userInfo = infoRes.userInfo
                uni.login({
                    provider: 'weixin',
                    success: (loginRes) => {
                        uni.request({
                            url: 'https://api.fanglonger.com/api/v1/mini_program/openid',
                            method: 'POST',
                            data: {code: loginRes.code},
                            success: (ret) => {
								console.log(ret);
                                userInfo.code2Session = ret.data.item.lists
                                uni.request({
                                    url: 'https://api.fanglonger.com/api/v1/mini_program/login',
                                    method: 'POST',
                                    data: userInfo,
                                    success: (login) => {
                                        this.setStorage('token', login.data.item.lists.remember_token)
                                        this.setStorage('image', login.data.item.lists.avatar_url)
                                        uni.showToast({ title: 'Successfully', icon: 'success' })
                                    },
                                })
                            },
                            fail: () => {
                                uni.showModal({ content: '请求失败，请稍后重试!', showCancel: false })
                            }
                        })
                    },
                    fail: () => {
                        uni.showModal({ content: '请求失败，请稍后重试!', showCancel: false })
                    }
                })
            }
        })
    }
}
