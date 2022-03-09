//对话框表单组件
import React, { Component } from 'react'
import { Modal, Table } from 'antd'
import { reqNextProxyList } from '../../api'

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
		this.getNextProxyList(userId)
	}
	getNextProxyList = async (userId) => {
		// let { pageNumber, pageSize } = this.state
		let params = {
			current: 1,
			size: 50,
			userId
		}
		let result = await reqNextProxyList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data,
			})
		}
	}
	closeClear = () => {
		let { closeDatails } = this.props
		closeDatails()
	}

	render() {
		let { flag, dataSource, pageNumber, pageSize } = this.state
		return (
			<Modal 
				title="代理用户列表"
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
							title: 'userId',
							dataIndex: 'userId',
							key: 'userId',
						},
						{
							title: '代理等级',
							dataIndex: 'actingLevel',
							key: 'actingLevel',
						},
						{
							title: '消费金额',
							dataIndex: 'amount',
							key: 'amount',
						},
						{
							title: '分佣金额',
							dataIndex: 'commissionAmount',
							key: 'commissionAmount',
						},
						{
							title: '注册时间',
							dataIndex: 'createDate',
							key: 'createDate',
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