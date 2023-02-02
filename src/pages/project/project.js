// pages/project/project.js
import {reqGet, reqPost, REALM, UPLOADURL, HEADER} from '../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    bindStatus: 0,
    filter: {
      keyword: '',
      page: 1,
      limit: 15
    },
    projectList: [],
    projectListCount: 0,
    statusFormat: ['删除', '未开始', '进行中', '已完结'] //项目状态 0删除，1未开始，2进行中，3已完结
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('project onLoad');
    // await app.checkAuthSession()
    // console.log(app.profile);
    // this.setData({
    //   hasLogin: app.profile.hasLogin,
    //   bindStatus: app.profile.bindStatus
    // })
  },
  inputKeyword(e) {
    const {value} = e.detail
    
  },
  inputConfirm(e) {
    const {value} = e.detail
    this.setData({
      'filter.keyword': value
    })
    this.getProjectList()
  },
  getProjectList() {
    reqPost('projectList', this.data.filter, true).then(({data}) => {
      if(data.rows) {
        data.rows.forEach(item => {
          item.members_pic = REALM + item.members_pic
          item.start_time = new Date(item.start_time*1000).format('yyyy/M/d')
          if(item.end_time) {
            item.end_time = new Date(item.end_time*1000).format('yyyy/M/d')
          }
        })
        this.setData({
          projectList: data.rows,
          projectListCount: data.count
        })
      }else {
        this.setData({
          projectList: [],
          projectListCount: 0
        })
      }
    }).catch(res => {})
  },
  tapItem(e) {
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: './detail/detail?id=' + id,
    })
  },
  tapCreate() {
    wx.navigateTo({
      url: './edit/edit',
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
      this.getProjectList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})