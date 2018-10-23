Page({
  data: {
    gift: [
      
    ],
    openid: ''
  },
  onLoad: function (obj) {
    var that = this
    var openid = wx.getStorageSync('openId');
    wx.request({
      method: 'POST',
      data: {
        'openId': openid
      },
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/getGift',
      success: function (res) {
        console.log(res);
        that.setData({
          gift: res.data
        })
      }
    })
  },
  exchange: function (res) {//点击兑换方法，res.target.dataset.id为礼物id
    var openid = wx.getStorageSync('openId');
    var that = this;
    that.id = res.target.dataset.id;
    var id = parseInt(res.target.dataset.id) - 1;
    if (that.data.gift[id].isShow == 1){
      wx.request({
        url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/Exchange',
        method: 'POST',
        data: {
          'openId': openid,
          'id': that.id
        },
        success: function (obj) {
          if (obj.data.status == 200) {
            wx.navigateTo({
              url: '../gift/gift?code=' + obj.data.code
            })
          } else {
            wx.showToast({
              'title': obj.data.mes,
              'icon': 'none',
              'image': '../images/exit.png'
            })
          }
        }
      })  
    }  
  }
})
