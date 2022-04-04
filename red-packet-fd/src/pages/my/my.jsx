import React, { Component } from 'react'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'
import qr_code from './images/qr_code.png'
import balance from './images/balance.png'
import partner from './images/partner.png'
import record from './images/record.png'
import details from './images/details.png'

import './my.less'

export default class My extends Component {
    constructor(props) {
		super(props)
		this.state = {
			id: null
		}
	}
    componentWillMount() {
        const user = memoryUtils.user
        if (user && user.userId) {
            this.setState({
                id: user.userId
            })
        }
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
    clickButton = () => {

    }
    getMyButton = () => {
        let list = [];
        for (let i = 0; i < 5; i++) {
            list.push({index:i})
        }
        return(
            <div className='my_button'>
                {
                    list.map(item=>{
                        return (
                            <div className='my_button_content' style={{marginRight: item.index !== 6 ? '3%' : ''}} key={item.index} onClick={() => this.clickButton(item)}>
                                <span className='content_img'>
                                    <img src={item.index === 0 ? qr_code : item.index === 1 ? balance :
                                              item.index === 2 ? partner : item.index === 3 ? record : details} alt="qr_code"/>
                                    <div>
                                        {item.index === 0 ? 'QR Code' : item.index === 1 ? 'Balance' :
                                              item.index === 2 ? 'Partner' : item.index === 3 ? 'Record' : 'Details'}
                                    </div>
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    getProxyDetails = () => {
        let proxyDetails = [
            {index: 1, name: '一级代理', percent: 5},
            {index: 2, name: '二级代理', percent: 4},
            {index: 3, name: '三级代理', percent: 3},
            {index: 4, name: '四级代理', percent: 2},
            {index: 5, name: '五级代理', percent: 1},
        ];
        return(
            <div className='my_proxy_content'>
                {
                    proxyDetails.map(item=>{
                        return (
                            <div>{item.index + ' ' + item.name + ':' + item.percent + '%'}</div>
                        )
                    })
                }
            </div>
        )
    }
    render() {
        let { id } = this.state
        return (
            <div className='my'>
                <div className='my_top'>
                    <span style={{color:'#ffffff'}}>ID:{id}</span>
                    <LinkButton onClick={this.Loginout} style={{position: 'absolute', right: '20px'}}>退出</LinkButton>
                </div>
                {this.getMyButton()}
                <div className='my_proxy'>
                    <div>代理说明</div>
                    {this.getProxyDetails()}
                </div>
                <div className='my_proxy' style={{marginTop: '13px'}}>
                    <div>推广步骤</div>
                    <div className='my_proxy_content'>
                        1.点击推广二维码，获取你的专属二维码。<br/>
                        2.让好友扫码进入平台，即可自动绑定好友关系。<br/>
                        3.让好友参与游戏，您可以获得奖励且可直接提现
                    </div>
                </div>
            </div>
        )
    }
}
