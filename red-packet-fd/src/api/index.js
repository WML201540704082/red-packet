/*
包含应用中所有接口请求函数的模块
*/

import ajax from './axjax';
const BASE = 'api/'

// 账号登陆
export const reqLogin = (account,passWord) => ajax(BASE + 'sys/front/amountLogin', {account,passWord}, 'POST')

// facebook登录
export const reqFacebookLogin = data => ajax(BASE + 'sys/front/faceBookLogin', data, 'POST')

// Google登录
export const reqGoogleLogin = data => ajax(BASE + 'sys/front/googleLogin', data, 'POST')

// 免密登录
export const reqPhoneLogin = data => ajax(BASE + 'sys/front/pawFreeLogin', data, 'POST')

// 发送短信
export const reqSendSms = (phone) => ajax(BASE + 'sys/front/sendSms', {phone}, 'POST')

// 注册
export const reqRegister = data => ajax(BASE + 'sys/front/register', data, 'POST')

// 找回密码
export const reqRetrievePwd = data => ajax(BASE + 'sys/front/retrievePaw', data, 'POST')

// 抢红包列表
export const reqGrabList = data => ajax(BASE + 'web/grab/list', data, 'POST')

// 获取红包个数
export const reqGrabCount = () => ajax(BASE + 'web/user/account/envelopeCount')

// 账户余额
export const reqAccountBalance = () => ajax(BASE + 'web/user/account/accountBalance', {}, 'POST')

// 充值
export const reqRechargePay = data => ajax(BASE + 'web/recharge/pay', data, 'POST')

// 充值获取支付订单信息
export const reqPayOrderInfo = data => ajax(BASE + 'web/recharge/selectOrder', data, 'POST')

// 充值配置项列表
export const reqRechargeConfigList = data => ajax(BASE + 'web/recharge/config/list', data, 'POST')

// 抢红包下注
export const reqGrabBet = data => ajax(BASE + 'web/grab/bet', data, 'POST')

// 拆红包
export const reqUnpackLottery = () => ajax(BASE + 'web/unpack/lottery', {}, 'POST')

// 获取轮番图信息
export const reqCarouselInfo = data => ajax(BASE + 'web/unpack/broadcast', data)

// 银行列表
export const reqBankList = data => ajax(BASE + 'web/back/crad/list', data, 'POST')

// 用户银行卡列表
export const reqUserCardList = data => ajax(BASE + 'web/user/back/list', data, 'POST')

// 新增银行卡
export const reqAddCard = data => ajax(BASE + 'web/user/back/add', data, 'POST')

// 修改银行卡
export const reqUpdateCard = data => ajax(BASE + 'web/user/back/update', data, 'POST')

// 删除银行卡
export const reqDeleteCard = id => ajax(BASE + 'web/user/back/delete', {id}, 'POST')

// 我的伙伴
export const reqPartnerList = () => ajax(BASE + 'web/user/account/partner', {}, 'POST')

// 提现记录
export const reqRecordsList = data => ajax(BASE + 'web/user/account/withdrawDetail', data, 'POST')

// 提现
export const reqWithdraw = data => ajax(BASE + 'web/user/account/withdraw', data, 'POST')

// 分佣明细
export const reqDetailsList = data => ajax(BASE + 'web/user/account/commissionDetails', data, 'POST')

// 客服
export const reqCustomerImg = data => ajax(BASE + 'web/customer/detail')
