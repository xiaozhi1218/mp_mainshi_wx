const request = require('./request')

// 基础数据
//发送请求，获取城市列表
const baseCitys = data => request('post', `/common/citys.do`, data)
const baseSubjects = data => request('get', '/common/courseList.do', data)

// 用户数据
const userLogin = data => request('post', '/member/login.do', data)
const userCenter = data => request('post', '/member/center.do', data)

// 面试题数据
const questionsConfirm = data => request('post', `/member/setCityCourse.do`, data)
const questionsFavorite = data => request('post', `/questions/favorite/${data.id}`, data)
//获取题目分类列表
const questionsCategorys = data => request('post', `/category/list.do`, data)
const questionsList = data => request('post', `/question/list.do`, data)
const questionsCommmitOne = data => request('post', `/question/submit.do`, data)
const questionsCommmitBatch = data => request('post', `/questions/category/${data.categoryID}/${data.categoryKind}/${data.categoryType}`, data)
const questionsEmpty = data => request('post', `/questions/empty/${data.categoryID}/${data.categoryKind}/${data.categoryType}`, data)

module.exports = {
  baseCitys,
  baseSubjects,
  userLogin,
  userCenter,
  questionsConfirm,
  questionsFavorite,
  questionsCategorys,
  questionsList,
  questionsCommmitOne,
  questionsCommmitBatch,
  questionsEmpty
}
