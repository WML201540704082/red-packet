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
import Partner from './components/partner'
import Withdraw from './components/withdraw'
import { reqAccountBalance } from '../../api'

import './my.less'

export default class My extends Component {
    constructor(props) {
		super(props)
		this.state = {
			id: null,
            balanceObject: {},
            balanceFlag: false,//余额
            withdrawFlag: false,//提现
            partnerFlag: false,//我的合伙人
            recordFlag: false,//提现记录
		}
	}
    componentWillMount() {
        const user = memoryUtils.user
        if (user && user.userId) {
            this.setState({
                id: user.userId
            })
        }
        // 获取账户余额
        this.getAccountBalance()
    }
    getAccountBalance = async () => {
        let result = await reqAccountBalance()
        if (result.code === 0) {
            this.setState({
                balanceObject: result.data
            })
        } else {
            this.setState({
                balanceObject: {
                    amount: 100
                }
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
    clickButton = (item) => {
        if (item.index === 1) {
            // 余额
            this.setState({
                balanceFlag: true
            })
            
        } else if (item.index === 2) {
            // 我的伙伴
            this.setState({
                partnerFlag: true
            })
        } else if (item.index === 3) {
            // 提现记录
            this.setState({
                recordFlag: true
            })
        }
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
        let { id, balanceFlag, partnerFlag, withdrawFlag } = this.state
        return (
            <div style={{width:'100%',height:'100%'}}>
                {balanceFlag ? this.showBalance() : null}
                {
                    (!partnerFlag && !withdrawFlag) ? (
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
                    ) : null
                }
                {partnerFlag ? this.showPartner() : null}
                {withdrawFlag ? this.showWithdraw() : null}
            </div>
        )
    }
    // 余额
    showBalance = () => {
        let { balanceObject } = this.state
        return (
           <div className='balance'>
                <div className='balance_outer' onClick={() => this.setState({balanceFlag: false})}></div>
                <div className='balance_content'>
                    <div className='balance_content_top'>
                        <div style={{fontSize:'20px'}}>当前余额</div>
                        <div style={{fontWeight:'bold',fontSize:'26px',fontFamily:'PingFang-SC-Heavy'}}>{balanceObject.amount || 9000000}</div>
                    </div>
                    <div className='balance_content_middle'>
                        <div className='balance_content_middle_content' style={{borderRight: '1px solid #E5E5E5'}}>
                            <div>
                                <div>分佣：</div>
                                <div>{balanceObject.commissionBalanceAmount || 8000000}</div>
                            </div>
                        </div>
                        <div className='balance_content_middle_content'>
                            <div>
                                <div>红包：</div>
                                <div>{balanceObject.redEnvelopeAmount || 1000000}</div>
                            </div>
                        </div>
                    </div>
                    <div className='balance_content_bottom'>
                        <div className='withdrawal_button' onClick={() => this.setState({balanceFlag:false,withdrawFlag:true})}>去提现</div>
                    </div>
               </div>
           </div>
        )
	}
    // 合伙人
    showPartner = () => {
        return (
            <Partner
                closeModal={() => this.setState({partnerFlag: false})}
            />
        )
	}
    // 提现
    showWithdraw = () => {
        return (
            <Withdraw
                balanceAmount={this.state.balanceObject.amount}
                closeModal={() => this.setState({balanceFlag: true,withdrawFlag: false})}
                sureModal={() => this.setState({balanceFlag: false,withdrawFlag: false})}
            />
        )
    }
}
