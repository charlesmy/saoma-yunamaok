/** @format */

const config = {
    release: false,
}
// const REALM = config.release ? 'https://www.020mimo.com' : 'http://mimo.cc'
const REALM = config.release ? 'https://www.020mimo.com' : 'http://www.mimo-pro.com'
const URL = config.release
    ? 'https://www.020mimo.com/wechat.php/miniprogram/TaskApi/'
    : 'http://www.mimo-pro.com/wechat.php/miniprogram/TaskApi/'
// const URL = config.release
//     ? 'https://www.020mimo.com/wechat.php/miniprogram/TaskApi/'
//     : 'http://mimo.cc/wechat.php/miniprogram/TaskApi/'
const HEADER = {
    'content-type': 'application/json', // 默认值
    // 'authSession': 'b5d886dc6400b1fb8d07f6c82bc02463',
}

const UPLOADURL = URL + 'annexUpload'

const reqGet = () => {}

let curLoadingCount = 0
const reqPost = (path = '', data = {}, showLoading = false) => {
    if (showLoading) {
        if (curLoadingCount < 1) {
            curLoadingCount++
            wx.showLoading({
                title: typeof showLoading == 'string' ? showLoading : '加载中',
                mask: true,
            })
        } else {
            curLoadingCount++
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'POST',
            url: URL + path,
            data,
            header: HEADER,
            success: res => {
                console.log(path, res.data)
                if (res.data.code == 200) {
                    resolve(res.data)
                } else {
                    if (res.data.code == 403 || res.data.code == 401) {
                        wx.showModal({
                            title: '错误',
                            content: res.data.msg,
                            confirmText: '好的',
                            showCancel: false,
                        })
                    }
                    reject(res.data)
                }
                if (curLoadingCount <= 1) {
                    wx.hideLoading()
                    curLoadingCount = 0
                } else {
                    curLoadingCount--
                }
            },
            fail: res => {
                console.error(path, res.data)
                wx.showModal({
                    title: '错误',
                    content: res.data.msg,
                    confirmText: '好的',
                    showCancel: false,
                })
                reject(res.data)
                wx.hideLoading()
                curLoadingCount = 0
            },
        })
    })
}

module.exports = {
    reqGet,
    reqPost,
    HEADER,
    URL,
    UPLOADURL,
    REALM,
}
