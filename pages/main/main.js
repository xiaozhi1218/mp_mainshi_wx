const app = getApp()

var lastAnswer = [] // 最后答题信息
var category = [] // 城市学科

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagetype: '已做',
    questionList: [], //  问题列表
    currentTypeId: 101, // 当前类型：首页
    currentKindId: 1, // 默认种类： TAG
    currentTab: 0, // 点击切换索引
    userInfo: {}, //  用户信息
    answerCounts: '', // 累计答题
    onContent: 100, // 底部tab
    onTab: 1,
    categoryType: '',
    categoryKind: 1,
    scrollHeight: '',
    cityID: '',
    subjectID: ''
  },
  /**
   * 监听页面加载
   */
  onLoad: function (option) {
    var _this = this
    _this.loadQuestions() // 加载问题列表
    _this.loadUserCenter() // 加载个人中心

    this.setData({
      userInfo: wx.getStorageSync('userInfo') || {}
    })

    // 滚动区域
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 100
        })
      }
    })
  },
  // 当main页面展示的时候执行的函数
  onShow: function (e) {
    let _this = this
    //封装请求参数
    let backdata = {
      //categoryType的值为101表示刷题、201表示错题本、202表示20的练习、203表示收藏题库
      categoryType: _this.data.currentTypeId,
      //categoryType的值为1表示按学科目录、2表示按企业
      categoryKind: _this.data.categoryKind
    }
    //
    app.api
      .questionsCategorys(backdata)
      .then(res => {
        //处理响应数据
        _this.setData({
          questionList: res.data.result
        })
      })
      .catch(res => {
        let errmsg = res.data.errmsg === undefined ? res.data : res.data.errmsg
        $Message({
          content: errmsg,
          type: 'error',
          duration: 5
        })
      })
    _this.loadUserCenter()
  },
  /**
   * 业务请求
   */
  // 默认加载
  loadQuestions() {
    let _this = this

    let data = {
      categoryType: _this.data.currentTypeId,
      categoryKind: _this.data.currentKindId
    }
    app.api
      .questionsCategorys(data)
      .then(res => {
        _this.setData({
          questionList: res.data.items
        })
      })
      .catch(res => {
        let errmsg = res.data.errmsg === undefined ? res.data : res.data.errmsg
        $Message({
          content: errmsg,
          type: 'error',
          duration: 5
        })
      })
  },
  // 切换：题库列表
  loadSwitchData: function (e) {
    //改变categoryKind的值
    this.setData({
      categoryKind: e.detail.val
    })
    let _this = this
    let data = {
      categoryType: 101,
      categoryKind: this.data.categoryKind
    }
    //发送请求获取题目分类列表
    app.api
      .questionsCategorys(data)
      .then(res => {
        _this.setData({
          questionList: res.data.result
        })
      })
      .catch(res => {
        let errmsg = res.data.errmsg === undefined ? res.data : res.data.errmsg
        $Message({
          content: errmsg,
          type: 'error',
          duration: 5
        })
      })
  },
  // 个人中心
  loadUserCenter() {
    let _this = this
    app.api
      .userCenter()
      .then(res => {
        lastAnswer = res.data.result.lastAnswer
        category = res.data.result.category
        _this.setData({
          answerCounts: res.data.result.answerCount
        })
      })
      .catch(res => {
        $Message({
          content: '加载出现错误',
          type: 'error',
          duration: 5
        })
      })
  },
  /**
   * 界面交互
   */

  // 路由：去能力图谱
  handleAbility() {
    wx.navigateTo({
      url: `../ability/ability`
    })
  },

  // 路由：去做题
  handleExam: function (e) {
    //1. 获取当前点击的条目的id
    let id = e.detail.id
    //2. 获取当前点击的条目的名字
    let title = e.detail.title
    //3. 获取当前的categoryType  101
    let type = this.data.currentTypeId
    //4. 获取当前的categoryKind 1 或者 2
    let kind = this.data.categoryKind
    //5. 跳转到/exam/exam并且将当前条目的id、title、type、kind都携带过去
    wx.navigateTo({
      url: `../exam/exam?id=${id}&title=${title}&type=${type}&kind=${kind}`
    })
  },
  // 路由：去错题本
  handleIncorrect() {
    let categoryKind = 1
    let categoryType = 201
    wx.navigateTo({
      url: `../mywrongbook/mywrongbook?categoryKind=${categoryKind}&categoryType=${categoryType}`
    })
  },
  // 路由：去我的练习
  handleExercise() {
    let categoryKind = 1
    let categoryType = 202
    wx.navigateTo({
      url: `../myexercise/myexercise?categoryKind=${categoryKind}&categoryType= ${categoryType}`
    })
  },
  // 路由：去收藏题库页面
  handleCollect() {
    let categoryKind = 1
    let categoryType = 203
    wx.navigateTo({
      url: `../mycollect/mycollect?categoryKind=${categoryKind}&categoryType= ${categoryType}`
    })
  },
  // 路由： 去切换方向页面
  handleIndex() {
    wx.reLaunch({
      url: `/pages/welcome/activate/activate?cityID=${category.cityID}&subjectID=${category.subjectID}`
    })
  },
  // 路由： 继续答题
  handleGoExam() {
    wx.navigateTo({
      url: `../exam/exam?id=${lastAnswer.categoryID}&kind=${lastAnswer.categoryKind}&type=${lastAnswer.categoryType}&title=${lastAnswer.categoryTitle}`
    })
  },
  // 切换题库
  handleGoLib() {
    this.setData({
      onContent: 101
    })
  },

  // 切换：底部页面切换
  changPage: function (e) {
    //1. 设置dataType的值
    let dataType = e.currentTarget.dataset.type
    this.setData({
      onContent: dataType
    })
    //判断如果dataType是103则加载个人中心
    if (dataType === "103") {
      this.loadUserCenter()
    }
  }
})