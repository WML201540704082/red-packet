import React, { Component } from 'react'
import { message } from 'antd';
import './customer.less'
import { reqCustomerImg } from '../../api'

export default class Customer extends Component {
    state = {
        img: '',
        teleAccount: ''
    }
    componentWillMount() {
        // 客服图片
        this.getCustomerImg()
    }
    getCustomerImg = async () => {
        let result = await reqCustomerImg()
		if (result.code === 0) {
			this.setState({
				img: result.data.url,
                teleAccount: result.data.teleAccount
			})
		} else {
            message.error(result.msg)
        }
    }
    render() {
        let { img, teleAccount } = this.state
        return (
            <div className='customer'>
                {/* 'http://admin.redpz.com/img/6.jpeg' */}
                <div className='customer_top'>
                    <div className='customer_top_top'>
                        <div className='customer_top_top_content'>有任何问题请扫描添加Zalo客服好友</div>
                    </div>
                    <div className='customer_top_bottom'>
                        <img src={img} alt="" />
                    </div>
                </div>
                <div className='customer_bottom'>
                    Tele账号：{teleAccount}
                </div>
            </div>
        )
    }
}
