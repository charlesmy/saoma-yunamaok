// pages/project/edit/edit.js
import {reqGet, reqPost} from '../../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: '',
      remark: '',
      review_id: '',
      manager_ids: '',
      user_ids: '',
      starttime: '',
      endtime: '',
    },
    taskUser: [{"nick":"超级管理员","id":1},{"nick":"贺小虎","id":3},{"nick":"李杨","id":4},{"nick":"BOSS","id":5},{"nick":"成青青","id":6},{"nick":"熊进敏","id":7},{"nick":"刘树鹏","id":8},{"nick":"江豪","id":9},{"nick":"江培浩","id":10},{"nick":"林夏洁","id":11},{"nick":"潘琳琳","id":12},{"nick":"邓昆明","id":13},{"nick":"崔香梅","id":14},{"nick":"黄林强","id":15},{"nick":"覃杏枝","id":23},{"nick":"覃杏周","id":24},{"nick":"江潘盛","id":28},{"nick":"陈红梅","id":29},{"nick":"杜晓倩","id":30},{"nick":"陈洁红","id":31},{"nick":"郭昌鑫","id":32},{"nick":"谷孝辉","id":33},{"nick":"青井光","id":34},{"nick":"万义荣","id":35},{"nick":"何根英","id":36},{"nick":"杨国英","id":37},{"nick":"张潮喜","id":39},{"nick":"袁香生","id":40},{"nick":"巫宗煌","id":46},{"nick":"李人万","id":47},{"nick":"雷能文","id":49},{"nick":"付伟","id":50},{"nick":"黄雪梅","id":52},{"nick":"杨飞燕","id":53},{"nick":"king","id":54},{"nick":"朱纪慧","id":58},{"nick":"李华盛龙华","id":60},{"nick":"周作兵周孚明","id":62},{"nick":"杨军","id":63},{"nick":"邓明鹏王历洪","id":64},{"nick":"温标其练优胜","id":66},{"nick":"高功亮陈竞成","id":68},{"nick":"梁志明","id":71},{"nick":"谢丽燕","id":73},{"nick":"余海龙","id":74},{"nick":"吴剑清","id":75},{"nick":"吴名根","id":76},{"nick":"赵显国","id":80},{"nick":"阳涛","id":81},{"nick":"刘云龙","id":82},{"nick":"韦树圣","id":83},{"nick":"李剑讲","id":84},{"nick":"覃朝旭","id":85},{"nick":"江明全","id":86},{"nick":"贺小华","id":87},{"nick":"覃汉亮","id":88},{"nick":"谷孝根","id":89},{"nick":"向丹","id":90},{"nick":"周芳","id":91}],
    taskUserIdx: -1,
    managerUserNicks: '',
    isShowUserPicker: false,
    jieduan: 0,
  },
  tapJieduan(e) {
    const {value} = e.currentTarget.dataset
    if(value==1) {
      this.setData({
        jieduan: Number(value),
        'form.endtime': ''
      })
    }else {
      this.setData({
        jieduan: Number(value)
      })
    }
  },
  ManagerPickerChange(e) {
    const {value} = e.detail
    if(value<0) return
    this.data.form.manager_ids = this.data.taskUser[Number(value)].id
    this.setData({
      managerUserIdx: Number(value)
    })
  },
  ReviewPickerChange(e) {
    const {value} = e.detail
    if(value<0) return
    this.data.form.review_id = String(this.data.taskUser[Number(value)].id)
    this.setData({
      taskUserIdx: Number(value)
    })
  },
  submit() {
    reqPost('projectAdd', this.data.form, '提交中').then(({data}) => {
      if(data.projectid) {
        wx.showToast({
          title: '新建项目成功',
          icon: 'success',
          duration: 1250,
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 1250)
          }
        })
      }
    }).catch(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.projectid) {
      this.setData({
        'form.projectid': options.projectid
      })
      
      wx.setNavigationBarTitle({
        title: '编辑项目',
      })
    }else {
      wx.setNavigationBarTitle({
        title: '新建项目',
      })
    }
    this.getTaskUsers()
    this.setData({
      'form.starttime': new Date().format('yyyy-MM-dd')
    })
  },
  getTaskUsers() {
    reqPost('getTaskUsers').then(({data}) => {
      this.setData({
        taskUser: data
      })
    }).catch(res => {})
  },
  tapUserPicker() {
    this.setData({
      isShowUserPicker: true
    })
  },
  userPickerCancel(e) {this.setData({isShowUserPicker: false})},
  userPickerConfirm(e) {
    console.log(e);
    let manager_ids = e.detail
    if(!manager_ids) {
      this.setData({
        managerUserNicks: '',
        'form.manager_ids': '',
        isShowUserPicker: false
      })
    }
    let managerUserNicks = manager_ids.split(',').map(id => {
      return this.data.taskUser.find(user => user.id==id).nick
    })
    managerUserNicks = managerUserNicks.join(',')
    this.setData({
      managerUserNicks: managerUserNicks,
      'form.manager_ids': manager_ids,
      isShowUserPicker: false
    })
  },
  bindPickerChange(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      idx: Number(value)
    })
  },
  bindchangeDateEndTime(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.endtime': value
    })
  },
  bindchangeDate(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.starttime': value
    })
  },
  inputName(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.name': value
    })
  },
  inputRemark(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.remark': value
    })
  },
  cancel() {
    wx.navigateBack()
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