// pages/project/detail/detail.js
import {reqGet, reqPost} from '../../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    tabIdx: 0,
    arr: ['按日期排序', '按开始时间排序', '按截至日期排序'],
    idx: 0,
    taskFilter: {
      project_id: '',
      page: 1,
      limit: 15
    },
    statusFormat: ['待审批', '未开始', '进行中', '已完成'],
    statusFormat1: ['待审批','未开始', '进行中', '已完成', '待我审批'],
    taskList: [],
    taskListCount: 0,
    logList: [],
    projectInfo: {},
    // 
    form: {
      projectid: '',
      name: '',
      remark: '',
      review_id: '',
      manager_ids: '',
      user_ids: '',
      starttime: '',
      endtime: '',
    },
    taskUser: [],
    taskUserIdx: -1,
    managerUserNicks: '',
    isShowUserPicker: false,
    jieduan: 0,
  },
  delProject() {
    wx.showModal({
      title: '提示',
      content: '确认删除该项目？',
      success: (res) => {
        if (res.confirm) {
          reqPost('setPorjectDel', {
            projectid: this.data.id
          }, '提交中').then(({data}) => {
            wx.showToast({
              title: '删除成功',
              duration: 800,
              success: () => {
                setTimeout(() => {
                  wx.navigateBack()
                }, 800)
              }
            })
          }).catch(res => {})
        }
      }
    })
  },
  tapTask(e) {
    console.log(e);
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/task/detail/detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options
    this.setData({
      id,
      'taskFilter.project_id': id
    })
    this.getTaskList()
    this.getLogData()
    this.getTaskUsers(() => {
      this.getProjectInfo()
    })
    // 
  },
  getProjectInfo() {
    reqPost('getProjectInfo', {
      projectid: this.data.id
    }, false).then(({data}) => {
      let form = {
        projectid: this.data.id,
        name: data.name,
        remark: data.remark,
        review_id: data.reviewUser.admin_id,
        manager_ids: data.project_manager.map(item => item.admin_id).join(','),
        user_ids: data.project_user.map(item => item.admin_id).join(','),
        starttime: new Date(data.start_time*1000).format('yyyy-MM-dd'),
        endtime: new Date(data.end_time*1000).format('yyyy-MM-dd'),
      }
      let taskUserIdx = this.data.taskUser.findIndex(item => item.id==form.review_id)
      console.log(this.data.taskUser.findIndex(item => item.id==form.review_id));
      let managerUserNicks = data.project_manager.map(item => item.nick).join(',')
      this.setData({
        taskUserIdx,
        managerUserNicks,
        form
      })
    }).catch(res => {})
  },
  getLogData() {
    reqPost('getProgectLogList', {
      projectid: this.data.id
    }, true).then(({data}) => {
      console.log(data);
      data.rows.forEach(item => {
        item.date = new Date(item.create_time*1000).format('yyyy/M/d')
        item.time = new Date(item.create_time*1000).format('hh:mm')
      })
      this.setData({
        logList: data.rows
      })
    }).catch(res => {

    })
  },
  // getLogData() {
  //   reqPost('getProgectLogList', {
  //     projectid: this.data.id
  //   }, true).then(({data}) => {
  //     console.log(data);
  //   }).catch(res => {

  //   })
  // },
  getTaskList(isConcat = false) {
    reqPost('taskList', this.data.taskFilter, true).then(({data}) => {
      data.rows.forEach(item => {
        item.createDate = new Date(item.create_time*1000).format('M-dd h:m')
        item.priorityColor = item.priority>=4
      })
      if(isConcat) {
        this.setData({
          taskList: this.data.taskList.concat(data.rows),
          taskListCount: data.count
        })
      }else {
        this.setData({
          taskList: data.rows,
          taskListCount: data.count
        })
      }
    }).catch(res => {

    })
  },
  statusPickerChange(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'taskFilter.page': 1,
      'taskFilter.status': Number(value)
    })
    this.getTaskList()
  },
  tapTab(e) {
    console.log(e);
    const {idx} = e.currentTarget.dataset
    this.setData({
      tabIdx: idx
    })
  },
  // 
  // 
  //
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
          title: '修改成功',
          icon: 'success',
          duration: 1250,
          mask: false
        })
        this.getProjectInfo()
      }
    }).catch(res => {})
  },
  getTaskUsers(callback = false) {
    reqPost('getTaskUsers').then(({data}) => {
      this.setData({
        taskUser: data
      })
      callback && callback()
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
  bindchangeDate(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.endtime': value
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
    if(this.data.taskListCount>this.data.taskList.length) {
      this.data.taskFilter.page++
      this.getTaskList(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})