//对话框表单组件
import React, { Component } from 'react'
import { Modal, Form } from 'antd'
import { reqUserDetails } from '../../api'
const { Item } = Form

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			userId: null,
			userDetails: {}
		}
	}
	componentWillMount() {
		let { flag, userId } = this.props
		this.setState({
			flag,
			userId,
		})
		this.getUserDetail(userId)
	}
	getUserDetail = async (userId) => {
		let result = await reqUserDetails(userId)
        if (result.code === 0) {
            this.setState({
                userDetails: result.data
            })
        }
	}
	closeClear = () => {
		let { closeDatails } = this.props
		closeDatails()
	}

	render() {
		let { flag, userDetails } = this.state
		return (
		<Modal 
			title="用户详情"
			visible={flag}
			onOk={this.handleOk}
			onCancel={() => this.closeClear()} 
			cancelText="取消" 
			okText="确定"
		>
			{
				<Form labelCol={{span: 6}}>
					<Item label="账号">{userDetails.account}</Item>
					<Item label="昵称">{userDetails.name}</Item>
					<Item label="手机号">{userDetails.phone}</Item>
					<Item label="IP">{userDetails.ip}</Item>
					<Item label="最后登录时间">{userDetails.date}</Item>
				</Form> 
			}
		</Modal>
		)
	}

	handleOk = async () => {
		let { closeDatails } = this.props
		closeDatails()
	}
}