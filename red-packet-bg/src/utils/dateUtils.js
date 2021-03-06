/*
包含n个日期时间处理的工具函数模块
*/

/*
格式化日期
*/
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return date.getFullYear() + '-' 
    + (date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' 
    + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' ' 
    + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' 
    + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' 
    + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds())
}