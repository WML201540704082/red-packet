//列表页面
import React, { Component } from 'react'
import { Button, Table, Card, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqAccount } from '../../api'
import AddRob from './add-rob'

export default class RobConfig extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isModalVisible: false,
			isDeleteVisible: false,
			deviceId: ''
		}
	}
	componentWillMount() {
		this.getDataList()
	}
	getDataList = async () => {
		let result = await reqAccount()
		if (result.code === 200) {
			this.setState({
				dataSource: result.data,
			})
		}
	}
	render() {
		let { dataSource, isDeleteVisible, deviceId } = this.state
		// card的左侧
		const title = (
		<span>
			<Button type={'primary'} icon={<PlusCircleOutlined/>} onClick={() => this.oppModal('新增')}>添加</Button>
		</span>
		)
		return (
		<div>
			<Card title={title}>
				<Table
					bordered
					rowKey="id"
					dataSource={dataSource}
					columns={[
						{
							title: '序号',
							dataIndex: 'id',
							key: 'id',
						},
						{
							title: '抢红包下注额度',
							dataIndex: 'deviceName',
							key: 'deviceName',
						},
						{
							title: '抢红包中奖区间',
							dataIndex: 'id',
							key: 'addidress',
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
									<Button type={'link'} onClick={() => this.deleteModal(reload.deviceId)}>删除</Button>
									</span>
								)
							},
						},
					]}
				/>
				<Modal
					title="删除"
					visible={isDeleteVisible}
					onOk={() => this.deleteRobConfig(deviceId)}
					onCancel={() => {this.setState({
						isDeleteVisible: false
					})}}
				>
					<span>确认删除该项配置吗?</span>
				</Modal>
			</Card>
			{this.showModal(this.state.isModalVisible, dataSource)}
		</div>
		)
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
			<AddRob
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
	// 删除
	deleteModal = (deviceId) => {
		this.setState({
			isDeleteVisible: true,
			deviceId,
		})
	}
	deleteRobConfig = (deviceId) => {
		console.log(deviceId)
		debugger
	}
}