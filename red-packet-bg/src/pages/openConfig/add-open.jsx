//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddOpen, reqEditOpen } from '../../api'
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
		let { flag, id, name, begin, end, probability, type, dataSource } = this.props
		this.setState({
			flag,
			id,
			name,
			begin,
			end,
			probability,
			type,
			dataSource,
		})
	}
	componentDidMount() {
		let { name, begin, end, probability } = this.state
		this.formRef.current.setFieldsValue({ name })
		this.formRef.current.setFieldsValue({ begin })
		this.formRef.current.setFieldsValue({ end })
		this.formRef.current.setFieldsValue({ probability })
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
				title={type + '奖项'}
				visible={flag}
				onOk={this.handleOk}
				onCancel={() => this.closeClear()}
				cancelText="取消"
				okText="确定"
			>
				{
					<Form labelCol={{span: 5}} ref={this.formRef}>
						<Item name="name" label="奖项" rules={[{ required: true, message: '奖项不可以为空!' }]}>
							<Input placeholder="请输入奖项！" onChange={this.changeName} />
						</Item>
						<Item label="中奖金额区间" style={{marginBottom: '0px'}}>
							<Item name="begin" label="起始值" rules={[{ required: true, message: '起始值不可以为空!' }]}>
								<Input placeholder="请输入起始值！" onChange={this.changeBegin} />
							</Item>
							<Item name="end" label="结束值" rules={[{ required: true, message: '起始值不可以为空!' }]}>
								<Input placeholder="请输入终止值！" onChange={this.changeEnd} />
							</Item>
						</Item>
						<Item name="probability" label="中奖概率" rules={[{ required: true, message: '中奖概率不可以为空!' }]}>
							<Input placeholder="请输入中奖概率！" style={{width:'95%'}} onChange={this.changeProbability} />
						</Item>
						<div style={{float:'right',marginTop:'-50px'}}>%</div>
					</Form>
				}
			</Modal>
		)
	}
	changeName = e => {
		this.setState({
			name: e.target.value,
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
	changeProbability = e => {
		this.setState({
			probability: e.target.value,
		})
	}

	handleOk = async () => {
		let { closeModal } = this.props
		let { id, name, begin, end, probability, type } = this.state
		if (type === '新增') {
			if (!name) return message.info('抢红包下注金额不可以为空！')
			if (!begin) return message.info('起始值不可以为空！')
			if (!end) return message.info('终止值不可以为空！')
			if (!probability) return message.info('中奖概率不可以为空！')
			let params = {
				name,
				begin: Number(begin),
				end: Number(end),
				probability: Math.round(probability*100)/100
			}
			let result = await reqAddOpen(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('奖项添加成功！')
				this.formRef.current.setFieldsValue({ name: undefined,begin: undefined,end: undefined,probability:undefined}) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.msg)
			}
			closeModal()
		}
		if (type === '修改') {
			if (!name) return message.info('抢红包下注金额不可以为空！')
			if (!begin) return message.info('起始值不可以为空！')
			if (!end) return message.info('终止值不可以为空！')
			if (!probability) return message.info('中奖概率不可以为空！')
			let params = {
				id,
				name,
				begin: Number(begin),
				end: Number(end),
				probability: Math.round(probability*100)/100
			}
			let result = await reqEditOpen(params)
			if (result.code === 0 && result.data.code === 0) {
				message.success('奖项修改成功！')
				this.formRef.current.setFieldsValue({ name: undefined,begin: undefined,end: undefined, probability:undefined }) //给表单设置值
				this.formRef.current.resetFields() //清空表单
			} else {
				return message.error(result.msg)
			}
			closeModal()
		}
	}
}