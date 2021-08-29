// pages/city/city.js

const app = getApp()
const { $Message } = require('../../../lib/iview/base/index')
Page({
  data: {
    cityList: [],

    currentItemId: 1,
    currentCity: '北京'
  },
  //页面加载的时候执行的方法
  onLoad: function () {
    this.loadCitys()
  },
  loadCitys() {
    let _this = this
    //定位
    wx.getLocation({
      success: function (res) {
        let lng = res.longitude
        let lat = res.latitude
        let data = {
          fs: 0,
          location: `${lng},${lat}`
        }
        app.api
          .baseCitys(data)
          .then(res => {
            _this.setData({
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

      },
    })
  },
  changeCity: function (e) {
    let cityID = e.currentTarget.dataset.id
    let currentCityName = e.currentTarget.dataset.title

    let pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  // 当前页
    var prevPage = pages[pages.length - 2];  // 上一页

    prevPage.setData({
      currentCity: currentCityName,
      currentCityID: cityID
    })
    wx.navigateBack()
  },
})