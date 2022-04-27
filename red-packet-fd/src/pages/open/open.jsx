import React, { Component } from 'react'
import { message } from 'antd'
import open from './images/open.png'
import { reqUnpackLottery } from '../../api'
import close from '../grab/images/close.png'
import './open.less'

export default class Open extends Component {
    constructor(props) {
		super(props)
		this.state = {
            redPacketShow: false,
            winnerObject: {},
            animation: false,
            status: 0  // 0: 等待拆开 1: 拆开后
		}
	}
    oepnRedPacket = () => {
        let { winnerObject } = this.state
        if (this.state.status === 0) {
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
        let list = [];
        for (let i = 0; i < 15; i++) {
            list.push({index:i})
        }
        return(
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
