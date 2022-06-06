//对话框表单组件
import React, { Component } from 'react'
import { Modal, Card, Table, Button, message } from 'antd'
import { reqOpenList, reqDeleteOpen  } from '../../../api'
import { PlusCircleOutlined } from '@ant-design/icons'

export default class ModalComponent extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			robId: '',
			dataSource: [],
			isDeleteVisible: false,
			isModalVisible: false,
		}
	}
	componentWillMount() {
		let { flag, robId } = this.props
		this.setState({
			flag,
			robId,
		})
		this.getDataList()
	}
	getDataList = async () => {
		let params = {
			current: 0,
			size: 100
		}
		let result = await reqOpenList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
				dataTotal: result.data.total
			})
		}
	}
	componentWillUpdate(nextProps, nexpState) {
		let { isModalVisible } = this.state
		if (isModalVisible !== nexpState.isModalVisible) {
			this.getDataList()
		}
	}
	closeClear = () => {
		let { closeModal } = this.props
		closeModal()
	}

	render() {
		let { flag, dataSource, id, isDeleteVisible } = this.state
		// card的左侧
		const title = (
			<span>
				<Button type={'primary'} icon={<PlusCircleOutlined/>} onClick={() => this.oppModal('新增')}>添加</Button>
			</span>
		)
		return (
		<Modal 
			title="拆红包配置"
			visible={flag}
			onOk={this.handleOk}
			onCancel={() => this.closeClear()}
			cancelText="取消"
			okText="确定"
		>
			{
				<Card title={title}>
					<Table
						bordered
						rowKey="id"
						dataSource={dataSource}
						columns={[
							{
								title: '奖项',
								align: 'center',
								dataIndex: 'name',
								key: 'name',
							},
							{
								title: '拆红包中奖区间',
								align: 'center',
								key: 'id',
								render: reload =>  {
									return (
										<span>{'[' + reload.begin + ',' + reload.end + ']'}</span>
									)
								}
							},
							{
								title: '中奖概率',
								align: 'center',
								key: 'id',
								render: reload =>  {
									return (
										<span>{reload.probability + '%'}</span>
									)
								}
							},
							{
								title: <span style={{ fontWeight: 700 }}>操作</span>,
								key: 'id',
								align: 'center',
								width: '20%',
								render: reload => {
									return (
										<span>
											<Button type={'link'} onClick={() => this.oppModal('修改',reload)}>编辑</Button>
											<Button type={'link'} onClick={() => this.deleteModal(reload.id)}>删除</Button>
										</span>
									)
								},
							},
						]}
					/>
					<Modal
						title="删除"
						visible={isDeleteVisible}
						onOk={() => this.deleteRobConfig(id)}
						onCancel={() => {this.setState({
							isDeleteVisible: false
						})}}
					>
						<span>确认删除该项配置吗?</span>
					</Modal>
					{this.showModal(this.state.isModalVisible, dataSource)}
				</Card>
			}
		</Modal>
		)
	}

	deleteRobConfig = async (id) => {
		const result = await reqDeleteOpen(id)
		if (result.code === 0) {
			// 更新状态
			this.setState({
				isDeleteVisible: false
			})
			this.getDataList()
		} else {
			message.error(result)
		}
	}
}