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
    + (date.getMonth().toString().length === 1 ? ('0' + date.getMonth()) : date.getMonth()) + '-' 
    + (date.getDate().toString().length === 1 ? ('0' + date.getDate()) : date.getDate()) + ' ' 
    + (date.getHours().toString().length === 1 ? ('0' + date.getHours()) : date.getHours()) + ':' 
    + (date.getMinutes().toString().length === 1 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' 
    + (date.getSeconds().toString().length === 1 ? ('0' + date.getSeconds()) : date.getSeconds())
}