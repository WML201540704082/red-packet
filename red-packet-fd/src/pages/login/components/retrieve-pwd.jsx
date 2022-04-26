//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message, Button } from 'antd'
import { reqSendSms, reqRetrievePwd } from '../../../api'
import countryCode from '../countryCode'
import arrows from '../images/arrows.png'
import CountrySelect from './country-select'
import './retrieve-pwd.less'
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
        let a = 60;
        var reg_tel = /^[0-9]*$/
        if (reg_tel.test(this.state.phone)) {
            let phone = this.state.phoneCode.substring(1) + this.state.phone
            let result = await reqSendSms(phone)
            if (result.code === 0) {
                message.success('发送验证码成功！')
            } else {
                message.error('发送验证码失败！')
            }
            this.setState({num: a})
            const t1 = setInterval(()=>{
                a=a-1
                this.setState({num: a})
                if(a === 0){
                    clearInterval(t1)
                }
            },1000)
        }else {
            alert('手机号格式不正确')
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
                            title="找回密码" 
                            visible={flag}
                            closable={false}
                            onOk={this.handleOk}
                            onCancel={() => this.closeClear()} 
                            cancelText="取消" 
                            okText="确定"
                        >
                            <Form labelCol={{span: 4}} ref={this.formRef}>
                                <Input type='password' style={{position: 'absolute', top: '-999px'}} />
                                <Item name="account" label="登录账号" hasFeedback rules={[{required:true, message:'登录账号不可以为空!'}]}>
                                    <Input placeholder="请输入登录账号！" onChange={e => {this.setState({account: e.target.value})}}/>
                                </Item>
                                <Item name="passWord" label="新密码" hasFeedback rules={[{required: true, message: '密码不可以为空!' }]}>
                                    <Input.Password placeholder="请输入密码！" onChange={e => {this.setState({passWord: e.target.value})}}/>
                                </Item>
                                <Item name="phone" label="手机号" hasFeedback rules={[{required:true, message:'手机号不可以为空!'}]}>
                                    <div className='input_outer'>
                                        <span onClick={()=>this.selectCode()}>
                                            <span style={{width:'30px',paddingLeft:'10px'}}>{phoneCode}
                                                <img style={{width:'15px',marginLeft:'5px'}} src={arrows} alt="arrows"/>
                                            </span>
                                        </span>
                                        <Input 
                                            placeholder="手机号"
                                            onChange={event => this.setState({phone:event.target.value})}
                                        />
                                    </div>
                                </Item>
                                <Item name="code" label="验证码" hasFeedback rules={[{required:true, message: '验证码必须输入!'}]}>
                                    <div className='input_outer'>
                                        <Input
                                            placeholder="验证码"
                                            onChange={event => this.setState({code:event.target.value})}
                                        />
                                        <Button style={{float: 'right',marginRight: '3px',borderColor: '#ffffff',color: '#D32940'}} disabled={num!==0} onClick={this.handleSend}>{num===0?'发送':num+"s"}</Button>
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
        if (!account) return message.info('账号不可以为空！')
        if (!passWord) return message.info('密码不可以为空！')
        if (!phone) return message.info('手机号不可以为空！')
        if (!code) return message.info('验证码不能为空')
        let params = {
            account,
            passWord,
            phone,
            code
        }
        let result = await reqRetrievePwd(params)
        if (result.code === 0) {
            message.success('密码找回成功！')
            this.formRef.current.setFieldsValue({ account: null,passWord: null,phone: null,code: null}) //给表单设置值
            this.formRef.current.resetFields() //清空表单
        } else {
            return message.error(result.msg)
        }
        closeModal()
	}
}