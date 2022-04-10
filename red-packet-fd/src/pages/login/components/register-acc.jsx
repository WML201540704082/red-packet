//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message, Button, Select } from 'antd'
import { reqSendSms, reqRegister } from '../../../api'
import countryCode from '../countryCode'
const { Item } = Form
const { Option } = Select;

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
            num: 0,
            countryNo: 84,
		}
	}
	componentWillMount() {
		let { flag, shareId } = this.props
		this.setState({
			flag,
            shareId
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
     // 选择国家
     selectCountry = () => {
        return (
            <Select
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.changeCountryNo}
                defaultValue="84"
                style={{width: '135px'}}
            >
                {
                    countryCode.map(item => {
                        return (
                            <Option value={item.phone_code}>{item.english_name + '(+' + item.phone_code + ')'}</Option>
                        )
                    })
                }
            </Select>
        )
    }
    // 发送验证码
    handleSend = async () => {
        let a = 60;
        var reg_tel = /^[0-9]*$/
        if (reg_tel.test(this.state.phone)) {
            let phone = '+' + this.state.countryNo + this.state.phone
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
	render() {
		let { flag, num } = this.state
		return (
		<Modal 
			title="注册" 
			visible={flag} 
			onOk={this.handleOk} 
			onCancel={() => this.closeClear()} 
			cancelText="取消" 
			okText="确定"
		>
			<Form labelCol={{span: 4}} ref={this.formRef}>
				<Input type='password' style={{position: 'absolute', top: '-999px'}} />
				<Item name="account" label="登录账号" hasFeedback rules={[{required:true, message:'登录账号不可以为空!'}]}>
					<Input allowClear placeholder="请输入登录账号！" onChange={e => {this.setState({account: e.target.value})}}/>
				</Item>
				<Item name="passWord" label="密码" hasFeedback rules={[{required: true, message: '密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入密码！" onChange={e => {this.setState({passWord: e.target.value})}}/>
				</Item>
                <Item name="phone" label="手机号" hasFeedback rules={[{required:true, message:'手机号不可以为空!'}]}>
                    {this.selectCountry()}
                    <Input allowClear placeholder="请输入手机号！" style={{width: '50%', marginLeft: '3px'}} onChange={e => {this.setState({phone: e.target.value})}}/>
				</Item>
                <Item name="code" label="验证码" hasFeedback  rules={[{required:true, message: '验证码必须输入!'}]}>
                    <Input
                        placeholder="验证码"
                        style={{width: '75%'}}
                        onChange={event => this.setState({code:event.target.value})}
                    />
                    <Button style={{marginLeft:'3px',color: '#FF0000'}} disabled={num!==0} onClick={this.handleSend}>{num===0?'发送':num+"s"}</Button>
                </Item>
			</Form>
		</Modal>
		)
	}
	handleOk = async () => {
		let { closeModal } = this.props
		let { account, passWord, phone, code, shareId } = this.state
        if (!account) return message.info('账号不可以为空！')
        if (!passWord) return message.info('密码不可以为空！')
        if (!phone) return message.info('手机号不可以为空！')
        if (!code) return message.info('验证码不能为空')
        let params = {
            account,
            passWord,
            phone,
            code,
            userId: shareId
        }
        let result = await reqRegister(params)
        if (result.code === 0) {
            message.success('账号添加成功！')
            this.formRef.current.setFieldsValue({ account: null,passWord: null,phone: null,code: null}) //给表单设置值
            this.formRef.current.resetFields() //清空表单
        } else {
            return message.error(result.msg)
        }
        closeModal()
	}
}