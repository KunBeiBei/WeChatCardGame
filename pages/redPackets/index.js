//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    userInfo: {},
    txt:'恭喜发财，大吉大利',
    red: '',
    button_txt_1: '返回首页',
    button_txt_2: '我的奖励'
  },
  //事件处理函数
  //继续游戏
  startGame: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  //查看奖励
  rewards: function () {
    wx.redirectTo({
      url: '../admin/admin'
    })
  },
  onLoad: function (options) {
    var that = this;
    var red = JSON.parse(options.red);
    that.setData({
      userInfo: app.globalData.userInfo,
      red: red
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/index/index',
      success(e) {
        //判断是否群发
        if (e.shareTickets == undefined) {
          app.notMass();
        } else {
          app.success(app);
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
