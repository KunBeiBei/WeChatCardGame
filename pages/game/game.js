//game.js
var app = getApp();
var checked = 0;    //已匹配牌数
var size = 8;       // 界面显示的牌数=size*2
var firstX = -1;    // 点击的第一张卡牌的坐标
var firstY = -1;    // 点击的第一张卡牌的坐标
var jf = 0;         //积分
Page({
  data: {
    clickNum: 0,         // 点击次数*
    useTime: 0,          // 游戏时间*秒数
    useTimes: 0,         // 游戏时间*毫秒
    cards: [],           // 随机挑选出来的牌   
    clickable: false,    // 当前是否可点击
    timer: '',           // 游戏计时的定时器
    display:''
  },
  //积分显示页面跳转
  hideview:function(){
    this.setData({
      display:"none"
    });
    wx.redirectTo({
      url: '../redPackets/index?red='+jf
    })
  },
  //开始游戏
  startGame: function () { 
    var data = this.data;
    var that = this;
    console.log('开始游戏');
    //打乱正常牌
    checked = 0;
    firstX = -1;
    firstY = -1;
    var allCard = wx.getStorageSync("allCard");
    var tmp = allCard.sort(//对数组中的元素进行排序
      function (a, b) { 
        return Math.random() > .5 ? -1 : 1; 
      }
    ).splice(0, Math.floor(size));
    
    //再次打乱
    tmp = tmp.concat(tmp).sort(function (a, b) { return Math.random() > .5 ? -1 : 1; }); 
    // 添加src,state,转成二维数组方面展示
    var cards = [];
    var ix = -1; var iy = 0;
    for (var i in tmp) {
      if (i % 4 == 0) {
        cards.push([]);
        ix++; iy = 0;
      }
      cards[ix].push({
        src: '../images/' + tmp[i] + '.jpg',
        state: 1   // 为1时显示图片,为0时显示牌背面
      });
    }
    this.setData({
      cards: cards
      // clickNum: 0,
      // useTime: 0,
      // useTimes: 0,
      // clickable: false
    });

    var that = this;
    setTimeout(function () {
      that.turnAllBack();  // 所有的牌翻到背面
      data.clickable = true; // 开始计时了才让点
      if (data.timer === '') {
        data.timer = setInterval(function () {
          data.useTime += 1;
          if (data.useTime > 100){
            data.useTime = 0;
            data.useTimes += 1;
          }
          that.setData({ 
            useTime: data.useTime,
            useTimes: data.useTimes
          });
        }, 10); // 游戏开始计时
      } else {
        that.setData({ useTime: 0 });
      }
    }, 6000); // 游戏开始前先让玩家记忆几秒钟
  },
  onTap: function (event) {
    var that = this;
    var data = this.data;
    var ix = event.currentTarget.dataset.ix;               // 获取点击对象的坐标
    var iy = event.currentTarget.dataset.iy;
    if (data.cards[ix][iy].state != 0 || !data.clickable)  //点击的不是未翻过来的牌或者现在不让点直接pass
      return;
    that.setData({ clickNum: ++data.clickNum });           //点击数加1   
    // 1. 检测是翻过来的第几张牌
    if (firstX == -1) {
      // 1.1 第一张修改状态为 1
      data.cards[ix][iy].state = 1;
      firstX = ix; 
      firstY = iy
      that.setData({ cards: data.cards });     // 通过setData让界面变化
    } else {
      // 1.2 前面已经有张牌翻过来了,先翻到正面然后看是不是一样
      data.cards[ix][iy].state = 1;
      that.setData({ cards: data.cards });
      if (data.cards[firstX][firstY].src === data.cards[ix][iy].src) {
        // 1.2.1.1 两张牌相同, 修改两张牌的state为2完成配对
        data.cards[firstX][firstY].state = 2;
        data.cards[ix][iy].state = 2;
        checked += 1; // 完成配对数++
        firstX = -1;// 准备下一轮匹配 
        // 1.2.1.2 检查是否所有牌都已经翻过来,都已翻过来提示游戏结束
        if (checked == size) { // 所有牌都配对成功了!
          clearInterval(this.data.timer); // 暂停计时
          this.setData({
            display: "block"
          })
          this.data.timer = '';
          var useTime = data.useTime < 10 ? "0" + data.useTime : data.useTime;
          var t = parseInt(data.useTimes + "" + useTime);
          if(t >= 9000){
            jf = 0;
          }else{
            this.saveScore({ 'time': t / 100, 'click': data.clickNum }).then(function (res) {
              if (res.success === 1) {
                jf = res.jf;
              } else {
                wx.showToast({
                  title: res.mes,
                  icon: 'loading',
                  image: '../images/fff.png',
                  duration: 3000
                });
              }
            }); // 保存成绩
          }
        }
      } else {  // 1.2.2 两张牌不同, 修改两张牌的state为 0
        data.cards[firstX][firstY].state = 0;
        data.cards[ix][iy].state = 0;
        firstX = -1;
        data.clickable = false;
        setTimeout(function () {
          that.setData({ cards: data.cards, clickable: true });
        }, 350); //过半秒再翻回去
      }
    }
  }, 
  turnAllBack: function () {
    for (var ix in this.data.cards)
      for (var iy in this.data.cards[ix])
        this.data.cards[ix][iy].state = 0;
    this.setData({ cards: this.data.cards });
  },
  saveScore: function (score) { // 保存分数
    return new Promise(function (resolve, reject) {
      var openId = wx.getStorageSync('openId');
      console.log(openId);
      wx.request({ 
        url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/apii/getPlay',
        method: 'POST',
        data: {
          'openId': openId,
          'score': score
        },
        success: function (data) {
          if (data.data.state == 200) {
            resolve(data.data);
          } else {
            reject(data.data);
          }
          console.log(data.data);
        }
      });
          
    });
  }
  , "disableScroll": true,
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.startGame();
  },
  modalComfirm: function () {
    this.startGame();
  },
  modalCancle: function () {
    wx.navigateTo({
      url: '../admin/admin'
    })
  },
  onReady: function () {
    console.log("onReady")
  },
  onShow: function () {
    console.log("onShow");
    if (checked == size)
      this.startGame()
  },
  onHide: function () {
    console.log("onHide")
  },
  onUnload: function () {
    console.log("onUnload")
  },
  onReachBottom: function () {
    console.log("onReachBottom")
  },
  onShareAppMessage: function () {
    console.log("onShareAppMessage")
  },
  onShareAppMessage: function (res) {
    console.log('onShareAppMessage')
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/index/index',
      success(e) {
        //判断是否群发
        if(e.shareTickets == undefined){
          app.notMass();
        }else{
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
