//index.js
//获取应用实例
const app = getApp()
const {$Message} = require('../../../lib/iview/base/index')

Page({
  data: {
    currentCityID: 52, // 当前城市ID
    currentCity: '', // 当前城市名称
    cityList: [], // 城市列表
    subjectsList: [], // 学科列表

    subjectID: 87, // 学科ID
    loading: true,
    clientHeight: ''
  },
  //当city页面加载的时候执行
  onLoad: function(option) {
    //调用方法获取学科列表
    this.loadSubjects()
    //调用方法获取城市列表
    this.loadCities()

    this.setData({
      currentCityID: option.cityID === undefined ? 52 : option.cityID,
      subjectID: option.subjectID === undefined ? 87 : option.subjectID // FIXME: subjectID
    })

    // FIXME: 取消本地缓存 categoryType
    // let categoryType = wx.getStorageSync('categoryType') || null
    // if(categoryType) {
    //   this.setData({
    //     currentCityID: categoryType.cityID,
    //     subjectID: categoryType.subjectID // FIXME: subjectID
    //   })
    // }
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          clientHeight: res.windowHeight
        })
      }
    })
  },
  ///////////////////////////////////////////////////////////////////////////   页面交互
  // 进入城市列表
  cityChoose: function(e) {
    //跳转到city页面
    wx.navigateTo({
      url: '../city/city'
    })
  },
  // 选择城市
  handleChangecity: function(e) {
    this.setData({
      currentCityID: e.currentTarget.dataset.id,
      currentCity: e.currentTarget.dataset.title
    })
  },
  // 选择学科
  changeTechnology: function(e) {
    this.setData({
      subjectID: e.currentTarget.dataset.id
    })
  },

  // /////////////////////////////////////////////////////////////////////////  业务请求
  // 城市列表接口
  loadCities() {
    let _this = this
    //设置fs的值为1
    let data = {
      fs: 1
    }
    //调用了微信的定位的API
    wx.getLocation({
      success: function(res) {
        //获取经纬度
        let lng = res.longitude
        let lat = res.latitude
        //将经纬度封装到请求参数中
        data = {
          ...data,
          location: `${lng},${lat}`
        }
      },
      fail: function() {
        $Message({
          content: '当前城市获取失败',
          type: 'error',
          duration: 5
        })
      },
      //定位结束后要执行的代码
      complete: function() {
        //app 表示当前应用程序，api表示utils/api.js
        app.api
          .baseCitys(data)
          .then(res => {
            //打印响应数据
            console.log(res.data.result.citys)
            _this.setData({
              currentCityID: res.data.result.location.id,
              currentCity: res.data.result.location.title,
              cityList: res.data.result.citys
            })
          })
          .catch(res => {
            $Message({
              content: '请求出现错误',
              type: 'error',
              duration: 5
            })
          })
      }
    })
  },
  // 学科列表接口
  loadSubjects() {
    let _this = this
    app.api
      .baseSubjects()
      .then(res => {
        console.log(res.data)
        _this.setData({
          subjectsList: res.data.result
        })
      })
      .catch(res => {
        $Message({
          content: '请求出现错误',
          type: 'error',
          duration: 5
        })
      })
  },
  // 点击确定，并保存选择
  handleLogin: function(e) {
    let _this = this
    //选择的城市id和学科id
    let data = {
      cityID: _this.data.currentCityID,
      subjectID: _this.data.subjectID // FIXME: subjectID
    }

    //如果全局存储了用户信息，则获取全局存储的用户信息
    let userInfo = wx.getStorageSync('userInfo') || null
    // let categoryType = wx.getStorageSync('categoryType') || null // FIXME: 取消本地缓存

    if (userInfo) {
      app.api
        .questionsConfirm(data)
        .then(res => {
          // wx.setStorageSync('categoryType', data) // 写缓存 // FIXME: 取消本地缓存
          // console.log(res)
          wx.redirectTo({
            url:
              '/pages/main/main?cityID=' +
              data.cityID +
              '&subjectID=' +
              data.subjectID
          })
        })
        .catch(res => {
          let errmsg =
            res.data.errmsg === undefined ? res.data : res.data.errmsg
          $Message({
            content: errmsg,
            type: 'error',
            duration: 5
          })
        })
    } else {
      //先获取用户信息
      app.getUserInfo(e.detail, function() {
        app.api
          .questionsConfirm(data)
          .then(res => {
            // wx.setStorageSync('categoryType', data) // 写缓存 // FIXME: 取消本地缓存
            // console.log(res)
            wx.redirectTo({
              url:
                '/pages/main/main?cityID=' +
                data.cityID +
                '&subjectID=' +
                data.subjectID
            })
          })
          .catch(res => {
            let errmsg =
              res.data.errmsg === undefined ? res.data : res.data.errmsg
            $Message({
              content: errmsg,
              type: 'error',
              duration: 5
            })
          })
      })
    }
  }
})
