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
// 根据角色获取菜单权限列表
export const reqRoleIdMenu = (roleId) => ajax(BASE + `sys/roleMenu/getByRoleMenuPermissions/${roleId}`, {})
// 编辑角色的菜单配置
export const reqEditRoleMenu = data => ajax(BASE + 'sys/roleMenu/menuConfig', data, 'POST')
// 进入首页获取权限
export const reqGetPermission = data => ajax(BASE + 'sys/home/getPermission', data, 'POST')
// 退出登录
export const reqQuit = () => ajax(BASE + 'sys/home/quit', {}, 'POST')

// 获取账户列表
export const reqAccount = data => ajax(BASE + 'sys/user/list', data, 'POST')
// 添加账号
export const reqAddAccount = data => ajax(BASE + 'sys/user/createAccount', data , 'POST')
// 编辑账号
export const reqEditAccount = data => ajax(BASE + 'sys/user/update', data , 'POST')
// 密码重置
export const reqPwdReset = userId => ajax(BASE + 'sys/user/resetPaw', {userId} , 'POST')
// 用户角色配置
export const reqAccIdRoleConfig = data => ajax(BASE + 'sys/user/userRole', data, 'POST')

// 抢红包列表
export const reqRobList = data => ajax(BASE + 'grab/list', data, 'POST')
// 新增抢红包配置项
export const reqAddRob = data => ajax(BASE + 'grab/add', data, 'POST')
// 编辑抢红包配置项
export const reqEditRob = data => ajax(BASE + 'grab/update', data, 'POST')
// 删除抢红包配置项
export const reqDeleteRob = id => ajax(BASE + 'grab/delete', {id}, 'POST')

// 拆红包列表
export const reqOpenList = data => ajax(BASE + 'unpack/list', data, 'POST')
// 新增拆红包配置项
export const reqAddOpen = data => ajax(BASE + 'unpack/add', data, 'POST')
// 编辑拆红包配置项
export const reqEditOpen = data => ajax(BASE + 'unpack/update', data, 'POST')
// 删除拆红包配置项
export const reqDeleteOpen = id => ajax(BASE + 'unpack/delete', {id}, 'POST')

export const getDeviceDetils = (deviceId) => ajax(BASE + `deviceId/${deviceId}`)

// 获取开奖记录列表
export const reqLottery = data => ajax(BASE + 'device/search', data, 'POST')


/*
json请求函数
*/
// export const reqWeather = (city) => {
//     const url = `http;//api.map.baidu.com/telematics/v3/weather?location=${city}%output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
// }