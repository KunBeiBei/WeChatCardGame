Page({
  data: {
    code : ''
  },
  onLoad: function (res) {
    var that = this
    that.setData({
      code: res.code
    })
  },
  re:function(){
    wx.navigateBack()
  }
})
