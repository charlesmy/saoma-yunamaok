/** @format */

import Taro, {useLaunch} from '@tarojs/taro'
import {reqPost, HEADER} from '../api/index'

export function useAdaptNative() {
    Date.prototype.format = function (fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds(), //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        return fmt
    }

    useLaunch(() => {
        const app = Taro.getApp()

        app['profile'] = {
            authSession: '',
            bindStatus: 0,
            encryptedData: '',
            iv: '',
            userInfo: null,
            userProfile: null,
            hasLogin: false,
        }

        app.checkAuthAlter = function (admin_id) {
            return admin_id == this.profile.userInfo.admin_id
        }

        app.code2Login2 = function (callback) {
            wx.login({
                success: ({code}) => {
                    reqPost(
                        'autoLogin',
                        {
                            code,
                        },
                        '登录中',
                    )
                        .then(({data}) => {
                            this.profile.authSession = data.authSession
                            HEADER.authSession = data.authSession
                            this.profile.bindStatus = data.bindStatus
                            this.profile.userInfo = data.userInfo
                            this.profile.hasLogin = true
                            wx.setStorageSync('profile', this.profile)
                            callback && callback()
                        })
                        .catch(res => {})
                },
            })
        }

        app.code2Login = function (callback) {
            wx.login({
                success: ({code}) => {
                    reqPost(
                        'autoLogin',
                        {
                            code,
                            encryptedData: this.profile.encryptedData,
                            iv: this.profile.iv,
                        },
                        '登录中',
                    )
                        .then(({data}) => {
                            this.profile.authSession = data.authSession
                            HEADER.authSession = data.authSession
                            this.profile.bindStatus = data.bindStatus
                            this.profile.userInfo = data.userInfo
                            this.profile.hasLogin = true
                            wx.setStorageSync('profile', this.profile)
                            callback && callback()
                        })
                        .catch(res => {})
                },
            })
        }

        app.login = function (callback = false) {
            wx.getUserProfile({
                desc: '用于用户登录',
                success: res => {
                    console.log(res)
                    this.profile.userProfile = res.userInfo
                    this.profile.encryptedData = res.encryptedData
                    this.profile.iv = res.iv
                    wx.login({
                        success: ({code}) => {
                            reqPost(
                                'autoLogin',
                                {
                                    code,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv,
                                },
                                '登录中',
                            )
                                .then(({data}) => {
                                    this.profile.authSession = data.authSession
                                    HEADER.authSession = data.authSession
                                    this.profile.bindStatus = data.bindStatus
                                    this.profile.userInfo = data.userInfo
                                    this.profile.hasLogin = true
                                    wx.setStorageSync('profile', this.profile)
                                    // wx.showToast({title: '登录成功'})
                                    callback && callback()
                                })
                                .catch(res => {})
                                .finally(() => {
                                    wx.hideLoading()
                                })
                        },
                    })
                },
                fail: res => {
                    console.log('拒绝授权', res)
                },
            })
        }

        /*
         * 本地缓存没有authSeesion的情况
         *  @return {boolean} 是否登录状态
         */
        app.checkAuthSession = async function () {
            const profile = wx.getStorageSync('profile')
            if (!profile) return false
            const {authSession} = profile
            if (!authSession) {
                delete HEADER.authSession
                wx.clearStorageSync('profile')
                return false
            }
            this.profile = profile
            HEADER.authSession = authSession
            return await reqPost('userinfo', {}, '登录中')
                .then(({data}) => {
                    this.profile.userInfo = profile.userInfo = data
                    this.profile.hasLogin = profile.hasLogin = true
                    wx.setStorageSync('profile', profile)
                    return true
                })
                .catch(res => {
                    delete HEADER.authSession
                    wx.clearStorageSync('profile')
                    this.profile.hasLogin = false
                    return false
                })
        }
    })
}
