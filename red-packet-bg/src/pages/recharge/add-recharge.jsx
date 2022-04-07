//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddRecharge, reqEditRecharge } from '../../api'
const { Item } = Form

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			type: '',
			id: '',
		}
	}
	componentWillMount() {
		let { flag, id, amount, type, dataSource } = this.props
		this.setState({
			flag,
			id,
			amount,
			type,
			dataSource,
		})
	}
	componentDidMount() {
		let { amount } = this.state
		this.formRef.current.setFieldsValue({ amount })
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
			title={type + '抢红包配置项'}
			visible={flag}
			onOk={this.handleOk}
			onCancel={() => this.closeClear()}
			cancelText="取消"
			okText="确定"
		>
			{
			<Form labelCol={{span: 5}} ref={this.formRef}>
				<Item name="amount" label="充值金额" hasFeedback rules={[{ required: true, message: '充值金额不可以为空!' }]}>
					<Input allowClear placeholder="请输入充值金额！" onChange={this.changeAmount} />
				</Item>
			</Form>
			}
		</Modal>
		)
	}
	changeAmount = e => {
		this.setState({
			amount: e.target.value,
		})
	}

	handleOk = async () => {
		let { closeModal } = this.props
		let { id, amount, type } = this.state
		if (type === '新增') {
			if (!amount) return message.info('抢红包下注金额不可以为空！')
			let params = {
				amount: Number(amount),
			}
			let result = await reqAddRecharge(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('充值配置项添加成功！')
				this.formRef.current.setFieldsValue({ amount: undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.data.msg)
			}
			closeModal()
		}
		if (type === '修改') {
			if (!amount) return message.info('抢红包下注金额不可以为空！')
			let params = {
				id,
				amount: Number(amount),
			}
			let result = await reqEditRecharge(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('充值配置项编辑成功！')
				this.formRef.current.setFieldsValue({ amount: undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.data.msg)
			}
			closeModal()
		}
	}
}