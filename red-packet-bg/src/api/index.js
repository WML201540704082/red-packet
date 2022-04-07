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
// 修改密码
export const reqEditPwd = data => ajax(BASE + 'sys/user/updatePaw', data, 'POST')

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

// 充值列表
export const reqRechargeList = data => ajax(BASE + 'recharge/config/list', data, 'POST')
// 新增充值配置项
export const reqAddRecharge = data => ajax(BASE + 'recharge/config/add', data, 'POST')
// 编辑充值配置项
export const reqEditRecharge = data => ajax(BASE + 'recharge/config/update', data, 'POST')
// 删除充值配置项
export const reqDeleteRecharge = id => ajax(BASE + 'recharge/config/delete', {id}, 'POST')

// 获取开奖记录列表
export const reqLottery = data => ajax(BASE + 'sys/account/lotteryList', data, 'POST')
// 获取充值记录列表
export const reqPaid = data => ajax(BASE + 'recharge/list', data, 'POST')
// 获取操作记录列表
export const reqOperate = data => ajax(BASE + 'sys/operateRecord/list', data, 'POST')

// 获取提现列表
export const reqWithdraw = data => ajax(BASE + 'sys/account/withdrawList', data, 'POST')
// 提现审核
export const reqAudit = data => ajax(BASE + 'withdraw/audit', data, 'POST')

// 获取代理列表
export const reqProxyList = data => ajax(BASE + 'acting/detail/list', data, 'POST')
// 获取下级代理列表
export const reqNextProxyList = data => ajax(BASE + 'acting/detail/lowerLevelList', data, 'POST')

// 代理配置列表
export const reqProxyConfigList = data => ajax(BASE + 'acting/list', data, 'POST')
// 新增代理配置项
export const reqAddProxyConfig = data => ajax(BASE + 'acting/add', data, 'POST')
// 编辑代理配置项
export const reqEditProxyConfig = data => ajax(BASE + 'acting/update', data, 'POST')
// 删除代理配置项
export const reqDeleteProxyConfig = id => ajax(BASE + 'acting/delete', {id}, 'POST')

// 获取数据统计列表
export const reqStatistics = data => ajax(BASE + 'basic/indicators/statistics', data, 'POST')
// 开奖概率
export const reqProbability = data => ajax(BASE + 'basic/indicators/drawProbability', data, 'POST')
// 留存
export const reqKeep = data => ajax(BASE + 'basic/indicators/keep', data, 'POST')

// 获取用户列表
export const reqUserList = data => ajax(BASE + 'sys/userManage/list', data, 'POST')
// 获取用户详情
export const reqUserDetails = id => ajax(BASE + `sys/userManage/detail/${id}`)
// 拉黑用户
export const reqShieldUser = data => ajax(BASE + 'sys/userManage/update', data, 'POST')
// 用户抢红包记录明细
export const reqRedPacketsDetails = data => ajax(BASE + 'sys/userManage/redPacketsList', data, 'POST')


/*
json请求函数
*/
// export const reqWeather = (city) => {
//     const url = `http;//api.map.baidu.com/telematics/v3/weather?location=${city}%output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
// }