import React, { Component } from 'react'
import { Carousel, message } from 'antd'
import open from './images/open.png'
import { reqUnpackLottery, reqGrabCount, reqCarouselInfo } from '../../api'
import close from '../grab/images/close.png'
import './open.less'

export default class Open extends Component {
    constructor(props) {
		super(props)
		this.state = {
            redPacketShow: false,
            winnerObject: {},
            animation: false,
            status: 0,  // 0: 等待拆开 1: 拆开后
            redPacketAmount: null,
            amountFlag: false,
            carouselList: [123,234,567]
		}
	}
    componentWillMount() {
        // 获取已抢红包个数
        this.getGrabCount()
        // 获取轮番图信息
        this.getCarouselInfo()
    }
    // 获取已抢红包个数
    getGrabCount = async () => {
        let result = await reqGrabCount()
        if (result.code === 0) {
            this.setState({
                redPacketAmount: result.data,
                amountFlag: result.data ? false : true
            })
        }
    }
    // 获取轮番图信息
    getCarouselInfo = async () => {
        let result = await reqCarouselInfo({flag:false})
        if (result.code === 0) {
            this.setState({
                carouselList: [result.data.amount]
            })
            this.getCarouselInfo_2()
        }
    }
    getCarouselInfo_2 = async () => {
        let result = await reqCarouselInfo({flag:true})
        if (result.code === 0) {
            this.setState({
                carouselList: (result.data.disResp || result.data.grabResp) ? result.data.disResp.concat(result.data.grabResp) : result.data.randomResp
            })
        }
    }
    oepnRedPacket = () => {
        let { winnerObject, redPacketAmount, amountFlag, status } = this.state
        if (amountFlag) {
            return(
                <div className='go_grab_outer'>
                    <div className='shadow' onClick={() => this.setState({redPacketShow: false})}></div>
                    <div className='go_grab'>
                        <div className='go_grab_top'>
                            <div className='go_grab_top_top'>温馨提示！</div>
                            <div className='go_grab_top_bottom'>
                                <div className='go_grab_top_bottom_inner'>您没有未拆红包请先抢红包</div>
                            </div>
                        </div>
                        <div className='go_grab_bottom'>
                            <div className='go_grab_button' onClick={() => this.props.history.push("/grab")}>马上去抢</div>
                        </div>
                    </div>
                </div>
            )
        } else {
            if (redPacketAmount) {
                if (status === 0) {
                    return(
                        <div className='redpack_outer'>
                            <div className='redpack'>
                                <div className='topcontent' style={{borderRadius: '10px 10px 50% 50% / 10px 10px 15% 15%'}}>恭喜发财，大吉大利</div>
                                <div id='redpack-open' className={this.state.animation ? 'rotate' : ''} onClick={this.openRedPacket.bind(this)}>開</div>
                            </div>
                            <div className='bottom_close'>
                                <img src={close} onClick={() => this.setState({redPacketShow: false})} alt="" />
                            </div>
                        </div>
                    )
                } else {
                    return(
                        <div className='redpack_outer'>
                            <div className='redpack'>
                                <div className='redpack_top'>
                                    <div>恭喜您中奖了</div>
                                </div>
                                <div className='redpack_middle'>
                                    <div>{winnerObject.name}:{winnerObject.amount}</div>
                                </div>
                            </div>
                            <div className='bottom_close'>
                                <img src={close} onClick={() => this.setState({redPacketShow: false, status: 0})} alt="" />
                            </div>
                        </div>
                    )
                }
            }
        }
    }
    openRedPacket = async () => {
        let result = await reqUnpackLottery()
        if (result.code === 0) {
            this.setState({
                winnerObject: result.data
            })
            this.setState({animation: true});
            setTimeout(this.stopAnimation.bind(this), 2000);
            setTimeout(this.showResult.bind(this), 2000);
        } else {
            message.error(result.msg)
        }
    }
    stopAnimation() {
        this.setState({animation: false});
    }
    showResult() {
        this.setState({status: 1});
    }
    openShow = () => {
        let { carouselList } = this.state
        let list = [];
        for (let i = 0; i < 15; i++) {
            list.push({index:i})
        }
        return(
            <div>
                <div className='carousel'>
                    <div className='carousel_content'>
                        <Carousel autoplay effect='fade' dotPosition='right'>
                            {
                                carouselList.map(item=>{
                                    return(
                                        <div className='content_item'>{item}</div>
                                    )
                                })
                            }
                        </Carousel>
                    </div>
                </div>
                <div className='openImg'>
                    {
                        list.map(item=>{
                            return (
                                <div className='openContent' key={item.index} onClick={() => this.setState({redPacketShow: true})}>
                                    <span className='content_img'>
                                        <img src={open} alt="open"/>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className='open'>
                {this.openShow()}
                {this.state.redPacketShow ? this.oepnRedPacket() : null}
            </div>
        )
    }
}
