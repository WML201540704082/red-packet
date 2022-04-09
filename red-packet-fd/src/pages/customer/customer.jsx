import React, { Component } from 'react'
import './customer.less'
import { reqCustomerImg } from '../../api'

export default class Customer extends Component {
    state = {
        img: ''
    }
    componentWillMount() {
        // 客服图片
        this.getCustomerImg()
    }
    getCustomerImg = async () => {
        let result = await reqCustomerImg()
		if (result.code === 0) {
			this.setState({
				img: result.data.url
			})
		} else {
        
        }
    }
    render() {
        let { img } = this.state
        return (
            <div className='customer'>
                {/* 'http://admin.redpz.com/img/6.jpeg' */}
                <img src={img} width="200px" alt="" />
            </div>
        )
    }
}
