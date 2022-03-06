//列表页面
import React, { Component } from 'react'
import { Button, Table, Card, Modal, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqOpenList, reqDeleteOpen } from '../../api'
import AddOpen from './add-open'

export default class OpenConfig extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isModalVisible: false,
			isDeleteVisible: false,
			pageNumber: 1,
            pageSize: 5,
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
		let result = await reqOpenList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
			})
		}
	}
	render() {
		let { dataSource, isDeleteVisible, pageNumber, pageSize,id } = this.state

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
					pagination={{current: pageNumber,pageSize: pageSize,showQuickJumper: true,onChange: this.onPageChange}}
					columns={[
						{
							title: '奖项',
							dataIndex: 'name',
							key: 'name',
						},
						{
							title: '抢红包中奖区间',
							key: 'id',
							render: reload =>  {
								return (
									<span>{reload.begin + '--' + reload.end}</span>
								)
							}
						},
						{
							title: '中奖概率',
							dataIndex: 'probability',
							key: 'probability',
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
	showModal = (flag, data) => {
		let { id, name, begin, end, probability, modalType } = this.state
		if (flag) {
		return (
			<AddOpen
				flag={flag}
				dataSource={data}
				closeModal={() => this.setState({isModalVisible: false,})}
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
	// 删除
	deleteModal = (id) => {
		this.setState({
			isDeleteVisible: true,
			id,
		})
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
			message.error('获取分类列表失败')
		}
	}
}