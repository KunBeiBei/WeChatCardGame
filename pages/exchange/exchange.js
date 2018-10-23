Page({
  data: {
    gift: [
      
    ],
    isShow: true,
    ys: 'two',
    sy: 'bt',
    //已抢光样式
    // isShow: fasle,
    // ys: 'ys',
    // sy: 'sy',
    openid: ''
  },
  onLoad: function (obj) {
    var that = this
    that.openid = wx.getStorageSync('openId');
    wx.request({
      // method: 'POST',
      // data: {
      //   'openId': openId
      // },
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/getGift',
      success: function (res) {
        that.setData({
          gift: res.data
        })
      }
    })
  },
  exchange: function (res) {//点击兑换方法，res.target.dataset.id为礼物id
    var that = this
    that.id = res.target.dataset.id
    wx.request({
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/Exchange',
      method: 'POST',
      data: {
        'openId': that.openid,
        'id': that.id
      },
      success: function(obj){
        if(obj.data.status==200){
          wx.navigateTo({
            url: '../gift/gift?code='+obj.data.code
          })
        }else{
          wx.showToast({
            'title': obj.data.mes,
            'icon': 'none',
            'image': '../images/exit.png'
          })
        }
      }
    })      
  }
})
