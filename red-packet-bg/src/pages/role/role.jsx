import React, { Component } from 'react'
import { Card, Table, Button, message, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import {reqRoles, reqDeleteRole} from '../../api'
import AddModal from './add-role'
import Menu from './menu'

// 商品分类路由
export default class Role extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			loading: false, // 是否正在获取数据中
			roles: [], // 角色列表
			role: {}, // 选中的role
			isModalVisible: false,
            isDeleteVisible: false,
			isMenulVisible: false,
			pageNumber: 1,
			pageSize: 5,
			name: null
		}
	}

	/*
	 初始化Table所有列的数组
	*/
	initColums = () => {
		this.columns = [
            {
              title: '角色名称',
			  align: 'center',
              dataIndex: 'name',
              key: 'name',
            },
            {
                title: '操作',
				align: 'center',
                render: reload => (
                    <span>
						<Button type={'link'} onClick={() => this.oppModal('修改', reload)}>编辑</Button>
						<Button type={'link'} onClick={() => this.deleteModal(reload.id)}>删除</Button>
                    </span>
                )
			},
		];
	}
	oppModal = (type, data) => {
		if (data) {
			// 编辑
			let { name,id } = data
			this.setState({
				id,
				listName: name,
				isModalVisible: true,
				modalType: type,
			})
		} else {
		// 新增
			this.setState({
				isModalVisible: true,
				modalType: type,
			})
		}
	}

	// 删除Modal
	deleteModal = (id) => {
		this.setState({
			isDeleteVisible: true,
			id
		})
	}
	// 确认删除
	confirmDelete = async (id) => {
		const result = await reqDeleteRole(id)
		if (result.code === 0) {
			// 更新状态
			this.setState({
				isDeleteVisible: false
			})
			this.getRoleList()
		} else {
			message.error(result.msg)
		}
    }
	// 菜单权限
	menuPermission = (id) => {
		this.setState({
			id,
			isMenulVisible: true,
		})
	}

	componentWillUpdate(nextProps, nexpState) {
		let { isModalVisible } = this.state
		if (isModalVisible !== nexpState.isModalVisible) {
			this.getRoleList()
		}
	}
	/*
	 异步获取列表显示
	 */
	getRoleList = async () => {

		let { pageNumber, pageSize, name } = this.state
		// 在发请求前显示Loading
		this.setState({loading:true})
		let params = {
			current: pageNumber,
			size: pageSize,
			name
		}
		// 发异步ajax请求，获取数据
		const result = await reqRoles(params)
		// 在请求完成后隐藏Loading
		this.setState({loading:false})
		if (result.code === 0) {
			const roles = result.data.records
			// 更新状态
			this.setState({
				roles,
				dataTotal: result.data.total
			})
		} else {
			message.error(result.msg)
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
	 添加-编辑-角色
	 */
	showModal = (flag) => {
		let { id, listName, modalType } = this.state
		if (flag) {
			return (
				<AddModal
					flag={flag}
					closeModal={() => this.setState({isModalVisible: false,})}
					id={id}
					name={listName}
					type={modalType}
				/>
			)
		}
	}

	showMenu = (flag, id, name) => {
		if (flag) {
			return (
				<Menu
					flag={flag}
					closeModal={() => this.setState({isMenulVisible: false,})}
					id={id}
					name={name}
				/>
			)
		}
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
	onPageChange = (pageNumber, pageSize) => {
		this.setState({
			pageNumber,
			pageSize,
		},() => {
			this.getRoleList()
		})
	}
    render() {

		// 读取状态数据
		const {roles,loading,role,isModalVisible,pageNumber, pageSize,isDeleteVisible,id,isMenulVisible,dataTotal} = this.state

        // card的左侧
        const title = (
			<span>
				<Button type='primary' icon={<PlusCircleOutlined/>} onClick={() => this.oppModal('新增')}>添加</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!role.id} onClick={() => this.menuPermission(role.id)}>菜单权限</Button>
			</span>
		)
        // card的右侧
        const extra = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>角色名称:</span>
				<Input placeholder='请输入角色名称' style={{width:200, margin: '0 15px'}}
					   onChange={event => this.setState({name:event.target.value})}/>
				<Button type='primary' onClick={() => this.getRoleList()}>搜索</Button>
			</span>
        )
          
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
					rowKey={record => record.id}
					loading={loading}
                    dataSource={roles}
                    columns={this.columns}
					pagination={{current: pageNumber,pageSize: pageSize, 
						showQuickJumper: false, 
						showSizeChanger: true, 
						pageSizeOptions: ["5","10","15","20"],
						total: this.state.dataTotal,
						onChange: this.onPageChange,
						onShowSizeChange: this.onPageChange,
						showTotal: (e) => {return `共 ${dataTotal} 条`}}}
					rowSelection={{type: 'radio',selectedRowKeys: [role.id]}}
					onRow={this.onRow}
					scroll={{ y: '55vh' }}
				/>
				<Modal
					title="删除"
					visible={isDeleteVisible}
					onOk={() => this.confirmDelete(id)}
					onCancel={() => {this.setState({
						isDeleteVisible: false
					})}}
				>
					<span>确认删除角色吗?</span>
				</Modal>
				{this.showModal(isModalVisible)}
				{this.showMenu(isMenulVisible, role.id,role.name)}
            </Card>
        )
    }
}
