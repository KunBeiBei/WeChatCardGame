Page({
  data: {
    gift: [
      { src: '', name: '小熊公仔', points: 300, id: 1 },
      { src: '', name: '水壶', points: 250, id: 2 },
      { src: '', name: '贴纸', points: 100, id: 3 },
    ],
    openid: ''
  },
  onLoad: function (obj) {
    var that = this
    that.openid = obj.openid
    wx.request({
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
