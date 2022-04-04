import React, { Component } from 'react'
import { message } from 'antd'
import './grab.less'
import { reqGrabList } from '../../api'
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
		}
	}
    componentWillMount() {
        this.getGrabList()
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
        const user = memoryUtils.user
        if (user && user.userId) {
            this.setState({
                imgFlag: true
            })
        } else {
            message.warning('请先登录！')
            this.props.history.push("/login")
        }
    }
        
    redPacketShow = (dataSource) => {
        if (dataSource && dataSource.length > 0) {
            return(
                <div className='grabImg'>
                    {
                        dataSource.map(item=>{
                            return (
                                <div className='grabContent' key={item.id} onClick={() => this.grabRedPacket(item)}>
                                    <span className='content_img'>
                                        <img src={grab} alt="grab"/>
                                        <span className={item.amount<10000 ? 'span1w': item.amount<100000 ? 'span10w' : 'span100w'}>{item.amount/1000}k</span>
                                    </span>
                                    <span className='content_text'>最高可抢{item.end/1000}k</span>
                                </div>
                            )
                        })
                    }
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
