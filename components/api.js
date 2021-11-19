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
	 * todo:获取请求参数
	 * @param {Object} name
	 */
	getQueryString(name) {
	    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    const search = window.location.hash.split('?')[1] || '';
	    const r = search.match(reg) || [];
	    return r[2];
	},
	/**
	   * todo:设置时间
	   * @param {Object} payload
	   */
	  setTime(payload) {
	    let date = new Date(payload.timestamp);
	    let Y = date.getFullYear();
	    let M = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
	    let D = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
	    let h = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
	    let m = (date.getMinutes()) < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	    let s = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
	    switch (payload.language) {
	      case 'en':
	        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
	      case 'ch':
	        return Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m + ':' + s;
	      case 'date':
	        return Y + '年' + M + '月' + D + '日';
	      case 'time' :
	        return h + ':' + m + ':' + s;
	    }
	},
	/**
	   * todo:滚动到底部
	   * @param selector
	   * @return {number}
	   */
	  scrollToBottom(selector) {
	    setTimeout(() => {
	      const domWrapper = document.querySelector(selector);
	      domWrapper.scrollTop = domWrapper.scrollHeight;
	    }, 10);
	  },
}