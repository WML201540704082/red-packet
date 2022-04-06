import React, { Component } from 'react'
import open from './images/open.png'
import { reqUnpackLottery } from '../../api'
import './open.less'

export default class Open extends Component {
    constructor(props) {
		super(props)
		this.state = {
            rechargeFlag: false
		}
	}
    oepnRedPacket = async () => {
        let result = await reqUnpackLottery()
        if (result.code === 0) {
            this.setState({
                winningFlag: true
            })
        }
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
                            <div className='openContent' key={item.index} onClick={() => this.oepnRedPacket(item)}>
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
    // 中奖结果弹框
    showWinning = () => {
        return (
           <div className='winner'>
                <div className='winner_outer' onClick={() => this.setState({winnerFlag: false})}></div>
                <div className='winner_content'>
                    <div className='winner_content_top'>
                        <div style={{fontSize:'20px'}}>恭喜您中奖了</div>
                    </div>
                    <div className='winner_content_middle'>
                        <div>1888</div>
                    </div>
                    <div className='balance_content_bottom'>
                        <div className='winner_button' onClick={() => this.setState({winningFlag:false})}>确定</div>
                    </div>
               </div>
           </div>
        )
	}
    render() {
        return (
            <div className='open'>
                {this.openShow()}
                {this.state.winningFlag ? this.showWinning() : null}
            </div>
        )
    }
}
