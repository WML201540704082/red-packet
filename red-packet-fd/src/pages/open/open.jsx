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
                <div className={dataSource.length < 4 ? 'grabImgSmall' : 'grabImgBig'}>
                    {
                        dataSource.map(item=>{
                            return (
                                <img src={grab} alt="grab" />
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
