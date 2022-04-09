import React, { Component } from 'react'
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'
import qr_code from './images/qr_code.png'
import balance from './images/balance.png'
import partner from './images/partner.png'
import record from './images/record.png'
import details from './images/details.png'
import Partner from './components/partner'//合伙人
import Withdraw from './components/withdraw'//余额中的提现
import Records from './components/records'//提现记录
import Details from './components/details'//分佣明细
import { reqAccountBalance, reqRechargeConfigList, reqRechargePay } from '../../api'

import './my.less'

export default class My extends Component {
    constructor(props) {
		super(props)
		this.state = {
			id: null,
            balanceObject: {},
            rechargeConfigList: [],
            shareFlag: false,//分享
            balanceFlag: false,//余额
            withdrawFlag: false,//提现
            rechargeFlag: false,//充值
            partnerFlag: false,//我的合伙人
            recordFlag: false,//提现记录
            detailFlag: false,//分佣明细
            moneyId: null,
            clickFlag: 0,
            type: '1',
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
        // 获取充值配置项列表
        this.getRechargeConfigList()
    }
    getAccountBalance = async () => {
        let result = await reqAccountBalance()
        if (result.code === 0) {
            this.setState({
                balanceObject: result.data
            })
        } else {
            message.error(result.msg)
        }
    }
    getRechargeConfigList = async () => {
        let params = {
            current: 0,
	        size: 10
        }
        let result = await reqRechargeConfigList(params)
        if (result.code === 0) {
            this.setState({
                rechargeConfigList: result.data.records
            })
        } else {
            message.error(result.msg)
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
        if (item.index === 0) {
            // 分享
            this.setState({
                shareFlag: true
            })
        } else if (item.index === 1) {
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
            // 充值
            this.setState({
                rechargeFlag: true
            })
        } else if (item.index === 4) {
            // 提现记录
            this.setState({
                recordFlag: true
            })
        } else if (item.index === 5) {
            // 分佣明细
            this.setState({
                detailFlag: true
            })
        }
    }
    getMyButton = () => {
        let list = [];
        for (let i = 0; i < 6; i++) {
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
                                              item.index === 2 ? partner : item.index === 3 ? qr_code : item.index === 4 ? record : details} alt="qr_code"/>
                                    <div>
                                        {item.index === 0 ? 'QR Code' : item.index === 1 ? 'Balance' :
                                              item.index === 2 ? 'Partner' : item.index === 3 ? 'Recharge' : item.index === 4 ? 'Record' : 'Details'}
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
        let { id, shareFlag, balanceFlag, partnerFlag, withdrawFlag, recordFlag, detailFlag, rechargeFlag } = this.state
        return (
            <div style={{width:'100%',height:'100%'}}>
                {shareFlag ? this.showShare() : null}
                {balanceFlag ? this.showBalance() : null}
                {rechargeFlag ? this.showRecharge() : null}
                {
                    (!partnerFlag && !withdrawFlag && !recordFlag && !detailFlag) ? (
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
                {recordFlag ? this.showRecords() : null}
                {detailFlag ? this.showDetails() : null}
            </div>
        )
    }
    showShare = () => {
        let { id } = this.state
        return (
            <div className='share'>
                <div className='share_outer' onClick={() => this.setState({shareFlag: false})}></div>
                <div className='share_content'>
                    <div className='share_content_top'>分享连接，请复制</div>
                    <div className='share_content_middle'>
                        {'http://www.redpz.com/#/grab?userId=' + id} 
                    </div>
                    <div className='share_content_bottom'>
                        <div className='share_button' onClick={() => this.setState({shareFlag:false})}>确定</div>
                    </div>
                </div>
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
                                <div>{balanceObject.commissionBalanceAmount}</div>
                            </div>
                        </div>
                        <div className='balance_content_middle_content'>
                            <div>
                                <div>红包：</div>
                                <div>{balanceObject.redEnvelopeAmount}</div>
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
    // 充值
    showRecharge = () => {
        let { rechargeConfigList } = this.state
        let payList = [{
            type: '1',
            name: 'zalo',
        },{
            type: '2',
            name: 'momo'
        }]
        return (
           <div className='recharge'>
                <div className='recharge_outer' onClick={() => this.setState({rechargeFlag: false})}></div>
                <div className='recharge_content'>
                    <div className='recharge_content_top'>
                        <span>充值</span>
                    </div>
                    <div className='recharge_content_middle'>
                        <div className='recharge_content_middle_top'>
                            {
                                rechargeConfigList.map((item,index)=>{
                                    return (
                                        <div className='recharge_amount' 
                                             onClick={()=>this.setState({clickMoneyFlag:index,moneyId:item.id})} 
                                            style={{color:this.state.clickMoneyFlag === index ? '#ffffff' : '#333333',
                                                    border:this.state.clickMoneyFlag === index ? '1px solid #C99D3F' : '1px solid #333333',
                                                    background:this.state.clickMoneyFlag === index ? '#C99D3F' : '#ffffff',
                                                    width:'30%',height:'45px',lineHeight:'42px',fontFamily:'PingFang-SC-Heavy',
                                                    display:'flex',justifyContent:'center',alignContent:'center',
                                                    borderRadius:'5px'}}>
                                        {item.amount/1000}k</div>
                                    )
                                })
                            }
                        </div>
                        <div className='recharge_content_middle_bottom'>
                            {
                                payList.map((item,index)=>{
                                    return (
                                        <div onClick={()=>this.setState({clickFlag:index,type:item.type})} 
                                            style={{color:this.state.clickFlag === index ? '#ffffff' : '#333333',
                                                    border:this.state.clickFlag === index ? '1px solid #C99D3F' : '1px solid #333333',
                                                    background:this.state.clickFlag === index ? '#C99D3F' : '#ffffff',
                                                    width:'30%',height:'45px',lineHeight:'42px',fontFamily:'PingFang-SC-Heavy',
                                                    display:'flex',justifyContent:'center',alignContent:'center',
                                                    borderRadius:'5px'}}>
                                            <span>{item.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='recharge_content_bottom'>
                        <div className='recharge_button' onClick={() => this.pay()}>确定</div>
                    </div>
               </div>
           </div>
        )
    }
    pay = async () => {
        let { moneyId, type } = this.state
        if (!moneyId) {
           message.warning('请先选择充值金额')
           return 
        } else {
            let params = {
                type: type,
                id: moneyId
            }
            let result = await reqRechargePay(params)
            if (result.code === 0) {
                message.success('充值成功！')
                const w=window.open('about:blank');
                w.location.href=result.data
                this.setState({
                    rechargeFlag: false
                })
                this.getAccountBalance()
            } else {
                message.error(result.msg)
            }
        }
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
    // 提现记录
    showRecords = () => {
        return (
            <Records
                closeModal={() => this.setState({recordFlag: false})}
            />
        )
    }
    // 分佣明细
    showDetails = () => {
        return (
            <Details
                closeModal={() => this.setState({detailFlag: false})}
            />
        )
    }
}
