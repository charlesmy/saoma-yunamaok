// components/userPicker/material-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    value: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curValue: ''
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        curValue: this.properties.value
      })
    },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapItem(e) {
      const {item} = e.currentTarget.dataset
      console.log(item);
      this.triggerEvent('confirm', item)
      if(this.data.curValue) {
        const arr = this.data.curValue.split(',')
        const idx = arr.findIndex(val => val==item.id)
        if(idx >= 0) {
          arr.splice(idx, 1)
          console.log(arr);
        }else {
          arr.push(String(item.id))
        }
        this.setData({
          curValue: arr.join(',')
        })
      }else {
        this.setData({
          curValue: String(item.id)
        })
      }
    },
    confirm(e) {
      this.triggerEvent('confirm', this.data.curValue)
    },
    cancel(e) {
      this.triggerEvent('cancel', this.data.curValue)
    }
  }
})
