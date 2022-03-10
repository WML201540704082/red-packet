//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Select, Card, Modal, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqAccount, reqEditAccount, reqPwdReset } from '../../api'
import AddAcc from './add-acc'
import RoleConfig from './role-config'
const { Option } = Select

export default class Account extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			pageNumber: 1,
			pageSize: 5,
			isModalVisible: false,
			isDisabledVisible: false,
			isResetVisible: false,
			isRoleConfigVisible: false,
			modalType: '',
			accRow: {},
			delFlag: null,
			name: null,
		}
	}
	componentWillMount() {
		this.getDataList()
	}
	componentWillUpdate(nextProps, nexpState) {
		let { isModalVisible, isRoleConfigVisible } = this.state
		if (isModalVisible !== nexpState.isModalVisible || isRoleConfigVisible !== nexpState.isRoleConfigVisible) {
			this.getDataList()
		}
	}
	getDataList = async () => {
		let { delFlag, name, pageNumber,pageSize } = this.state
		let params = {
			current: pageNumber,
			size: pageSize,
			delFlag,
			name
		}
		let result = await reqAccount(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
			})
		}
	}
	confirmDisabled = async (id, type) => {
		let params = {
			id,
			delFlag: type === '禁用' ? '1' : '0',
		}
		let result = await reqEditAccount(params)
		if (result.code === 0) {
			message.success('操作成功！')
			this.setState({
				isDisabledVisible: false
			})
			this.getDataList()
		}
	}
	confirmReset = async (id) => {
		let result = await reqPwdReset(id)
		if (result.code === 0) {
			message.success('密码重置成功！')
			this.setState({
				isResetVisible: false
			})
			this.getDataList()
		}
	}
  	onRow = (accRow) => {
		return {
			onClick: event => { // 点击行
				console.log(accRow)
				this.setState({
					accRow
				})
			}
		}
	}
	render() {
		let { dataSource, pageNumber, pageSize, accRow, delFlag, name, id,isDisabledVisible,type,isResetVisible,isRoleConfigVisible,roleId } = this.state
		// 读取状态数据
		// card的左侧
		const title = (
			<span>
				<Button type={'primary'} icon={<PlusCircleOutlined/>} onClick={() => this.oppModal('新增')}>添加</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id} onClick={() => this.roleConfig(accRow.id,accRow.roleId || 1)}>角色配置</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id} onClick={() => this.pwdReset(accRow.id)}>密码重置</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id} onClick={() => this.disabledModal(accRow.id,'恢复')}>恢复禁用账号</Button>
			</span>
		)
		// card的右侧
		const extra = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>状态:&nbsp;&nbsp;</span>
				<Select 
					value={delFlag}
					style={{width: 120}}
					onChange={value => this.setState({delFlag:value})}
				>
					<Option>全部</Option>
					<Option value="0">使用中</Option>
					<Option value="1">已禁用</Option>
				</Select> &nbsp;&nbsp;
				<span style={{fontSize: '14px',fontWeight: '400'}}>昵称:</span>
				<Input
					value={name}
					placeholder='请输入昵称'
					style={{width:200, margin: '0 15px'}}
					onChange={event => this.setState({name:event.target.value})}
				/>
				<Button type='primary' onClick={() => this.getDataList()}>搜索</Button>
			</span>
		)
		return (
			<div>
				<Card title={title} extra={extra}>
					<Table
						bordered
						rowKey="id"
						dataSource={dataSource}
						pagination={{current: pageNumber,pageSize: pageSize,showQuickJumper: true,onChange: this.onPageChange}}
						rowSelection={{type: 'radio',selectedRowKeys: [accRow.id]}}
						onRow={this.onRow}
						columns={[
							{
								title: '登录账号',
								dataIndex: 'account',
								key: 'account',
							},
							{
								title: '所属角色',
								dataIndex: 'roleName',
								key: 'roleName',
							},
							{
								title: '昵称',
								dataIndex: 'name',
								key: 'name',
							},
							{
								title: '状态',
								dataIndex: 'delFlag',
								key: 'delFlag',
								render: delFlag =>  delFlag === "0" ? '使用中' : '已禁用'
							},
							{
								title: <span style={{ fontWeight: 700 }}>操作</span>,
								key: 'id',
								align: 'center',
								width: '20%',
								render: reload => {
									return (
										<span>
											<Button type={'link'} onClick={() => this.oppModal('修改', reload)}>编辑</Button>
											<Button type={'link'} onClick={() => this.disabledModal(reload.id, '禁用')}>禁用</Button>
										</span>
									)
								},
							},
						]}
					/>
					<Modal
						title="禁用"
						visible={isDisabledVisible}
						onOk={() => this.confirmDisabled(id,type)}
						onCancel={() => {this.setState({
							isDisabledVisible: false
						})}}
					>
						<span>{type === '禁用' ? '确认禁用该账号吗?' : '确定恢复该禁用账号吗?'}</span>
					</Modal>
					<Modal
						title="密码重置"
						visible={isResetVisible}
						onOk={() => this.confirmReset(id)}
						onCancel={() => {this.setState({
							isResetVisible: false
						})}}
					>
						<span>{'确定密码重置为123456吗?'}</span>
					</Modal>
				</Card>
				{this.showModal(this.state.isModalVisible)}
				{this.showRoleConfig(isRoleConfigVisible, id, roleId)}
			</div>
		)
	}
	onPageChange = (pageNumber, pageSize) => {
		this.setState({
			pageNumber,
			pageSize,
		})
	}

	oppModal = (type, data) => {
		if (data) {
			// 编辑
			let { name, id } = data
			this.setState({
				id: id,
				isModalVisible: true,
				modalType: type,
				listName: name,
			})
		} else {
			// 新增
			this.setState({
				isModalVisible: true,
				modalType: type,
			})
		}
	}
	disabledModal = (id, type) => {
		this.setState({
			id,
			type,
			isDisabledVisible: true
		})
	}
	pwdReset = (id) => {
		this.setState({
			id,
			isResetVisible: true
		})
	}
	// 角色配置
	roleConfig = (id,roleId) => {
		this.setState({
			id,
			roleId,
			isRoleConfigVisible: true,
		})
	}
	showRoleConfig = (flag, id, roleId) => {
		if (flag) {
			return (
				<RoleConfig
					flag={flag}
					closeModal={() => this.setState({isRoleConfigVisible: false,})}
					id={id}
					roleId={roleId}
				/>
			)
		}
	}
	showModal = (flag) => {
		let { id, listName, modalType } = this.state
		if (flag) {
			return (
				<AddAcc
					flag={flag}
					closeModal={() => this.setState({isModalVisible: false, name: ''})}
					id={id}
					name={listName}
					type={modalType}
				/>
			)
		}
	}
}