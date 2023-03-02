// pages/task/edit/edit.js
import {reqGet, reqPost, UPLOADURL, HEADER} from '../../../api/index'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      task_id: '',
      name: '',
      project_id: '',
      execute_uid: '',
      join_admin_ids: '',
      content: '',
      client_ordernum: '',
      order_quantity: '',
      process_price: '',
      priority: '2',
      notice_open: '1',
      textarea:'',
      admin_id:0,
      user_id:0
    },
    tempFilePaths: [],
    projectList: [],
    orderMaterials:[],
    areafocus:false,
    remark:'',
    projectListIdx: -1,
    taskUser: [],
    execute_uidIdx: -1,
    isShowUserPicker: false,
    isShowMaterial:false,
    join_admin_nicks: '',
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
  cancel() {
    wx.navigateBack()
  },
  submit() {
    const profile = app.profile

    this.data.form.user_id= profile.userInfo.user_id
    reqPost('personPassEdit', this.data.form, '提交中').then(({data}) => {

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
          title: '修改密码成功',
          icon: 'success',
          duration: 1250,
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 1250)
          }
        })

    }).catch(res => {})
  },
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
  tapUserPicker() {
    this.setData({
      isShowUserPicker: true
    })
  },
  tapMaterialPicker() {
    this.setData({
        isShowMaterial: true
    })
  },
  userMaterialConfirm(e) {
      
      let mname=e.detail.name;
      let areaval=this.data.form.content;
      this.setData({isShowMaterial: false});
      if(mname==undefined) return;
      this.setData({isShowMaterial: false,
        'form.order_quantity': mname,
        'form.process_price' : this.data.form.process_price+e.detail.mid+",",
        'form.content':areaval!='' ? areaval+'\r\n'+e.detail.detail+' ' : e.detail.detail+' ',
        areafocus:true,
        
      })
  },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.task_id) {
      this.setData({
        'form.task_id': options.task_id
      })
      wx.setNavigationBarTitle({
        title: '编辑任务',
      })
    }else {
      wx.setNavigationBarTitle({
        title: '修改个人密码',
      })
    }

  },
  onShow() {
    this.getProjectList()
  },
  inputName(e) {
    const {value} = e.detail
    this.setData({
      'form.password': value
    })
  },
  getProjectList() {
    reqPost('projectList', {
      page: 1,
      limit: 999
    }).then(({data}) => {
      this.setData({
        projectList: data.rows || []
      })
    }).catch(res => {})
  },
  executePickerChange(e) {
    const {value} = e.detail
    if(value<0) return
    this.data.form.execute_uid = this.data.taskUser[Number(value)].id
    this.setData({
      execute_uidIdx: Number(value)
    })
  },
  toCreateProject() {
    wx.navigateTo({
      url: '/pages/person/edit/edit'
    })
  },

  getOrderMaterials() {
    reqPost('getOrderMaterials', {
        client_ordernum: this.data.form.client_ordernum || ''
    }).then(({data}) => {
        let notice=data.rows.length>=1 ? '--选择关联物料--' : '';
      this.setData({
        orderMaterials: data.rows,
        'form.order_quantity':notice
      })
    }).catch(res => {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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