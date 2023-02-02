// pages/bind/bind.js
import {reqGet, reqPost} from '../../api/index'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      code: '',
      mimo_username: '',
      password: ''
    }
  },
  cancel() {
    wx.navigateBack()
  },
  submit() {
    wx.login({
      success: ({code}) => {
        this.data.form.code = code
        reqPost('bindMimoAccount', this.data.form).then(res => {
          app.code2Login2(() => {
            wx.reLaunch({
              url: '/pages/task/task',
            })
          })
          wx.showToast({
            title: '绑定成功',
            mask: true
          })
        }).catch(res => {

        })
      }
    })
    
  },
  handleInput(e) {
    const {value} = e.detail
    const {key} = e.currentTarget.dataset
    this.setData({
      ['form.' + key]: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})