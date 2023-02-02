// pages/task/task.js
import {reqGet, reqPost} from '../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    not_read_count: 0,
    hasLogin: false,
    bindStatus: 0,
    filter: {
      type: 4,
      status: 1,
      // project_id: undefined,
      page: 1,
      limit: 15
    },
    statusFormat: ['待审批','所有状态','未开始', '进行中', '已完成', '待我审批'],
    statusFormat1: ['待审批','未开始', '进行中', '已完成', '待我审批'],
    taskList: [],
    countarr:0,
    taskListCount: 0,
    allTaskCount:0,
    editTypeDialog: false
  },
  tapAddType() {
    this.setData({
      editTypeDialog: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('task onLoad');
    await app.checkAuthSession()
    console.log(app.profile);
    this.setData({
      hasLogin: app.profile.hasLogin,
      bindStatus: app.profile.bindStatus
    })
  },
  getUserTaskMessageList() {
    reqPost('getUserTaskMessageList', {
      page: 1,
      limit: 1,
    }, true).then(({data}) => {
      this.setData({
        not_read_count: data.not_read_count
      })
    }).catch(res => {})
  },
  getTaskList(isConcat = false) {
    reqPost('taskList', this.data.filter, true).then(({data}) => {
      data.rows.forEach(item => {
        item.createDate = new Date(item.create_time*1000).format('M-dd h:m')
        item.priorityColor = item.priority>=4
      })
      if(isConcat) {
        this.setData({
          taskList: this.data.taskList.concat(data.rows),
          taskListCount: data.count,
          countarr:data.countarr,
          allTaskCount:data.allTaskCount
        })
      }else {
        this.setData({
          taskList: data.rows,
          taskListCount: data.count,
          countarr:data.countarr,
          allTaskCount:data.allTaskCount
        })
      }
    }).catch(res => {

    })
  },
  inputKeyword(e) {
    const {value} = e.detail
    
  },
  inputConfirm(e) {
    const {value} = e.detail
    this.setData({
      'filter.keywords': value
    })
    this.getTaskList()
  },
  tapTab(e) {
    const {idx} = e.currentTarget.dataset
    this.setData({
      'filter.page': 1,
      'filter.type': idx
    })
    this.getTaskList()
  },
  tapItem(e) {
    console.log(e);
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: './detail/detail?id='+id,
    })
  },
  tapStatus(e) {
    const {key} = e.currentTarget.dataset
    let status = this.data.filter.status
    if(this.data.statusFormat[status + key]) {
      this.setData({
        'filter.page': 1,
        'filter.status': status + key
      })
    }else {
      return false
    }
    this.getTaskList()
  },
  bind() {
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
  },
  login() {
    app.login(() => {
      this.setData({
        hasLogin: app.profile.hasLogin,
        bindStatus: app.profile.bindStatus
      })
      this.getTaskList()
    })
  },
  tapCreate(e) {
    wx.navigateTo({
      url: './edit/edit',
    })
    console.log(e);
  },
  
  tapNotice(e) {
    wx.navigateTo({
      url: './notice/notice',
    })
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
    if(app.profile.hasLogin && app.profile.bindStatus) {
      this.setData({
        'filter.page': 1
      })
      this.getTaskList()
      this.getUserTaskMessageList()
    }
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
    if(this.data.taskListCount>this.data.taskList.length) {
      this.data.filter.page++
      this.getTaskList(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})