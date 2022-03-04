//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { reqAddAccount } from '../../api'
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
        let { flag, id, deviceId, deviceName, pwd, confirmPwd, type, dataSource } = this.props
        this.setState({
            flag,
            id,
            deviceId,
            deviceName,
            pwd,
            confirmPwd,
            type,
            dataSource,
        })
    }
    componentDidMount() {
        let { deviceId, deviceName, pwd, confirmPwd } = this.state
        this.formRef.current.setFieldsValue({ deviceId })
        this.formRef.current.setFieldsValue({ deviceName })
        this.formRef.current.setFieldsValue({ pwd })
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
                title={type === '新增' ? '添加奖项' : '编辑奖项'}
                visible={flag}
                onOk={this.handleOk}
                onCancel={() => this.closeClear()}
                cancelText="取消"
                okText="确定"
            >
                {
                <Form labelCol={{span: 5}} ref={this.formRef}>
                    <Item name="deviceId" label="抢红包金额" hasFeedback rules={[{ required: true, message: '红包金额不可以为空!' }]}>
                    <Input allowClear placeholder="请输入红包金额！" onChange={this.changeName} />
                    </Item>
                    <Item label="红包中奖区间">
                        <Item name="pwd" label="起始值" hasFeedback rules={[{ required: true, message: '起始值不可以为空!' }]}>
                            <Input allowClear placeholder="请输入起始值！" onChange={this.changeNick} />
                        </Item>
                        <Item name="pwd" label="结束值" hasFeedback rules={[{ required: true, message: '起始值不可以为空!' }]}>
                            <Input allowClear placeholder="请输入起始值！" onChange={this.changePwd} />
                        </Item>
                    </Item>
                    <Item name="deviceName" label="中奖概率" hasFeedback rules={[{ required: true, message: '中奖概率不可以为空!' }]}>
                    <Input allowClear placeholder="请输入中奖概率！" onChange={this.changeDeviceName} />
                    </Item>
                </Form>
                }
            </Modal>
        )
    }
    changeName = e => {
        this.setState({
            deviceId: e.target.value,
        })
    }
    changeNick = e => {
        this.setState({
            deviceName: e.target.value,
        })
    }
    changePwd = e => {
        this.setState({
            pwd: e.target.value,
        })
    }
    changeDeviceName = e => {
        this.setState({
            deviceName: e.target.value,
        })
    }
    handleOk = async () => {
        let { closeModal, dataSourceFun } = this.props
        let { type, dataSource, deviceId, deviceName } = this.state
        if (type === '新增') {
            if (!deviceId) return message.info('deviceId不可以为空！')
            let result = await reqAddAccount(deviceId,deviceName)
            if (result.code === 200) {
                message.success('账号添加成功！', 1)
                let newDataSource = [...dataSource]
                newDataSource.unshift(result.data)
                dataSourceFun(newDataSource)
                this.formRef.current.setFieldsValue({ deviceId: undefined,deviceName: undefined }) //给表单设置值
                this.formRef.current.resetFields() //清空表单
            } else {
                return message.error(result.msg, 1)
            }
            closeModal()
        }
        if (type === '修改') {
            if (!deviceId) return message.info('deviceId不可以为空！')
            let result = await reqAddAccount(deviceId,deviceName)
            if (result.code === 200) {
                message.success('账号添加成功！', 1)
                let newDataSource = [...dataSource]
                newDataSource.unshift(result.data)
                dataSourceFun(newDataSource)
                this.formRef.current.setFieldsValue({ deviceId: undefined,deviceName: undefined }) //给表单设置值
                this.formRef.current.resetFields() //清空表单
            } else {
                return message.error(result.msg, 1)
            }
            closeModal()
        }
    }
}