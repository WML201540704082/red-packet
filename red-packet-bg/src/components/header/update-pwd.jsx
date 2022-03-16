//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqEditPwd } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
const { Item } = Form

export default class UpdatePwd extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
		}
	}
	componentWillMount() {
		let { flag } = this.props
		this.setState({
			flag
		})
	}
	closeClear = () => {
		let { closeModal, exitAcc } = this.props
		this.formRef.current.resetFields() //清空表单
		closeModal()
        exitAcc()
	}

	render() {
		let { flag } = this.state
		return (
		<Modal 
			title="修改密码" 
			visible={flag} 
			onOk={this.handleOk} 
			onCancel={() => this.closeClear()} 
			cancelText="取消" 
			okText="确定"
		>
			<Form labelCol={{span: 4}} ref={this.formRef}>
				<Input type='password' style={{position: 'absolute', top: '-999px'}} />
				<Item name="passWord" label="原密码" hasFeedback rules={[{ required: true, message: '原密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入原密码！" onChange={this.changePwd} />
				</Item>
				<Item name="newPassWord" label="新密码" hasFeedback rules={[{ required: true, message: '新密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入新密码！" onChange={this.changeNewPwd} />
				</Item>
				<Item name="confirmPwd" label="确认密码" hasFeedback rules={[{ required: true, message: '确认密码不可以为空!' }]}>
					<Input.Password allowClear placeholder="请输入确认密码！" onChange={this.changeConfirmPwd} />
				</Item>
			</Form>
		</Modal>
		)
	}
	changePwd = e => {
		this.setState({
			passWord: e.target.value,
		})
	}
    changeNewPwd = e => {
		this.setState({
			newPassWord: e.target.value,
		})
	}
	changeConfirmPwd = e => {
		this.setState({
			confirmPwd: e.target.value,
		})
	}

	handleOk = async () => {
		let { exitAcc } = this.props
		let { passWord, newPassWord, confirmPwd } = this.state
        if (!passWord) return message.info('原密码不可以为空！')
        if (!newPassWord) return message.info('新密码不可以为空！')
        if (newPassWord !== confirmPwd) return message.info('新密码与确认密码需一致！')
        let params = {
            passWord,
            newPassWord
        }
        let result = await reqEditPwd(params)
        if (result.code === 0 && result.data === null) {
            message.success('密码修改成功，请重新登录！')
            this.formRef.current.setFieldsValue({ passWord: undefined,newPassWord: undefined,confirmPwd: undefined}) //给表单设置值
            this.formRef.current.resetFields() //清空表单
            // 删除保存的user数据
            storageUtils.removeUser()
            memoryUtils.user = {}
            // 跳转到Login
            exitAcc()
        } else {
            return message.error(result.data.msg)
        }
	}
}