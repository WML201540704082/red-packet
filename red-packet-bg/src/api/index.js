/*
包含应用中所有接口请求函数的模块
*/

import ajax from './axjax';
const BASE = 'api/v2/'

// 登陆
export const reqLogin = (username,password) => ajax(BASE + 'login', {username,password}, 'POST')

// 获取角色列表
export const reqRoles = () => ajax(BASE + 'device/search', {}, 'POST')
export const getDeviceDetils = (deviceId) => ajax(BASE + `deviceId/${deviceId}`)
// 添加角色
export const reqAddRole = (name) => ajax(BASE + 'device', {name} , 'POST')
// 获取账号列表
export const reqAccount = data => ajax(BASE + 'device/search', data, 'POST')
// 添加账号
export const reqAddAccount = (deviceId,deviceName) => ajax(BASE + 'device', {deviceId,deviceName} , 'POST')
// 获取开奖记录列表
export const reqLottery = data => ajax(BASE + 'device/search', data, 'POST')


/*
json请求函数
*/
// export const reqWeather = (city) => {
//     const url = `http;//api.map.baidu.com/telematics/v3/weather?location=${city}%output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
// }