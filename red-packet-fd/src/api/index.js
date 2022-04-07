/*
包含应用中所有接口请求函数的模块
*/

import ajax from './axjax';
const BASE = 'api/'

// 账号登陆
export const reqLogin = (account,passWord) => ajax(BASE + 'sys/front/amountLogin', {account,passWord}, 'POST')

// facebook登录
export const reqFacebookLogin = (name,userId) => ajax(BASE + 'sys/front/faceBookLogin', {name,userId}, 'POST')

// Google登录
export const reqGoogleLogin = (name,userId) => ajax(BASE + 'sys/front/googleLogin', {name,userId}, 'POST')

// 免密登录
export const reqPhoneLogin = data => ajax(BASE + 'sys/front/pawFreeLogin', data, 'POST')

// 发送短信
export const reqSendSms = (phone) => ajax(BASE + 'sys/front/sendSms', {phone}, 'POST')

// 注册
export const reqRegister = data => ajax(BASE + 'sys/front/register', data, 'POST')

// 找回密码
export const reqRetrievePwd = data => ajax(BASE + 'sys/front/retrievePaw', data, 'POST')

// 抢红包列表
export const reqGrabList = data => ajax(BASE + '/web/grab/list', data, 'POST')

// 账户余额
export const reqAccountBalance = () => ajax(BASE + '/web/user/account/accountBalance', {}, 'POST')

// 充值
export const reqRechargePay = data => ajax(BASE + '/web/recharge/pay', data, 'POST')

// 充值配置项列表
export const reqRechargeConfigList = data => ajax(BASE + '/web/recharge/config/list', data, 'POST')

// 抢红包下注
export const reqGrabBet = data => ajax(BASE + '/web/grab/bet', data, 'POST')

// 拆红包
export const reqUnpackLottery = () => ajax(BASE + '/web/unpack/lottery', {}, 'POST')

// 银行卡列表
export const reqCardList = data => ajax(BASE + '/web/back/crad/list', {data}, 'POST')

// 新增银行卡
export const reqAddCard = data => ajax(BASE + '/web/back/crad/add', {data}, 'POST')

// 我的伙伴
export const reqPartnerList = () => ajax(BASE + '/web/user/account/partner', {}, 'POST')

// 提现记录
export const reqRecordsList = () => ajax(BASE + '/web/user/account/withdrawDetail', {}, 'POST')

// 分佣明细
export const reqDetailsList = () => ajax(BASE + '/web/user/account/commissionDetails', {}, 'POST')
