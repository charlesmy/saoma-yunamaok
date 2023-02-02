// pages/task/notice/notice.js
import {reqGet, reqPost, REALM, UPLOADURL, HEADER} from '../../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: {
      page: 1,
      limit: 15
    },
    list: []
  },
  tapItem(e) {
    const {item} = e.currentTarget.dataset
    reqPost('getUserTaskMessageInfo', {log_id: item.id}, true).then(res => {
      wx.navigateTo({
        url: '/pages/task/detail/detail?id='+item.task_id
      })
    }).catch(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserTaskMessageList()
  },
  getUserTaskMessageList() {
    reqPost('getUserTaskMessageList', this.data.filter, true).then(({data}) => {
      data.rows.forEach(item => {
        item.time = new Date(item.create_time*1000).format('yyyy/M/d hh:mm')
      })
      this.setData({
        count: data.count,
        not_read_count: data.not_read_count,
        list: this.data.list.concat(data.rows)
      })
    }).catch(res => {})
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
    if(this.data.count>this.data.list.length) {
      this.setData({
        'filter.page': this.data.filter.page + 1
      })
      this.getUserTaskMessageList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})