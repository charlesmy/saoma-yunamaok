import {REALM, reqPost} from "@/src/api";

/** @format */

// pages/person/person.js

const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasLogin: false,
        bindStatus: 0,
        roleID: 0,
        profile: null,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // const profile = app.profile
        // this.setData({
        //     profile,
        // })
    },
    changeBing() {
        wx.navigateTo({
            url: '/pages/bind/bind',
        })
    },
    editPassword(){
        wx.navigateTo({
            url: '/pages/person/edit/edit',
        })
    },
    login() {
        app.login(() => {
            this.setData({
                hasLogin: app.profile.hasLogin,
                bindStatus: app.profile.bindStatus,
                roleID: app.profile.roleID
            })
        })
    },
    bind() {
        wx.navigateTo({
            url: '/pages/bind/bind',
        })
    },
    getPersonUserInfo(profile) {
        if(profile){
            this.setData({
                hasLogin: app.profile.hasLogin,
                bindStatus: app.profile.bindStatus,
                roleID: app.profile.roleID
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const profile = app.profile
        this.getPersonUserInfo(profile)
        this.setData({
            profile,
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
})
