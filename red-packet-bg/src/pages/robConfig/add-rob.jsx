//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddRob, reqEditRob } from '../../api'
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
		let { flag, id, amount, begin, end, type, dataSource } = this.props
		this.setState({
			flag,
			id,
			amount,
			begin,
			end,
			type,
			dataSource,
		})
	}
	componentDidMount() {
		let { amount, begin, end } = this.state
		this.formRef.current.setFieldsValue({ amount })
		this.formRef.current.setFieldsValue({ begin })
		this.formRef.current.setFieldsValue({ end })
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
				<Item name="amount" label="抢红包金额" hasFeedback rules={[{ required: true, message: '红包金额不可以为空!' }]}>
				<Input allowClear placeholder="请输入红包金额！" onChange={this.changeAmount} />
				</Item>
				<Item label="红包中奖区间">
					<Item name="begin" label="起始值" hasFeedback rules={[{ required: true, message: '起始值不可以为空!' }]}>
						<Input allowClear placeholder="请输入起始值！" onChange={this.changeBegin} />
					</Item>
					<Item name="end" label="结束值" hasFeedback rules={[{ required: true, message: '起始值不可以为空!' }]}>
						<Input allowClear placeholder="请输入终止值！" onChange={this.changeEnd} />
					</Item>
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
	changeBegin = e => {
		this.setState({
			begin: e.target.value,
		})
	}
	changeEnd = e => {
		this.setState({
			end: e.target.value,
		})
	}

	handleOk = async () => {
		let { closeModal } = this.props
		let { id, amount, begin, end, type } = this.state
		if (type === '新增') {
			if (!amount) return message.info('抢红包下注金额不可以为空！')
			if (!begin) return message.info('起始值不可以为空！')
			if (!end) return message.info('终止值不可以为空！')
			let params = {
				amount: Number(amount),
				begin: Number(begin),
				end: Number(end)
			}
			let result = await reqAddRob(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('抢红包配置项添加成功！')
				this.formRef.current.setFieldsValue({ amount: undefined,begin: undefined,end: undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.data.msg)
			}
			closeModal()
		}
		if (type === '修改') {
			if (!amount) return message.info('抢红包下注金额不可以为空！')
			if (!begin) return message.info('起始值不可以为空！')
			if (!end) return message.info('终止值不可以为空！')
			let params = {
				id,
				amount: Number(amount),
				begin: Number(begin),
				end: Number(end)
			}
			let result = await reqEditRob(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('抢红包配置项编辑成功！')
				this.formRef.current.setFieldsValue({ amount: undefined,begin: undefined,end: undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.data.msg)
			}
			closeModal()
		}
	}
}