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

// 找回密码
export const reqRetrievePwd = (phone) => ajax(BASE + 'sys/front/sendSms', {phone}, 'POST')
