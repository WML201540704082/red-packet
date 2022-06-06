//列表页面
import React, { Component } from 'react'
import { Button, Table, Card, Modal, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqRobList, reqDeleteRob } from '../../api'
import AddRob from './add-rob'
import OpenConfig from './components/openConfig'

export default class RobConfig extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isModalVisible: false,
			isDeleteVisible: false,
			pageNumber: 1,
            pageSize: 10,
			openConfigVisible: false,
			robId:''
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
		let { pageNumber,pageSize } = this.state
		let params = {
			current: pageNumber,
			size: pageSize
		}
		let result = await reqRobList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
				dataTotal: result.data.total
			})
		}
	}
	render() {
		let { dataSource, isDeleteVisible, pageNumber, pageSize, id, dataTotal } = this.state

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
					pagination={{current: pageNumber,pageSize: pageSize, 
						showQuickJumper: false, 
						showSizeChanger: true, 
						pageSizeOptions: ["5","10","15","20"],
						total: this.state.dataTotal,
						onChange: this.onPageChange,
						onShowSizeChange: this.onPageChange,
						showTotal: (e) => {return `共 ${dataTotal} 条`}}}
					scroll={{ y: '55vh' }}
					columns={[
						{
							title: '抢红包下注额度',
							align: 'center',
							dataIndex: 'amount',
							key: 'amount',
						},
						{
							title: '抢红包中奖区间',
							align: 'center',
							key: 'id',
							render: reload =>  {
								return (
									<span>{'[' + reload.begin + ',' + reload.end + ']'}</span>
								)
							}
						},
						{
							title: <span style={{ fontWeight: 700 }}>操作</span>,
							key: 'id',
							align: 'center',
							width: '300px',
							render: reload => {
								return (
									<span>
										<Button type={'link'} onClick={() => this.oppModal('修改',reload)}>编辑</Button>
										<Button type={'link'} onClick={() => this.openConfig(reload.id)}>拆红包配置</Button>
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
			</Card>
			{this.showModal(this.state.isModalVisible, dataSource)}
			{this.showOpenConfig(this.state.openConfigVisible, this.state.robId)}
		</div>
		)
	}
	onPageChange = (pageNumber, pageSize) => {
        this.setState({
            pageNumber,
            pageSize,
        },() => {
			this.getDataList()
		})
    }

	oppModal = (type, data) => {
		if (data) {
			// 编辑
			let { id, amount, begin, end } = data
			this.setState({
				id: id,
				isModalVisible: true,
				modalType: type,
				amount,
				begin,
				end
			})
		} else {
			if (this.state.dataSource.length < 6) {
				// 新增
				this.setState({
					isModalVisible: true,
					modalType: type,
				})
			} else {
				message.warning('最多只能添加6条配置项!')
			}
			
		}
	}
	showModal = (flag, data) => {
		let { id, amount, begin, end, modalType } = this.state
		if (flag) {
		return (
			<AddRob
				flag={flag}
				dataSource={data}
				closeModal={() => this.setState({isModalVisible: false,})}
				id={id}
				amount={amount}
				begin={begin}
				end={end}
				type={modalType}
				/>
			)
		}
	}
	// 拆红包设置
	openConfig = (id) => {
		this.setState({
			openConfigVisible: true,
			robId: id,
		})
	}
	showOpenConfig = (flag, id) => {
		if (flag) {
			return (
				<OpenConfig
					flag={flag}
					robId={id}
					closeModal={() => this.setState({openConfigVisible: false,})}
				/>
			)	
		}
	}
	// 删除
	deleteModal = (id) => {
		this.setState({
			isDeleteVisible: true,
			id,
		})
	}
	deleteRobConfig = async (id) => {
		const result = await reqDeleteRob(id)
		if (result.code === 0) {
			// 更新状态
			this.setState({
				isDeleteVisible: false
			})
			this.getDataList()
		} else {
			message.error(result.msg)
		}
	}
}