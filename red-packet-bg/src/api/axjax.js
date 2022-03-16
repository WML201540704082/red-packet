/*
能发送一步ajax请求的函数模块
封装axios库
函数的返回值promise对象
1. 优化1:统一处理请求异常
    在外层包一个自己创建的promise对象
    在请求出错时，不reject(error),而是显示错误提示
2. 优化2: 异步得到不是response，而是response.data
    在请求成功resolve时:resolve(response.data)
*/
import axios from "axios"
import { message } from "antd";
import memoryUtils from '../utils/memoryUtils'

export default function ajax(url, data={}, type='GET') {

    axios.defaults.headers['Authorization'] = memoryUtils.user.token

    return new Promise((resolve, reject) => {
        let promise
        // 1.执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2.如果成功了，调用resolve(value)
        promise.then(response => {
            resolve(response.data)
        // 3,如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(error => {
            // reject(error)
            message.error('请求出错了:' + error.message)
        })
    })
}