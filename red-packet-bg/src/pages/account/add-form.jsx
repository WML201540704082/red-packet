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
            <Item name="deviceId" label="登录账号" hasFeedback rules={[{ required: true, message: '登录账号不可以为空!' }]}>
              <Input allowClear placeholder="请输入登录账号！" onChange={this.changeName} />
            </Item>
            <Item name="deviceName" label="昵称" hasFeedback rules={[{ required: true, message: '昵称不可以为空!' }]}>
              <Input allowClear placeholder="请输入昵称！" onChange={this.changeNick} />
            </Item>
            <Item name="pwd" label="密码" hasFeedback rules={[{ required: true, message: '密码不可以为空!' }]}>
              <Input allowClear placeholder="请输入密码！" onChange={this.changePwd} />
            </Item>
            <Item name="confirmPwd" label="确认密码" hasFeedback rules={[{ required: true, message: '确认密码不可以为空!' }]}>
              <Input allowClear placeholder="请输入确认密码！" onChange={this.changeConfirmPwd} />
            </Item>
          </Form> : 
          <Form labelCol={{span: 4}} ref={this.formRef}>
            <Item name="deviceName" label="昵称" hasFeedback rules={[{ required: true, message: '昵称不可以为空!' }]}>
              <Input allowClear placeholder="请输入昵称！" onChange={this.changeNick} />
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
  changeConfirmPwd = e => {
    this.setState({
      confirmPwd: e.target.value,
    })
  }

  handleOk = async () => {
    let { closeModal, dataSourceFun } = this.props
    let { type, dataSource, deviceId, deviceName } = this.state
    if (type === '新增') {
      if (!deviceId) return message.info('deviceId不可以为空！')
      if (!deviceName) return message.info('deviceName不可以为空！')
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
      if (!deviceName) return message.info('deviceName不可以为空！')
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