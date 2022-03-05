import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import LinkButton from '../link-button'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
    }

    getTime = () => {
        // 每隔1s获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000);
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与payh一样，item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    }

    /*
    退出登录
    */
    Loginout = () => {
        // 显示确认狂
        Modal.confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到Login
                this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
        })
    }

    /*
     第一次render()之后执行一次
     一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount() {
        // 获取当前的时间
        this.getTime()
    }

    /*
    // 不能这么做:不会更新显示
    componentWillMount() {
        this.title = this.getTitle()
    } 
    */

    /*
     当前组件写在之前调用 
    */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {

        const {currentTime} = this.state

        const account = memoryUtils.user.account

        // 得到当前需要显示的title
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{account}</span>
                    {/* <span style={{cursor:'pointer'}} onClick={this.Loginout}>退出</span> */}
                    <LinkButton onClick={this.Loginout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/* <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather" />
                        <span>晴</span> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)