/*
包含应用中所有接口请求函数的模块
*/

import ajax from './axjax';
const BASE = 'api/'

// 登陆
export const reqLogin = data => ajax(BASE + 'sys/home/login', data, 'POST')

// 获取角色列表
export const reqRoles = data => ajax(BASE + 'sys/role/list', data, 'POST')
// 添加角色
export const reqAddRole = data => ajax(BASE + 'sys/role/add', data , 'POST')
// 编辑角色
export const reqEditRole = data => ajax(BASE + 'sys/role/update', data , 'POST')
// 删除角色
export const reqDeleteRole = id => ajax(BASE + 'sys/role/delete', {id} , 'POST')
// 菜单列表
export const reqMenu = () => ajax(BASE + 'sys/menu/list', {} , 'POST')
// 根据角色获取菜单权限
export const reqRoleIdMenu = (roleId) => ajax(BASE + `sys/roleMenu/getByRoleMenuPermissions/${roleId}`, {})
// 编辑角色的菜单配置
export const reqEditRoleMenu = data => ajax(BASE + 'sys/roleMenu/menuConfig', data, 'POST')

export const getDeviceDetils = (deviceId) => ajax(BASE + `deviceId/${deviceId}`)

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