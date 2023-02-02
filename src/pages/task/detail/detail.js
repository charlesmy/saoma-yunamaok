// pages/task/detail/detail.js
import {reqGet, reqPost, REALM, UPLOADURL, HEADER} from '../../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskStatus:['待审批','未开始','进行中','已完成'],
    admin_id: '', // 创建者id
    admin_idIdx: -1,
    REALM: REALM,
    annex_show_flag:true,
    annex_src:'',
    isNotCanAlter: true,
    form: {
      name: '',
      task_status:'',
      audit_status:'',
      project_id: '',
      execute_uid: '',
      join_admin_ids: '',
      content: '',
      join_admins:'',
      client_ordernum: '',
      order_quantity: '',
      process_price: '',
      priority: '2',
      notice_open: '1',
      real_order_quantity: '',
      real_process_price: '',
    },
    tempFilePaths: [],
    projectList: [],
    projectListIdx: -1,
    taskUser: [],
    execute_uidIdx: -1,
    isShowUserPicker: false,
    join_admin_nicks: '',
    // 
    tabIdx: 0,
    id: '',
    inputComment: '',
    commentList: [],
    logList: [],
  },
  choosePic() {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        console.log(res);
        this.setData({
          tempFilePaths: this.data.tempFilePaths.concat(res.tempFilePaths)
        })
      }
    })
  },
  alter() {
    reqPost('taskEdit', this.data.form, '提交中').then(({data}) => {
      if(data.task_id) {
        this.data.tempFilePaths.forEach(item => {
          wx.uploadFile({
            url: UPLOADURL,
            header: HEADER,
            filePath: item,
            name: 'file',
            formData: {
              'task_id': data.task_id
            },
            success: (res) => {
              console.log(res);
            }
          })
        })
        wx.showToast({
          title: '修改任务成功',
          icon: 'success',
          duration: 1250,
          mask: false
        })
        this.getTaskInfo()
      }
    }).catch(res => {})
  },
  checkTask(audit_status) {
    reqPost('checkTask', {
      task_id: this.data.id,
      audit_status
    }, '提交中').then(({data}) => {
      wx.showToast({
        title: audit_status==1?'审核通过成功':'任务驳回成功',
        icon: 'success',
        duration: 1250,
        mask: false
      })
      this.getTaskInfo()
    }).catch(res => {})
  },
  cancel() {
    this.checkTask(2)
  },
  submit() {
    this.checkTask(1)
  },
  delTask() {
    wx.showModal({
      title: '提示',
      content: '确认删除该任务？',
      success: (res) => {
        if (res.confirm) {
          reqPost('setTaskDelete', {
            task_id: this.data.id
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
  // 
  inputComment(e) {
    const inputComment = e.detail.value
    this.setData({
      inputComment
    })
  },
  sendComments(e) {
    reqPost('commentAdd', {
      task_id: this.data.id,
      content: this.data.inputComment
    }, '发送中').then(({data}) => {
      this.setData({
        inputComment: ''
      })
      this.getTaskCommentList()
    }).catch(res => {})
  },
  tapUserPicker() {
    this.setData({
      isShowUserPicker: true
    })
  },
  getTaskCommentList() {
    reqPost('getTaskCommentList', {
      task_id: this.data.id,
      page: 1,
      limit: 999
    }).then(({data}) => {
      data.rows.forEach(item => {
        item.time = new Date(item.create_time*1000).format('M/d hh:mm')
      })
      this.setData({
        commentList: data.rows || []
      })
      console.log(data);
    }).catch(res => {})
  },
  rateChange0(e) {
    console.log(e.detail);
    reqPost('setTaskStatus', {
      task_id: this.data.id,
      status:e.detail.value
    }, false).then(({data}) => {
      this.setData({
        taskStatus_txt: this.data.taskStatus[e.detail.value]
      });
      wx.showToast({
        title:'进度设置成功',
        icon: 'success',
        duration: 1250,
        mask: false
      })
    }).catch(res => {

    })
    
  },
  getTaskLog() {
    reqPost('getTaskLogList', {
      task_id: this.data.id,
      page: 1,
      limit: 999
    }).then(({data}) => {
      data.rows.reverse()
      data.rows.forEach(item => {
        item.date = new Date(item.create_time*1000).format('yyyy/M/d hh:mm')
        item.time = new Date(item.create_time*1000).format('hh:mm')
      })
      this.setData({
        logList: data.rows
      })
      console.log(data);
    }).catch(res => {})
  },
  getTaskInfo(callback = false) {
    reqPost('getTaskInfo', {
      task_id: this.data.id
    }, false).then(({data}) => {
      console.log(data);
      let form = {
        task_id: data.id,
        name: data.name,
        audit_status:data.audit_status,
        audit_uid:data.audit_uid,
        project_id: data.project_id,
        execute_uid: data.execute_uid,
        join_admin_ids: data.join_admin_ids,
        join_admins:data.join_admins,
        content: data.content,
        task_status:data.status,
        client_ordernum: data.client_ordernum,
        order_quantity: data.order_quantity,
        process_price: data.process_price,
        priority: data.priority,
        notice_open: data.notice_open,
        real_order_quantity: data.real_order_quantity,
        real_process_price: data.real_process_price
      }
      let execute_uidIdx = this.data.taskUser.findIndex(item => item.id==form.execute_uid)
      let admin_idIdx = this.data.taskUser.findIndex(item => item.id==data.admin_id)
      let task_annex_list = data.task_annex_list
      let taskStatus_txt=this.data.taskStatus[form.task_status]
      let isNotCanAlter =false //!app.checkAuthAlter(data.admin_id)
      this.setData({
        task_annex_list,
        execute_uidIdx,
        taskStatus_txt,
        admin_idIdx,
        admin_id: data.admin_id,
        isNotCanAlter,
        form
      })
      callback && callback()
    }).catch(res => {

    })
  },
  tapTab(e) {
    console.log(e);
    const {idx} = e.currentTarget.dataset
    if(idx==1) {
      this.getTaskLog()
    }
    this.setData({
      tabIdx: idx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options
    this.setData({
      id: Number(id)
    })
    const profile = app.profile
    this.setData({
      profile
    })
    this.getUsers(() => {
      this.getTaskInfo(() => {
        this.getProjectList()
      })
      this.getTaskCommentList()
      this.getTaskLog()
    })
  },
  // 
  //
  // getUsers() {
  //   reqPost('getTaskUsers').then(({data}) => {
  //     this.setData({
  //       taskUser: data
  //     })
  //   }).catch(res => {})
  // },
  checkController(e) {
    const {key, value} = e.currentTarget.dataset
    this.setData({
      [`form.${key}`]: value
    })
  },
  textareaInput(e) {
    console.log(e);
    const {value} = e.detail
    this.setData({
      'form.content': value
    })
  },
  // tapUserPicker() {
  //   this.setData({
  //     isShowUserPicker: true
  //   })
  // },
  userPickerCancel(e) {this.setData({isShowUserPicker: false})},
  userPickerConfirm(e) {
    console.log(e);
    let join_admin_ids = e.detail
    if(!join_admin_ids) {
      this.setData({
        join_admin_nicks: '',
        'form.join_admin_ids': '',
        isShowUserPicker: false
      })
    }
    let join_admin_nicks = join_admin_ids.split(',').map(id => {
      return this.data.taskUser.find(user => user.id==id).nick
    })
    join_admin_nicks = join_admin_nicks.join(',')
    this.setData({
      join_admin_nicks: join_admin_nicks,
      'form.join_admin_ids': join_admin_ids,
      isShowUserPicker: false
    })
  },
  getProjectList() {
    reqPost('projectList', {
      page: 1,
      limit: 999
    }).then(({data}) => {
      let projectListIdx = data.rows.findIndex(item => item.id==this.data.form.project_id)
      this.setData({
        projectListIdx,
        projectList: data.rows
      })
    }).catch(res => {})
  },
  projectPickerChange(e) {
    const {value} = e.detail
    if(value<0) return
    this.data.form.project_id = this.data.projectList[Number(value)].id
    this.setData({
      projectListIdx: Number(value)
    })
  },
  showMask: function (e) {
    this.setData({
        annex_src:e.target.dataset.src,
        annex_show_flag: false
   })
 },

  closeMask: function () {
    this.setData({
        annex_show_flag: true
   })
 },
  executePickerChange(e) {
    const {value} = e.detail
    if(value<0) return
    this.data.form.execute_uid = this.data.taskUser[Number(value)].id
    this.setData({
      execute_uidIdx: Number(value)
    })
  },
  inputController(e) {
    const {key} = e.currentTarget.dataset
    console.log(e);
    const {value} = e.detail
    this.setData({
      [`form.${key}`]: value
    })
  },
  getUsers(callback = false) {
    reqPost('getTaskUsers').then(({data}) => {
      this.setData({
        taskUser: data
      })
      callback && callback()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})