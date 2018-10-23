var app = getApp();
Page({
  data: {
    avatarUrl: '',
    canpoint: 0,
    allpoint: 0,
    alrpoint: 0,
    list: '',
    gift: '',
    indicatorDots: false,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    modalHidden: true
  },
  onShow: function () {
    console.log("刷新页面");
    this.onLoad();//刷新页面
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    });
    var openId = wx.getStorageSync('openId');
    var that = this
    wx.request({
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/getInfo',
      method: 'POST',
      data: {
        'openId': openId
      },
      success: function(th){
        if(th.data.status==200){
          var po = th.data.user.cumPoints - th.data.user.remainPoints
          that.setData({
            avatarUrl: th.data.avatarUrl,
            canpoint: th.data.user.remainPoints,
            allpoint: th.data.user.cumPoints,
            alrpoint: po,
            list: th.data.pointrecord,
            gift: th.data.giftrecord,
          })
        } else if (th.data.status == 202 || th.data.status == 500){
          wx.showToast({
            'title': th.data.mes,
            'icon': 'none',
            'image': '../images/exit.png'
          })
        }
      }
    });
    
  },
  exchange: function (res) {
    
    var that = this;
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/apii/viewInfo',
      method: 'POST',
      data: {
        'openId': openId
      },
      success: function (data) {
        if (data.data.state == 200) {
          wx.navigateTo({
            url: '../exchange/exchange'
          });
        } else {
          that.setData({
            modalHidden: false
          })
        }
      }
    })
  },
  //提交确认回调函数
  confirm_one: function () {
    wx.navigateTo({
      url: '../table/table'
    });
    this.setData({
      modalHidden: true
    });
  }, 
  //提交取消回调函数
  cancel_one: function () {
    this.setData({
      modalHidden: true
    });
  },
  onShareAppMessage: function (e) {
    return {
      title: '自定义分享标题自定义分享标题自定义分享标题自定义分享标题自定义分享标题',
      desc: '自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述自定义分享描述',
      path: '/pages/index/index',
      success(e) {
        //判断是否群发
        if (e.hasOwnProperty('shareTickets')) {
          app.success(app);
        } else {
          app.notMass();
        }
      },
      fail(e) {
        app.fail();
      },
      complete() {
        console.log("转发动作完成");
      }
    }
  }
})
