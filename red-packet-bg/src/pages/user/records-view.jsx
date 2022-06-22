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
			pageNumber: 1,
            pageSize: 5,
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
		debugger
		let { pageNumber, pageSize } = this.state
		let params = {
			current: pageNumber,
			size: pageSize,
			userId
		}
		let result = await reqRedPacketsDetails(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data.records,
				dataTotal: result.data.total
			})
		}
	}
	closeClear = () => {
		let { closeView } = this.props
		closeView()
	}

	render() {
		let { flag, dataSource, pageNumber, pageSize, dataTotal } = this.state
		return (
			<Modal 
				title="红包记录"
				visible={flag}
				onOk={this.closeClear}
				onCancel={() => this.closeClear()} 
				cancelText="取消" 
				okText="确定"
				width='80%'
				style={{marginTop:'-20px'}}
			>
				<Table
					bordered
					// rowKey="id"
					dataSource={dataSource}
					// style={{'height': '500px','overflow': 'auto'}}
					scroll={{ y: '50vh' }}
					pagination={{current: pageNumber,pageSize: pageSize, 
						showQuickJumper: false, 
						showSizeChanger: true, 
						pageSizeOptions: ["5","10","15","20"],
						total: this.state.dataTotal,
						onChange: this.onPageChange,
						onShowSizeChange: this.onPageChange,
						showTotal: (e) => {return `共 ${dataTotal} 条`}}}
					columns={[
						{
							title: '红包ID',
							align: 'center',
							dataIndex: 'id',
							key: 'id',
						},
						{
							title: '投注金额',
							align: 'center',
							dataIndex: 'amount',
							key: 'amount',
						},
						{
							title: '中奖金额',
							align: 'center',
							dataIndex: 'winningAmount',
							key: 'winningAmount',
						},
						{
							title: '投注时间',
							align: 'center',
							dataIndex: 'createDate',
							key: 'createDate',
						},
						{
							title: '中奖时间',
							align: 'center',
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
        },() => {
			this.getRedPacketsList(this.state.userId)
		})
    }
}