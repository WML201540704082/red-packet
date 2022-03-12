import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons'
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import LinkButton from '../link-button'
import { reqQuit } from '../../api'
import UpdatePwd from './update-pwd'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        updatePwdVisible: false,
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
            onOk: async () => {
                const result = await reqQuit()
                if (result.code === 0) {
                    console.log('退出调用接口成功')
                } else {
                    console.log('退出调用接口失败')
                }
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

    // 修改密码
    showUpdatePwd = (flag) => {
		if (flag) {
			return (
				<UpdatePwd
					flag={flag}
					closeModal={() => this.setState({updatePwdVisible: false})}
                    exitAcc={() => this.props.history.replace('/login')}
				/>
			)
		}
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
        const menu = (
            <Menu>
                <Menu.Item>
                    <LinkButton onClick={this.Loginout}>退出</LinkButton>
                </Menu.Item>
                <Menu.Item>
                    <LinkButton onClick={() => this.setState({updatePwdVisible: true})}>修改密码</LinkButton>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="header">
                <div className="header-top">
                    <span style={{'marginRight': '-5px'}}>欢迎，</span>
                    <Dropdown overlay={menu}>
                        <LinkButton>
                            <span>{account}</span><DownOutlined />
                        </LinkButton>
                    </Dropdown>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/* <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather" />
                        <span>晴</span> */}
                    </div>
                </div>
				{this.showUpdatePwd(this.state.updatePwdVisible)}
            </div>
        )
    }
}

export default withRouter(Header)