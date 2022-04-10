import React, { Component } from 'react'
import { message } from 'antd'
import './grab.less'
import { reqGrabList, reqAccountBalance, reqGrabBet } from '../../api'
import grab from './images/grab.png'
// import goOpen from './images/goOpen.png'
import memoryUtils from '../../utils/memoryUtils'
// 首页路由
export default class Grab extends Component {
    constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
            imgFlag: false,
            amount: null,
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
                    <div style={{position:'absolute',top:'70px',left:'30px',padding:'3px 8px',borderRadius:'5px',display:'flex',justifyContent:'center',backgroundColor:'#ffffff',color:'#AC2A22',fontSize:'12px'}}>账户余额:{this.state.amount}</div>
                    <div style={{display:'flex',flexDirection:'column',marginTop:'-50px'}}>
                        <div style={{display:'flex',justifyContent:'center',color:'#FEFFA7',fontSize:'32px',fontFamily:'FZZDHJW--GB1-0'}}>2022最给力必赚平台</div>
                        <div className='grabImg'>
                            {
                                dataSource.map(item=>{
                                    return (
                                        <div className='grabContent' key={item.id} onClick={() => this.grabRedPacket(item)}>
                                            <span className='content_img'>
                                                <img src={grab} alt="grab"/>
                                                <span className={item.amount<10000 ? 'span1w': item.amount<100000 ? 'span10w' : item.amount<1000000 ? 'span100w' : 'span1000w'}>{item.amount/1000}k</span>
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
                </div>
            )
        }
    }

    showImg = () => {
        let { imgFlag } = this.state
        if (imgFlag) {
            return(
                <div className='img_show'>
                    <div className='img_show_outer' onClick={() => this.setState({imgFlag: false})}></div>
                    <div className='img_show_content'>
                        {/* <img src={goOpen} alt="img"/> */}
                        <div className='img_show_content_top'>恭喜您获得一个红包</div>
                        <div className='img_show_content_bottom' onClick={() => this.props.history.push("/open")}>去拆红包</div>
                    </div>
                </div>
            )
        }
    }

    render() {
        let { dataSource } = this.state
        return (
            <div className="grab">
                {this.redPacketShow(dataSource)}
                {this.showImg()}
            </div>
        )
    }
}
