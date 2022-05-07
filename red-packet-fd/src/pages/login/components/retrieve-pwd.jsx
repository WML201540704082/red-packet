//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message, Button } from 'antd'
import { reqSendSms, reqRetrievePwd } from '../../../api'
import countryCode from '../countryCode'
import arrows from '../images/arrows.png'
import CountrySelect from './country-select'
import './retrieve-pwd.less'
import { t } from 'i18next'
const { Item } = Form

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
            num: 0,
            phoneCode: '+84',
            countryFlag: false,
		}
	}
	componentWillMount() {
		let { flag, account } = this.props
		this.setState({
			flag,
            account
		})
	}
	componentDidMount() {
		let { account, passWord, phone, code } = this.state
		this.formRef.current.setFieldsValue({ account })
		this.formRef.current.setFieldsValue({ passWord })
		this.formRef.current.setFieldsValue({ phone })
		this.formRef.current.setFieldsValue({ code })
	}
	closeClear = () => {
		let { closeModal } = this.props
		this.formRef.current.resetFields() //清空表单
		closeModal()
	}
    // 发送验证码
    handleSend = async () => {
        if (!this.state.phone) {
            message.warning(t('login.Please enter your mobile number'))
        } else {
            let a = 60;
            var reg_tel = /^[0-9]*$/
            if (reg_tel.test(this.state.phone)) {
                let phone = this.state.phoneCode.substring(1) + this.state.phone
                let result = await reqSendSms(phone)
                if (result.code === 0) {
                    this.setState({num: a})
                    const t1 = setInterval(()=>{
                        a=a-1
                        this.setState({num: a})
                        if(a === 0){
                            clearInterval(t1)
                        }
                    },1000)
                } else {
                    message.error(result.data.msg)
                }
            }else {
                message.warning(t('login.mobile_number_format_error'))
            }
        }
    }
    // 选择国家代码
    selectCode = () => {
        this.setState({
            countryFlag: true
        })
    }
    showCountrySelect = flag => {
        if (flag) {
            return (
                <CountrySelect
					flag={flag}
                    countryCode={countryCode}
                    goBackModal={()=>this.setState({countryFlag: false})}
					closeModal={(phone_code) => 
                        this.setState({
                            countryFlag: false,
                            phoneCode: '+' + phone_code
                        })
                    }
				/>
            )
        }
    }
	render() {
		let { flag, num, phoneCode, countryFlag } = this.state
		return (
            <div className='retrieve-pwd'>
                {
                    !countryFlag ? (
                        <Modal 
                            title={t('login.retrieve_password')}
                            visible={flag}
                            closable={false}
                            onOk={this.handleOk}
                            onCancel={() => this.closeClear()} 
                            cancelText={t('my.cancel')} 
                            okText={t('my.sure')}
                        >
                            <Form labelCol={{span: 4}} ref={this.formRef}>
                                <Input type='password' style={{position: 'absolute', top: '-999px'}} />
                                <Item name="account" label={t('login.login_account')} hasFeedback rules={[{required:true, message: t('login.Please enter the account')}]}>
                                    <Input placeholder={t('login.Please enter the account')} onChange={e => {this.setState({account: e.target.value})}}/>
                                </Item>
                                <Item name="passWord" label={t('login.new_password')} hasFeedback rules={[{required: true, message: t('login.Please enter the password')}]}>
                                    <Input.Password placeholder={t('login.Please enter the password')} onChange={e => {this.setState({passWord: e.target.value})}}/>
                                </Item>
                                <Item name="phone" label={t('login.phone_number')} hasFeedback rules={[{required:true, message: t('login.Please enter your mobile number')}]}>
                                    <div className='input_outer' style={{display:'flex'}}>
                                        <div className='input_outer' style={{display:'flex'}}>
                                            <span style={{paddingLeft:'10px',marginTop:'4px',}} onClick={()=>this.selectCode()}>{phoneCode}</span>
                                            <img onClick={()=>this.selectCode()} style={{width:'13px',height:'13px',marginTop:'9px',marginLeft:'5px'}} src={arrows} alt="arrows"/>
                                            <Input 
                                                placeholder={t('login.phone_number')}
                                                onChange={event => this.setState({phone:event.target.value})}
                                            />
                                        </div>
                                    </div>
                                </Item>
                                <Item name="code" label={t('login.verification_code')} hasFeedback rules={[{required:true, message:t('login.Please enter your verification code')}]}>
                                    <div className='input_outer' style={{display:'flex'}}>
                                        <Input
                                            placeholder={t('login.verification_code')}
                                            onChange={event => this.setState({code:event.target.value})}
                                        />
                                        <Button style={{float: 'right',marginRight: '1px',borderColor: '#ffffff',color: '#D32940'}} disabled={num!==0} onClick={this.handleSend}>{num===0 ? t('login.send') : num + "s"}</Button>
                                    </div>
                                </Item>
                            </Form>
                        </Modal>
                    ) : (
                        <div>
                            {this.showCountrySelect(this.state.countryFlag)}
                        </div>
                    )
                }
            </div>
		)
	}
	handleOk = async () => {
		let { closeModal } = this.props
		let { account, passWord, phone, code } = this.state
        if (!account) return message.info(t('login.Please enter the account'))
        if (!passWord) return message.info(t('login.Please enter the password'))
        if (!phone) return message.info(t('login.Please enter your mobile number'))
        if (!code) return message.info(t('login.Please enter your verification code'))
        let params = {
            account,
            passWord,
            phone: this.state.phoneCode.substring(1) + phone,
            code
        }
        let result = await reqRetrievePwd(params)
        if (result.code === 0 && result.data.code === 0) {
            message.success(t('login.Password retrieved successfully'))
            this.formRef.current.setFieldsValue({ account: null,passWord: null,phone: null,code: null}) //给表单设置值
            this.formRef.current.resetFields() //清空表单
        } else {
            return message.error(result.data.msg)
        }
        closeModal()
	}
}