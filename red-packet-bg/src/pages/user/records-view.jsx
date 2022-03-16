//对话框表单组件
import React, { Component } from 'react'
import { Modal, Table } from 'antd'
import { reqRedPacketsDetails } from '../../api'

export default class ProxyDetails extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			flag: false,
			userId: null,
			current: 1,
			size: 5
		}
	}
	componentWillMount() {
		let { flag, userId } = this.props
		this.setState({
			flag,
			userId,
		})
		this.getRedPacketsList(userId)
	}
	getRedPacketsList = async (userId) => {
		// let { pageNumber, pageSize } = this.state
		let params = {
			current: 1,
			size: 50,
			userId
		}
		let result = await reqRedPacketsDetails(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
			})
		}
	}
	closeClear = () => {
		let { closeView } = this.props
		closeView()
	}

	render() {
		let { flag, dataSource, pageNumber, pageSize } = this.state
		return (
			<Modal 
				title="红包记录"
				visible={flag}
				onOk={this.closeClear}
				onCancel={() => this.closeClear()} 
				cancelText="取消" 
				okText="确定"
			>
				<Table
					bordered
					rowKey="id"
					dataSource={dataSource}
					style={{'height': '500px','overflow': 'auto'}}
					pagination={{current: pageNumber,pageSize: pageSize,showQuickJumper: true,onChange: this.onPageChange}}
					columns={[
						{
							title: '红包ID',
							dataIndex: 'id',
							key: 'id',
						},
						{
							title: '投注金额',
							dataIndex: 'amount',
							key: 'amount',
						},
						{
							title: '中奖金额',
							dataIndex: 'winningAmount',
							key: 'winningAmount',
						},
						{
							title: '投注时间',
							dataIndex: 'createDate',
							key: 'createDate',
						},
						{
							title: '中奖时间',
							dataIndex: 'lotteryAmount',
							key: 'lotteryAmount',
						},
					]}
				/>
			</Modal>
		)
	}
    onPageChange = (pageNumber, pageSize) => {
        this.setState({
            pageNumber,
            pageSize,
        })
    }
}