/*
包含应用中所有接口请求函数的模块
*/

import ajax from './axjax';
const BASE = 'api/v2/'

// 登陆
export const reqLogin = (username,password) => ajax(BASE + 'login', {username,password}, 'POST')

// 获取一级分类/二级分类列表
export const getDeviceList = () => ajax(BASE + 'device/search', {}, 'POST')
export const getDeviceDetils = (deviceId) => ajax(BASE + `deviceId/${deviceId}`)

/*
json请求函数
*/
// export const reqWeather = (city) => {
//     const url = `http;//api.map.baidu.com/telematics/v3/weather?location=${city}%output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
// }