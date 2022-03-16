//对话框表单组件
import React, { Component } from 'react'
import { Modal, Form, message, Radio } from 'antd'
import { reqRoles, reqAccIdRoleConfig } from '../../api'

export default class ModalComponent extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            flag: false,
            id: 0,
        }
    }
    componentWillMount() {
        let { flag, id, roleId } = this.props
        this.setState({
            flag,
            id,
            roleId
        })
        this.getRoleList()
    }
    getRoleList = async () => {
        let params = {
            current: 1,
            size: 10000
        }
        const result = await reqRoles(params)
		if (result.code === 0) {
			const roleList = result.data.records
			this.setState({
				roleList
			})
            this.roleMenu = this.getRoleMenu(roleList)
            this.forceUpdate()
		} else {
			message.error('获取角色列表失败')
		}
    }
    getRoleMenu = (roleList) => {
        let { id } = this.state
        return roleList.map(item => {
                return (
                    <Radio.Group defaultValue={id} onChange={this.changeRadio} buttonStyle="solid">
                        <Radio value={item.id}>{item.name}</Radio>
                    </Radio.Group>
                )
            }
        )
    }
    changeRadio = e => {
        this.setState({
            roleId: e.target.value,
        })
    }
    componentDidMount() {
        // let { name } = this.state
        // this.formRef.current.setFieldsValue({ name })
    }
    closeClear = () => {
        let { closeModal } = this.props
        this.formRef.current.resetFields() //清空表单
        closeModal()
    }

    render() {
        let { flag } = this.state
        
        return (
            <Modal 
                title="角色配置" 
                visible={flag} 
                onOk={this.handleOk} 
                onCancel={() => this.closeClear()} 
                cancelText="取消" 
                okText="确定"
            >
                <Form labelCol={{span: 4}} ref={this.formRef}>
                    {this.roleMenu}
                </Form>
            </Modal>
        )
    }

    handleOk = async () => {
        let { closeModal } = this.props
        // let { checkedKeys, id } = this.state
        let { id, roleId } = this.state
        console.log(id)
        console.log(roleId)
        let params = {
            userId: id,
            roleId
        }
        let result = await reqAccIdRoleConfig(params)
        if (result.code === 0) {
            debugger
            message.success('角色配置成功！', 1)
            // this.formRef.current.setFieldsValue({ name: undefined }) //给表单设置值
            // this.formRef.current.resetFields() //清空表单
        } else {
            return message.error(result.msg, 1)
        }
        closeModal()
    }
}