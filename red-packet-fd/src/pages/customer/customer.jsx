import React, { Component } from 'react'
import { message } from 'antd';
import './customer.less'
import { reqCustomerImg } from '../../api'
import { t } from 'i18next'
import i18n from 'i18next'

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
                <div className='customer_top'>
                    <div className='customer_top_top'>
                        <div className={i18n.language === 'zh' ? 'customer_top_top_content_zh' : i18n.language === 'vie' ? 'customer_top_top_content_vie' : 'customer_top_top_content_en'}>{t('customer.if_you_have_any_questions,please_scan_and_add_zalo_customer_service_friends')}</div>
                    </div>
                    <div className='customer_top_bottom'>
                        <img src={img} alt="" />
                    </div>
                </div>
                <div className='customer_bottom'>
                    {t('customer.tele_account')}：{teleAccount}
                </div>
            </div>
        )
    }
}
