//对话框表单组件
import React, { Component } from 'react'
import { Modal, Card, Table, Button, message } from 'antd'
import { reqOpenList, reqDeleteOpen  } from '../../../api'
import { PlusCircleOutlined } from '@ant-design/icons'
import AddOpen from './add-open'

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
			pageNumber: 1,
            pageSize: 10,
		}
	}
	componentWillMount() {
		let { flag, robId } = this.props
		this.setState({
			flag,
			robId,
		},()=>{
			this.getDataList()
		})
	}
	// 获取当前抢红包id下的拆红包列表
	getDataList = async () => {
		let { pageNumber,pageSize,robId } = this.state
		let params = {
			current: pageNumber,
			size: pageSize,
			grabId: robId
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
		let { flag, dataSource, id, isDeleteVisible, pageNumber, pageSize, dataTotal } = this.state
		// card的左侧
		const title = (
			<span>
				<Button type={'primary'} icon={<PlusCircleOutlined/>} onClick={() => this.newModal('新增')}>添加</Button>
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
				width="80%"
			>
				{
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
							scroll={{ y: '40vh' }}
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
									width: '200px',
									render: reload => {
										return (
											<span>
												<Button type={'link'} onClick={() => this.newModal('修改',reload)}>编辑</Button>
												<Button type={'link'} onClick={() => this.deleteModal(reload.id)}>删除</Button>
											</span>
										)
									},
								},
							]}
						/>
					</Card>
				}
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
			</Modal>
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
	newModal = (type, data) => {
		if (data) {
			// 编辑
			let { id, name, begin, end, probability } = data
			this.setState({
				id: id,
				isModalVisible: true,
				modalType: type,
				name,
				begin,
				end,
				probability
			})
		} else {
			// 新增
			this.setState({
				isModalVisible: true,
				modalType: type,
			})
		}
	}
	// 新增or编辑 拆红包配置项
	showModal = (flag, data) => {
		let { id, name, begin, end, probability, modalType, robId } = this.state
		if (flag) {
			return (
				<AddOpen
					flag={flag}
					dataSource={data}
					closeModal={() => this.setState({isModalVisible: false,})}
					grabId={robId}
					id={id}
					name={name}
					begin={begin}
					end={end}
					probability={probability}
					type={modalType}
				/>
			)
		}
	}
	// 删除 拆红包配置项
	deleteModal = (id) => {
		this.setState({
			isDeleteVisible: true,
			id,
		})
	}
	// 删除 拆红包配置项
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