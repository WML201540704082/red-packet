//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddRole, reqEditRole } from '../../api'
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
        let { flag, id, name, type } = this.props
        this.setState({
            flag,
            id,
            name,
            type,
        })
    }
    componentDidMount() {
        let { name } = this.state
        this.formRef.current.setFieldsValue({ name })
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
                <Form labelCol={{span: 4}} ref={this.formRef}>
                    <Item name="name" label="角色名称" hasFeedback rules={[{ required: true, message: '角色名称不可以为空!' }]}>
                        <Input allowClear placeholder="请输入角色名称！" onChange={this.changeName} />
                    </Item>
                </Form>
            </Modal>
        )
    }
    changeName = e => {
        this.setState({
            name: e.target.value,
        })
    }

    handleOk = async () => {
        let { closeModal } = this.props
        let { type, id, name } = this.state
        let params = {
            id,
            name,
        }
        if (type === '新增') {
            if (!name) return message.info('角色名称不可以为空！')
            let result = await reqAddRole(params)
            if (result.code === 0) {
                message.success('角色添加成功！')
                this.formRef.current.setFieldsValue({ name: undefined }) //给表单设置值
                this.formRef.current.resetFields() //清空表单
            } else {
                return message.error(result.msg)
            }
        } else {
            if (!name) return message.info('角色名称不可以为空！')
            let result = await reqEditRole(params)
            if (result.code === 0) {
                message.success('角色编辑成功！')
                this.formRef.current.setFieldsValue({ name: undefined }) //给表单设置值
                this.formRef.current.resetFields() //清空表单
            } else {
                return message.error(result.msg)
            }
        }
        closeModal()
    }
}