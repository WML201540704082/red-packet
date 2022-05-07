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
import storageUtils from '../utils/storageUtils'
import memoryUtils from '../utils/memoryUtils'
import '../i18n/config';
import { t } from 'i18next'

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
            if (response.data.code === -1 && response.data.msg === "The token is invalid, please get it again") {
                let index=window.location.hash.lastIndexOf("?")
                let obj=window.location.hash.substring(index,window.location.hash.length)
                message.error(t('identity_expired'))
                storageUtils.removeUser()
                memoryUtils.user = {}
                window.location.href = '/#/login' + obj
            } else if (response.data.code === -1) {
                message.error(response.data.msg)
            } else {
                resolve(response.data)
            }
        // 3,如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(error => {
            // reject(error)
            message.error('请求出错了:' + error.message)
        })
    })
}