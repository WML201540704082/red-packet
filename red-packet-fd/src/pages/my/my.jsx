import React, { Component } from 'react'
import { Modal, message, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'
import qr_code from './images/qr_code.png'
import balance from './images/balance.png'
import partner from './images/partner.png'
import recharge from './images/recharge.png'
import record from './images/record.png'
import details from './images/details.png'
import Partner from './components/partner'//合伙人
import Withdraw from './components/withdraw'//余额中的提现
import Records from './components/records'//提现记录
import Details from './components/details'//分佣明细
import { reqAccountBalance, reqRechargeConfigList, reqRechargePay } from '../../api'
import zalo from '../grab/images/zalo.png'
import momo from '../grab/images/momo.png'
import close from '../grab/images/close.png'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import './my.less'
import { t } from 'i18next'

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
            title: t('my.confirm_exit'),
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
            okText: t('my.sure'),
            cancelText: t('my.cancel')
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
                            <div className='my_button_content' key={item.index} onClick={() => this.clickButton(item)}>
                                <span className='content_img'>
                                    <img src={item.index === 0 ? qr_code : item.index === 1 ? balance :
                                              item.index === 2 ? partner : item.index === 3 ? recharge : item.index === 4 ? record : details} alt="qr_code"/>
                                    <div>
                                        {item.index === 0 ? t('my.qr_code') : item.index === 1 ? t('my.balance') :
                                              item.index === 2 ? t('my.partner') : item.index === 3 ? t('my.recharge') : item.index === 4 ? t('my.record') : t('my.details')}
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
            {index: 1, name: t('my.first-level_proxy'), percent: 5},
            {index: 2, name: t('my.second-level_proxy'), percent: 4},
            {index: 3, name: t('my.third-level_proxy'), percent: 3},
            {index: 4, name: t('my.fourth-level_proxy'), percent: 2},
            {index: 5, name: t('my.fifth-level_proxy'), percent: 1},
        ];
        return(
            <div className='my_proxy_content'>
                {
                    proxyDetails.map(item=>{
                        return (
                            <div>{item.index + '. ' + item.name + ':' + item.percent + '%'}</div>
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
                                <LinkButton onClick={this.Loginout} style={{position: 'absolute', right: '20px'}}>{t('my.exit')}</LinkButton>
                            </div>
                            {this.getMyButton()}
                            <div className='my_proxy'>
                                <div>{t('my.proxy_describe')}</div>
                                {this.getProxyDetails()}
                            </div>
                            <div className='my_proxy' style={{marginTop: '13px'}}>
                                <div>{t('my.promotion_steps')}</div>
                                <div className='my_proxy_content'>
                                    1. {t('my.Click the promotion QR code to get your own QR code')}<br/>
                                    2. {t('my.Let your friends scan the code to enter the platform, and you can automatically bind your friend relationship')}<br/>
                                    3. {t('my.If you let your friends participate in the game, you can get rewards and withdraw cash directly')}
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
                <div className='share_content'>
                    <img src={close} onClick={() => this.setState({shareFlag: false})} alt="" />
                    <QRCode
                        id="qrCode"
                        value={'http://www.redpz.com/#/grab?sign=' + id}  //地址
                        size={180} // 二维码的大小
                        fgColor="#000000" // 二维码的颜色
                        style={{ margin: 'auto' }}
                    />
                </div>
                <div className='share_text'>
                    {t('my.your own QR code')}
                </div>
                <div className='share_bottom'>
                    <div className='share_bottom_content' onClick={() => this.copyUrl()}>{t('my.copy_link')}</div>
                </div>
            </div>
        )
    }
    copyUrl = () => {
        let url = 'http://www.redpz.com/#/grab?sign=' + this.state.id
        copy(url)
        message.success(t('my.copy_success'))
    }
    // 余额
    showBalance = () => {
        let { balanceObject } = this.state
        return (
           <div className='balance'>
                <div className='balance_outer' onClick={() => this.setState({balanceFlag: false})}></div>
                <div className='balance_content_outer'>
                    <div className='balance_content'>
                        <div className='balance_content_top'>
                            <div style={{fontSize:'20px'}}>{t('my.current_balance')}</div>
                            <div style={{fontWeight:'bold',fontSize:'26px',fontFamily:'PingFang-SC-Heavy'}}>{balanceObject.amount}</div>
                        </div>
                        <div className='balance_content_middle'>
                            <div className='balance_content_middle_content' style={{borderRight: '1px solid #E5E5E5'}}>
                                <div>
                                    <div>{t('my.commission')}：</div>
                                    <div>{balanceObject.commissionBalanceAmount}</div>
                                </div>
                            </div>
                            <div className='balance_content_middle_content'>
                                <div>
                                    <div>{t('my.red_packet')}：</div>
                                    <div>{balanceObject.redEnvelopeAmount}</div>
                                </div>
                            </div>
                        </div>
                        <div className='balance_content_bottom'>
                            <div className='withdrawal_button' onClick={() => this.setState({balanceFlag:false,withdrawFlag:true})}>{t('my.withdraw_cash')}</div>
                        </div>
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
            name: 'Zalo Pay',
        },{
            type: '2',
            name: 'MoMo Pay'
        }]
        return (
           <div className='recharge'>
                <div className='recharge_outer'></div>
                <div className='recharge_content_outer'>
                    <div className='recharge_content'>
                        <img src={close} style={{width:'20px',height:'20px',position:'absolute',top:'-40px',right:'5px'}} onClick={() => this.setState({rechargeFlag: false})} alt="" />
                        <div className='recharge_content_top'>
                            <span>{t('my.recharge')}</span>
                        </div>
                        <div className='recharge_content_middle'>
                            <div style={{padding:'5px 15px 0'}}>{t('my.Please select recharge amount')}</div>
                            <div className='recharge_content_middle_top'>
                                {
                                    rechargeConfigList.map((item,index)=>{
                                        return (
                                            <div className='recharge_amount' 
                                                onClick={()=>this.setState({clickMoneyFlag:index,moneyId:item.id})} 
                                                style={{color:this.state.clickMoneyFlag === index ? '#D53E1C' : '#333333',
                                                        border:this.state.clickMoneyFlag === index ? '1px solid #C99D3F' : '1px solid #333333',
                                                        background:this.state.clickMoneyFlag === index ? '#FBE4DE' : '#ffffff',
                                                        width:'30%',fontFamily:'PingFang-SC-Heavy',
                                                        display:'flex',justifyContent:'center',alignContent:'center',
                                                        borderRadius:'5px'}}>
                                            {item.amount/1000}k</div>
                                        )
                                    })
                                }
                            </div>
                            <div style={{padding:'0 15px'}}>{t('my.Please select payment method')}</div>
                            <div className='recharge_content_middle_bottom'>
                                {/* {
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
                                } */}
                                <Radio.Group defaultValue={'1'} style={{width:'100%'}}>
                                    {
                                        payList.map(item=>{
                                            return (
                                                <Radio style={{width: '100%',padding:'10px 10px 0px'}} onChange={()=>this.setState({type:item.type})} value={item.type}>
                                                    <img src={item.type === '1' ? zalo : momo} style={{width:'40px',height:'40px'}} alt="" />
                                                    <span style={{paddingLeft:'20px'}}>{item.name}</span>
                                                </Radio>
                                            )
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                        <div className='recharge_content_bottom'>
                            <div className='recharge_button' onClick={() => this.pay()}>{t('my.recharge')}</div>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
    pay = async () => {
        let { moneyId, type } = this.state
        if (!moneyId) {
           message.warning(t('my.Please select recharge amount'))
           return 
        } else {
            let params = {
                type: type,
                id: moneyId
            }
            let result = await reqRechargePay(params)
            if (result.code === 0) {
                var u = navigator.userAgent;
                var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if(isAndroid) {  //android终端
                    let url = result.data.pageurl
                    window.open(url);
                } else if(isiOS) {   //ios终端
                    window.location.href = result.data.pageurl
                } else {
                    const w=window.open('about:blank');
                    w.location.href=result.data.pageurl
                }
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
                sureModal2={() => this.getAccountBalance()}
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
