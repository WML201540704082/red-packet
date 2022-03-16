import React, { Component } from 'react'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'

export default class My extends Component {
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
    render() {
        return (
            <div>
                <LinkButton onClick={this.Loginout}>退出</LinkButton>
            </div>
        )
    }
}
