import React, { Component } from 'react'
import { Card, Table, Button, message, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {reqRoles} from '../../api'
import AddForm from './add-form'

// 商品分类路由
export default class Role extends Component {

	state = {
		loading: false, // 是否正在获取数据中
		roles: [], // 角色列表
		role: {}, // 选中的role
		isShowAdd: false, // 是否显示添加页面
	}

	/*
	 初始化Table所有列的数组
	*/
	initColums = () => {
		this.columns = [
            {
              title: '设备id',
              dataIndex: 'deviceId',
              key: 'deviceId',
            },
            {
              title: '角色名称',
              dataIndex: 'deviceName',
              key: 'deviceName',
            },
            {
              title: '角色排序',
              dataIndex: 'id',
              key: 'addidress',
            },
            {
                title: '操作',
                                                              
                render: () => (
                    <span>
                        <LinkButton>编辑</LinkButton>
                        <LinkButton>删除</LinkButton>
                    </span>
                )
			},
		];
	}

	/*
	 异步获取列表显示
	 */
	getRoleList = async () => {

		// 在发请求前显示Loading
		this.setState({loading:true})
		// 发异步ajax请求，获取数据
		const result = await reqRoles()
		// 在请求完成后隐藏Loading
		this.setState({loading:false})
		if (result.code === 200) {
			const roles = result.data
			// 更新状态
			this.setState({
				roles
			})
		} else {
			message.error('获取分类列表失败')
		}
	}

	onRow = (role) => {
		return {
			onClick: event => { // 点击行
				console.log(role)
				this.setState({
					role
				})
			}
		}
	}

	/*
	 添加角色
	 */
	addRole = ()  => {

	}

	/*
	 为第一次render()准备数据
	*/
	componentWillMount() {
		this.initColums()
	}

	/*
	 执行异步任务：发异步ajax请求
	*/
	componentDidMount() {
		this.getRoleList()
	}
    render() {

		// 读取状态数据
		const {roles,loading,role,isShowAdd} = this.state

        // card的左侧
        const title = (
			<span>
				<Button type='primary' icon={<PlusCircleOutlined/>} onClick={() => this.setState({isShowAdd: true})}>添加</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!role.id}>角色权限</Button>
			</span>
		)
        // card的右侧
        const extra = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>角色名称:</span>
				<Input placeholder='请输入角色名称' style={{width:200, margin: '0 15px'}}/>
				<Button type='primary'>搜索</Button>
			</span>
        )
          
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='id'
					loading={loading}
                    dataSource={roles}
                    columns={this.columns}
					pagination={{defaultPageSize:5,showQuickJumper:true}}
					rowSelection={{type: 'radio',selectedRowKeys: [role.id]}}
					onRow={this.onRow}
				/>
				<Modal
					title="添加角色"
					visible={isShowAdd}
					onOk={this.addRole}
					onCancel={() => {this.setState({
						isShowAdd: false
					})}}
				>
					<AddForm
						setForm={(form) => this.form = form}
					/>
				</Modal>
            </Card>
        )
    }
}
