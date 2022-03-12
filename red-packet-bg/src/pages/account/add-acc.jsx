//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddAccount, reqEditAccount } from '../../api'
const { Item } = Form

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			type: '',
			id: 0,
		}
	}
	componentWillMount() {
		let { flag, id, name, type, dataSource } = this.props
		this.setState({
			flag,
			id,
			name,
			type,
			dataSource,
		})
	}
	componentDidMount() {
		let { account, name, passWord, confirmPwd } = this.state
		this.formRef.current.setFieldsValue({ account })
		this.formRef.current.setFieldsValue({ name })
		this.formRef.current.setFieldsValue({ passWord })
		this.formRef.current.setFieldsValue({ confirmPwd })
	}
	closeClear = () => {
		let { closeModal } = this.props
		this.formRef.current.resetFields() //清空表单
		closeModal()
	}

	render() {
		let { flag, type } = this.state
		return (
		<Modal 
			title={type} 
			visible={flag} 
			onOk={this.handleOk} 
			onCancel={() => this.closeClear()} 
			cancelText="取消" 
			okText="确定"
		>
			{
			type === '新增' ? 
			<Form labelCol={{span: 4}} ref={this.formRef}>
				<Input type='password' style={{position: 'absolute', top: '-999px'}} />
				<Item name="account" label="登录账号" hasFeedback rules={[{ required: true, message: '登录账号不可以为空!' }]}>
					<Input allowClear placeholder="请输入登录账号！" onChange={this.changeAccount} />
				</Item>
				<Item name="name" label="昵称" hasFeedback rules={[{ required: true, message: '昵称不可以为空!' }]}>
					<Input allowClear placeholder="请输入昵称！" onChange={this.changeName} />
				</Item>
				<Item name="passWord" label="密码" hasFeedback rules={[{ required: true, message: '密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入密码！" onChange={this.changePwd} />
				</Item>
				<Item name="confirmPwd" label="确认密码" hasFeedback rules={[{ required: true, message: '确认密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入确认密码！" onChange={this.changeConfirmPwd} />
				</Item>
			</Form> : 
			<Form labelCol={{span: 4}} ref={this.formRef}>
				<Item name="name" label="昵称" hasFeedback rules={[{ required: true, message: '昵称不可以为空!' }]}>
					<Input allowClear placeholder="请输入昵称！" onChange={this.changeName} />
				</Item>
			</Form>
			}
		</Modal>
		)
	}
	changeAccount = e => {
		this.setState({
			account: e.target.value,
		})
	}
	changeName = e => {
		this.setState({
			name: e.target.value,
		})
	}
	changePwd = e => {
		this.setState({
			passWord: e.target.value,
		})
	}
	changeConfirmPwd = e => {
		this.setState({
			confirmPwd: e.target.value,
		})
	}

	handleOk = async () => {
		let { closeModal } = this.props
		let { type, account, name, passWord, confirmPwd, id } = this.state
		if (type === '新增') {
			if (!account) return message.info('账号不可以为空！')
			if (!name) return message.info('昵称不可以为空！')
			if (!passWord) return message.info('密码不可以为空！')
			if (passWord !== confirmPwd) return message.info('密码与确认密码需一致！')
			let params = {
				account,
				name,
				passWord
			}
			let result = await reqAddAccount(params)
			if (result.code === 0) {
				message.success('账号添加成功！')
				this.formRef.current.setFieldsValue({ account: undefined,name: undefined,passWord: null,confirmPwd: null}) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.msg)
			}
			closeModal()
		}
		if (type === '修改') {
			if (!name) return message.info('name不可以为空!')
			let params = {
				id,
				name,
			}
			let result = await reqEditAccount(params)
			if (result.code === 0) {
				message.success('账号修改成功！')
				this.formRef.current.setFieldsValue({ name: undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.msg)
			}
			closeModal()
		}
	}
}