//对话框表单组件
import React, { Component } from 'react'
import { Modal, Input, Form, message, Tree} from 'antd'
import { reqEditRoleMenu, reqMenu, reqRoleIdMenu } from '../../api'
const { Item } = Form

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
        let { flag, id, name } = this.props
        this.setState({
            flag,
            id,
            name,
        })
        this.getMenuList()
        this.getRoleIdMenu(id)
    }
    getMenuList = async () => {
        const result = await reqMenu()
		if (result.code === 0) {
			const menuList = result.data.map(item => {
                return {
                    ...item,
                    title: item.name,
                    key: item.id
                }
            })
			this.setState({
				menuList
			})
		} else {
			message.error(result.msg)
		}
    }
    getRoleIdMenu = async (id) => {
        const result = await reqRoleIdMenu(id)
		if (result.code === 0) {
			const checkedKeys = result.data.map(item => item.id)
			this.setState({
				checkedKeys
			})
		} else {
			message.error(result.msg)
		}
    }
    closeClear = () => {
        let { closeModal } = this.props
        this.formRef.current.resetFields() //清空表单
        closeModal()
    }

    render() {
        let { flag, name, checkedKeys } = this.state
        const onCheck = (checkedKeys) => {
           this.setState({checkedKeys})
        };
        return (
            <Modal 
                title="菜单权限" 
                visible={flag} 
                onOk={this.handleOk} 
                onCancel={() => this.closeClear()} 
                cancelText="取消" 
                okText="确定"
            >
                <Form labelCol={{span: 4}} ref={this.formRef}>
                    <Item label="角色名称">
                        <Input value={name} disabled/>
                    </Item>
                    <Tree
                        checkable
                        defaultExpandAll
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                        treeData={this.state.menuList}
                    />
                </Form>
            </Modal>
        )
    }

    handleOk = async () => {
        let { closeModal } = this.props
        let { checkedKeys, id } = this.state
        let params = {
            menuId: checkedKeys,
            roleId: id,
        }
        let result = await reqEditRoleMenu(params)
        if (result.code === 0) {
            message.success('菜单配置成功！')
        } else {
            return message.error(result.msg)
        }
        closeModal()
    }
}