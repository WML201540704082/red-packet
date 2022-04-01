import React, { Component } from 'react'
import './open.less'
import { reqGrabList } from '../../api'
import grab from './images/10.png'

// 首页路由
export default class Open extends Component {
    constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
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
		}
	}
    redPacketShow = (dataSource) => {
        if (dataSource && dataSource.length > 0) {
            return(
                <div className='grabImg'>
                    {
                        dataSource.map(item=>{
                            return (
                                <div className='grabContent'>
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
    render() {
        let { dataSource } = this.state
        return (
            <div className="open">
                {this.redPacketShow(dataSource)}
            </div>
        )
    }
}
