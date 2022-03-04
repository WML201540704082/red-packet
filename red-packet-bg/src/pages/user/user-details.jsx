//对话框表单组件
import React, { Component } from 'react'
import { Modal, Form } from 'antd'
const { Item } = Form

export default class ModalComponent extends Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      flag: false,
      userRow: {}
    }
  }
  componentWillMount() {
    let { flag, userRow } = this.props
    this.setState({
      flag,
      userRow,
    })
  }
  closeClear = () => {
    let { closeDatails } = this.props
    closeDatails()
  }

  render() {
    let { flag,userRow } = this.state
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
          <Form labelCol={{span: 4}}>
            <Item label="登录账号">{userRow.deviceId}</Item>
            <Item label="昵称">{userRow.deviceName}</Item>
            <Item label="密码">{userRow.deviceName}</Item>
            <Item label="确认密码" hasFeedback>{userRow.deviceName}</Item>
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