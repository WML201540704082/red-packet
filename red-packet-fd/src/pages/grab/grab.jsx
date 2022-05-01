import React, { Component } from 'react'
import { message, Radio } from 'antd'
import './grab.less'
import { reqGrabList, reqAccountBalance, reqGrabBet, reqRechargePay, reqPayOrderInfo } from '../../api'
import grab from './images/grab.png'
import zalo from './images/zalo.png'
import momo from './images/momo.png'
import close from './images/close.png'
import tag from './images/tag.png'
import memoryUtils from '../../utils/memoryUtils'
// 首页路由
export default class Grab extends Component {
    constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
            imgFlag: false,
            amount: null,
            rechargeFlag: false,
            type: '1',
            rechargeAmount: 0,
            redPacketId: null
		}
	}
    componentWillMount() {
        let aaa = this.props.location.search
        // let aaa = "?id=123"
        if (aaa) {
            this.setState({
                shareId: aaa.substring(6)
            })
        }
        // 账户余额
        this.getAccountBalance()
        // 抢红包配置列表
        this.getGrabList()
    }
    getAccountBalance = async () => {
        let result = await reqAccountBalance()
        if (result.code === 0) {
            this.setState({
                amount: result.data.amount
            })
        }
    }
    getGrabList = async () => {
		let params = {
			current: 0,
			size: 100,
		}
		let result = await reqGrabList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
			})
		} else {
            this.setState({
				dataSource: [
                    {amount: 5000,end: 20000},
                    {amount: 10000,end: 100000},
                    {amount: 20000,end: 200000},
                    {amount: 50000,end: 500000},
                    {amount: 80000,end: 800000},
                    {amount: 100000,end: 1000000},
                ]
			})
        }
	}
    grabRedPacket = async (item) => {
        let { shareId } = this.state
        const user = memoryUtils.user
        if (user && user.userId) {
            if (this.state.amount < item.amount) {
                message.warning('余额不足，请先充值！')
                this.setState({
                    rechargeFlag: true,
                    rechargeAmount: item.amount,
                    redPacketId: item.id
                })
            } else {
                // 抢红包
                let params = {
                    id: item.id
                }
                let result = await reqGrabBet(params)
                if (result.code === 0) {
                    this.setState({
                        dataSource: result.data.records,
                        imgFlag: true
                    })
                } else {
                    message.error(result.msg)
                }
            }
        } else {
            message.warning('请先登录！')
            this.props.history.push({
                pathname:'/login',
                state:{
                    shareId
                }
            })
        }
    }
        
    redPacketShow = (dataSource) => {
        if (dataSource && dataSource.length > 0) {
            return(
                <div>
                    <div style={{position:'absolute',top:'5%',left:'30px',padding:'3px 8px',borderRadius:'5px',display:'flex',justifyContent:'center',backgroundColor:'#ffffff',color:'#AC2A22',fontSize:'12px'}}>账户余额:{this.state.amount}</div>
                    <div style={{display:'flex',flexDirection:'column',marginTop:'30%'}}>
                        {/* <div style={{display:'flex',justifyContent:'center',color:'#FEFFA7',fontSize:'32px',fontFamily:'FZZDHJW--GB1-0'}}>2022最给力必赚平台</div> */}
                        <div style={{display:'flex',justifyContent:'center',color:'#FEFFA7',fontSize:'32px',fontFamily:'FZZDHJW--GB1-0'}}></div>
                        <div className='grabImg'>
                            {
                                dataSource.map(item=>{
                                    return (
                                        <div className='grabContent' key={item.id} onClick={() => this.grabRedPacket(item)}>
                                            <span className='content_img'>
                                                <img style={{width:'90px'}} src={grab} alt="grab"/>
                                                {/* <span className={item.amount<10000 ? 'span1w': item.amount<100000 ? 'span10w' : item.amount<1000000 ? 'span100w' : 'span1000w'}>{item.amount/1000}k</span> */}
                                                <span className="grab_span">{item.amount/1000}k</span>
                                            </span>
                                            <div className='content_text_outer'>
                                                <span className='content_text'>最高可抢{item.end/1000}k</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* <div style={{width:'40px'}} onClick={() => this.props.history.push("/open")}> */}
                        <div style={{width:'20px',height:'20px',lineHeight:'20px',backgroundColor:'red',
                            borderRadius:'10px',position:'absolute',bottom:'100px',right:'40px',zIndex:'2',
                            color:'#ffffff',fontSize:'17px',textAlign:'center'}}>9</div>
                        <img style={{width:'40px',position:'absolute',bottom:'70px',right:'20px'}} src={tag} alt="tag"/>
                    {/* </div> */}
                </div>
            )
        }
    }
    // 充值
    showRecharge = () => {
        let payList = [{
            type: '1',
            name: 'zalo',
        },{
            type: '2',
            name: 'momo'
        }]
        return (
           <div className='recharge_show'>
                <div className='recharge_show_outer'></div>
                <div className='recharge_show_content'>
                    <img src={close} style={{width:'20px',height:'20px',position:'absolute',top:'-40px',right:'5px'}} onClick={() => this.setState({rechargeFlag: false})} alt="" />
                    <div className='recharge_show_content_top'>
                        <div style={{fontSize:'20px',fontWeight:'bold'}}>充值</div>
                        <div style={{fontSize:'16px',fontFamily:'PingFang-SC-Regular'}}>请选择支付通道</div>
                    </div>
                    <div className='recharge_show_content_middle'>
                        <Radio.Group defaultValue={'1'}>
                            {
                                payList.map(item=>{
                                    return (
                                        <Radio style={{paddingRight: item.type === '1' ? '20px' : '',paddingLeft: item.type === '2' ? '20px' : ''}} onChange={()=>this.setState({type:item.type})} value={item.type}>
                                            <img src={item.type === '1' ? zalo : momo} style={{width:'40px',height:'40px'}} alt="" />
                                        </Radio>
                                    )
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className='recharge_show_content_bottom'>
                        <div className='recharge_button' onClick={() => this.pay()}>去充值</div>
                    </div>
               </div>
           </div>
        )
    }
    pay = async () => {
        let { type, rechargeAmount, redPacketId } = this.state
        let params = {
            type: type,
            id: null,
            amount: rechargeAmount
        }
        let result = await reqRechargePay(params)
        if (result.code === 0) {
            let repeat = 400
            let timer = setInterval(() => {
                if (repeat === 0) {
                    clearInterval(timer)
                } else {
                    let params111 = {
                        id: redPacketId,
                        ticket: result.data.ticket
                    }
                    reqPayOrderInfo(params111).then(res => {
                        if (res.code === 0) {
                            if (res.data) {
                                this.setState({
                                    imgFlag: true
                                })
                                clearInterval(timer)
                            }
                        }
                    })
                }
            },1500)
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
    showImg = () => {
        let { imgFlag } = this.state
        if (imgFlag) {
            return(
                <div className='img_show'>
                    <div className='img_show_outer'></div>
                    <div className='img_show_content'>
                        <img src={close} style={{width:'20px',height:'20px',position:'absolute',top:'-12px',right:'28px'}} onClick={() => this.setState({imgFlag: false})} alt="" />
                        <div className='img_show_content_top'>恭喜您获得一个红包</div>
                        <div className='img_show_content_bottom' onClick={() => this.props.history.push("/open")}>去拆红包</div>
                    </div>
                </div>
            )
        }
    }

    render() {
        let { dataSource, rechargeFlag } = this.state
        return (
            <div className="grab">
                {this.redPacketShow(dataSource)}
                {this.showImg()}
                {rechargeFlag ? this.showRecharge() : null}
            </div>
        )
    }
}
