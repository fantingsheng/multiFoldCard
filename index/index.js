// pages/ecard/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerAnimation: {},
    cardList: [{  //组织信息
      name: '轻客公司',
      building_name: '北京市朝阳区',
      type: 0,
      logo_url: 'https://slightech-marvin.oss-cn-hangzhou.aliyuncs.com/testing/company/255/logo_url/2446f22d4a2f15c2dd3a9602624f07fa.jpeg'
    }, {
      name: '凯悦公寓',
      building_name: '江苏省无锡市',
      type: 1,
      logo_url: 'https://slightech-marvin.oss-cn-hangzhou.aliyuncs.com/testing/company/244/logo_url/e6d9e2d982262db5381e34ffe01010f5.jpg'
    }],
    floorRoom: [{  //楼层信息
      floor: 'M',
      room: '1203'
    }, {
      floor: 6,
      room: '806'
    }, {
      floor: 9,
      room: '405'
    }, {
      floor: 2,
      room: '1203'
    }, {
      floor: 9,
      room: '405'
    }, {
      floor: 15,
      room: '485'
    }, {
      floor: 18,
      room: '485'
    }],
    floorIndex: 0, //选中的楼层索引
    topData: [], //卡片绝对定位top属性值数组
    cardOpen: false, //是否展开状态
    currentCard: null, //当前展开的卡片序列索引
    wrapHeight: 0, //折叠时候卡片区域高度
    foldCardSpace: 152, //折叠状态卡片间距
    firstCardTopSpace: 30, //首张卡片距离顶部距离
    openCardSpace: 40, //展开状态卡片间距
    cardHeight: 1004 //单个卡片高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var topData = []
    for (let i = 0; i < this.data.cardList.length; i++) {
      topData[i] = this.data.foldCardSpace * i + this.data.firstCardTopSpace
    }
    this.setData({
      wrapHeight: this.getCardWrapHeight(),
      topData: topData
    })
    wx.getSystemInfo({
      success(res) {
        wx.setStorage({
          key: 'sysinfo',
          data: res
        })
      }
    })
  },

  getCardWrapHeight(){
    return (this.data.cardList.length - 1) * this.data.foldCardSpace + this.data.cardHeight + this.data.firstCardTopSpace
  },

  openCard: function (e) {
    var _this = this
    var topData = [_this.data.firstCardTopSpace]
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 600,
      timingFunction: "linear",
      delay: 0
    })
    var sys = wx.getStorageSync('sysinfo')
    //屏幕高度，单位rpx
    var winHeightRpx = sys.windowHeight / sys.windowWidth * 750

    if (_this.data.cardOpen) {
      for (let i = 1; i < _this.data.cardList.length; i++) {
        topData[i] = this.data.foldCardSpace * i + this.data.firstCardTopSpace
      }
    } else {
      //实现组织卡片展开，上面最多显示两个，下面最多显示三个，卡片间距是40rpx
      var md = _this.data.cardList.length - e.currentTarget.dataset.index - 1 - 3
      for (let i = 1; i < _this.data.cardList.length; i++) {
        if (i < e.currentTarget.dataset.index) {
          topData[i] = _this.data.firstCardTopSpace
        } else if (i == e.currentTarget.dataset.index) {
          topData[i] = _this.data.firstCardTopSpace + _this.data.openCardSpace
        } else if (i < md + e.currentTarget.dataset.index || i == md + e.currentTarget.dataset.index) {
          topData[i] = winHeightRpx - (e.currentTarget.dataset.index + md + 1) * _this.data.openCardSpace
        } else {
          topData[i] = winHeightRpx - (_this.data.cardList.length - i) * _this.data.openCardSpace
        }
      }
    }
    
    var query = wx.createSelectorQuery();
    query.select('.placeholder').boundingClientRect(function (qry) {
      if (_this.data.cardOpen) {
        animation.translateY(0).step()
        var wrapHeight = _this.getCardWrapHeight()
        var currentCard = null
      } else {
        animation.translateY(-qry.top).step()
        var wrapHeight = winHeightRpx
        var currentCard = e.currentTarget.dataset.index
      }
      _this.setData({
        wrapHeight: wrapHeight,
        currentCard: currentCard,
        topData: topData,
        cardOpen: !_this.data.cardOpen,
        headerAnimation: animation.export()
      })
    }).exec();

  },
  banScroll: function () {}, //
  selectFloor: function (e) {
    this.setData({
      floorIndex: e.currentTarget.dataset.fm
    })
  },
  onPageScroll: function (e) {
    wx.setNavigationBarTitle({
      title: e.scrollTop > 100 ? '我的通行卡' : ''
    })
  }


})