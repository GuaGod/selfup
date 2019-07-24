import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  isFigureCreate: REMOTE_ROOT.selfup +"/figure/isFigureCreate",  //用户是否已经创建校色
  create: REMOTE_ROOT.selfup +"/figure/createFigure",               //创建角色
  findAllPartFastImg: REMOTE_ROOT.selfup +"/img/findAllPartFastImg",  //查找图片
  findImgBySex: REMOTE_ROOT.selfup +"/img/findAllPartGoodImg",   //通过性别查找图片
  login: REMOTE_ROOT.selfup +'/wechat/decodeUserInfo',
  getAttribute: REMOTE_ROOT.selfup + '/social/getAttribute',
  changeWeather: REMOTE_ROOT.selfup + '/change/changeWeather'
}

export default API