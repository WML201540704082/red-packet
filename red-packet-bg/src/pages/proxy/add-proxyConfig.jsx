//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddProxyConfig, reqEditProxyConfig } from '../../api'
import './add-proxyConfig.less'
const { Item } = Form

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			type: '',
			id: null,
		}
	}
	componentWillMount() {
		let { flag, id, level, commissionRatio, type } = this.props
		this.setState({
			flag,
			id,
			level,
			commissionRatio,
			type,
		})
	}
	componentDidMount() {
		let { level, commissionRatio } = this.state
		this.formRef.current.setFieldsValue({ level })
		this.formRef.current.setFieldsValue({ commissionRatio })
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
			title={type + '代理'}
			visible={flag}
			onOk={this.handleOk}
			onCancel={() => this.closeClear()}
			cancelText="取消"
			okText="确定"
		>
			{
			<Form labelCol={{span: 5}} ref={this.formRef}>
				<Item name="level" label="代理等级" hasFeedback rules={[{ required: true, message: '代理等级不可以为空!' }]}>
					<Input allowClear placeholder="请输入代理等级！" onChange={this.changeLevel} />
				</Item>
				<Item name="commissionRatio" label="分佣比例" className='itemInput' hasFeedback rules={[{ required: true, message: '分佣比例不可以为空!' }]}>
					<Input allowClear placeholder="请输入分佣比例！" style={{'width': '95%'}} onChange={this.changeCommissionRatio} />
				</Item>
				<span style={{'float': 'right','marginTop': '-50px'}}>%</span>
			</Form>
			}
		</Modal>
		)
	}
	changeLevel = e => {
		this.setState({
			level: e.target.value,
		})
	}
	changeCommissionRatio = e => {
		this.setState({
			commissionRatio: e.target.value,
		})
	}

	handleOk = async () => {
		let { closeModal } = this.props
		let { id, level, commissionRatio, type } = this.state
		if (type === '新增') {
		if (!level) return message.info('代理等级不可以为空！')
		if (!commissionRatio) return message.info('分佣比例不可以为空！')
		let params = {
			level: Number(level),
			commissionRatio: Number(commissionRatio)
		}
		let result = await reqAddProxyConfig(params)
		if (result.code === 0) {
			message.success('代理配置项添加成功！', 1)
			this.formRef.current.setFieldsValue({ level: undefined,commissionRatio: undefined }) //给表单设置值
			this.formRef.current.resetFields() //清空表单
		} else {
			return message.error(result.msg, 1)
		}
		closeModal()
		}
		if (type === '修改') {
		if (!level) return message.info('代理等级不可以为空！')
		if (!commissionRatio) return message.info('分佣比例不可以为空！')
		let params = {
			id,
			level: Number(level),
			commissionRatio: Number(commissionRatio)
		}
		let result = await reqEditProxyConfig(params)
		if (result.code === 0) {
			message.success('代理配置项编辑成功！', 1)
			this.formRef.current.setFieldsValue({ level: undefined,commissionRatio: undefined }) //给表单设置值
			this.formRef.current.resetFields() //清空表单
		} else {
			return message.error(result.msg, 1)
		}
		closeModal()
		}
	}
}