//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Select, Card } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqAccount } from '../../api'
import Modal from './add-form'
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
			modalType: '',
			accRow: {},
			searchType: '',
			searchName: '',
		}
	}
	componentWillMount() {
		this.getDataList()
	}
	componentWillUpdate(nextProps, nexpState) {
		let { isModalVisible } = this.state
		if (isModalVisible !== nexpState.isModalVisible) {
			this.getDataList()
		}
	}
	getDataList = async () => {
		let { searchType, searchName } = this.state
		let params = {
			searchType,
			searchName
		}
		let result = await reqAccount(params)
		if (result.code === 200) {
		this.setState({
			dataSource: result.data,
		})
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
		let { dataSource, pageNumber, pageSize, accRow, searchType, searchName } = this.state
		// 读取状态数据
		// card的左侧
		const title = (
			<span>
				<Button type={'primary'} icon={<PlusCircleOutlined/>} onClick={() => this.oppModal('新增')}>添加</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id}>角色配置</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id}>密码重置</Button> &nbsp;&nbsp;
				<Button type='primary' disabled={!accRow.id}>恢复禁用账号</Button>
			</span>
		)
		// card的右侧
		const extra = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>角色名称:&nbsp;&nbsp;</span>
				<Select 
					value={searchType}
					style={{width: 120}}
					onChange={value => this.setState({searchType:value})}
				>
					<Option value="1">使用中</Option>
					<Option value="2">已禁用</Option>
				</Select> &nbsp;&nbsp;
				<span style={{fontSize: '14px',fontWeight: '400'}}>角色名称:</span>
				<Input 
					value={searchName}
					placeholder='请输入角色名称'
					style={{width:200, margin: '0 15px'}}
					onChange={event => this.setState({searchName:event.target.value})}
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
						dataIndex: 'deviceId',
						key: 'deviceId',
					},
					{
						title: '所属角色',
						dataIndex: 'deviceName',
						key: 'deviceName',
					},
					{
						title: '昵称',
						dataIndex: 'id',
						key: 'addidress',
					},
					{
						title: '状态',
						dataIndex: 'upgradeStatus',
						key: 'upgradeStatus',
						render: (upgradeStatus) =>  upgradeStatus === 0 ? '使用中' : '已禁用'
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
									<Button type={'link'} onClick={() => this.oppModal('修改', reload)}>禁用</Button>
								</span>
							)
						},
					},
					]}
				/>
				</Card>
				{this.showModal(this.state.isModalVisible, dataSource)}
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
			let { deviceId, deviceName, pwd, confirmPwd, id } = data
			this.setState({
				id: id,
				isModalVisible: true,
				modalType: type,
				deviceId: deviceId,
				deviceName: deviceName,
				pwd: pwd,
				confirmPwd: confirmPwd,
			})
		} else {
		// 新增
			this.setState({
				isModalVisible: true,
				modalType: type,
			})
		}
	}
	showModal = (flag, data) => {
		let { id, deviceId, deviceName, modalType } = this.state
		if (flag) {
			return (
				<Modal
					flag={flag}
					dataSource={data}
					dataSourceFun={value => this.setState({ dataSource: value })}
					closeModal={() => this.setState({isModalVisible: false,})}
					id={id}
					deviceId={deviceId}
					deviceName={deviceName}
					type={modalType}
				/>
			)
		}
	}
}