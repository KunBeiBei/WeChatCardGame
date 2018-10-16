//logs.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    logs: [],
    logerrors:'',
    rank: [],
    rankerrors:'',
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,

  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    });
    var that = this;
    wx.request({
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/apii/getGames',
      data: {},
      method: 'POST',
      header: {

        'Content-Type': 'application/json'
      },
      success: function (res) {
       
        if(res.data.code===200){
          that.setData({logs:res.data.data});
        }else{
          if(res.data.code===404){
            that.setData({
              logerrors:res.data
            });
          }
        }

      }
    });
    
    wx.request({
      url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/apii/getIntervals', 
      data: {},
      method: 'POST',
      header: {

        'Content-Type': 'application/json'
      },
      success: function (res) {
        if(res.data.code===200){
          that.setData({
            rank: res.data.data
          });
        }else {
          // console.log(res.data)
          if(res.data.code===404){
            that.setData({
              rankerrors:res.data.msg
            });
          }
        }
      }
    });

    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    }); 

  },

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShareAppMessage: function (e) {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
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

