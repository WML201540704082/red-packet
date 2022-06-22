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
			pageNumber: 1,
			pageSize: 5
		}
	}
	componentWillMount() {
		let { flag, userId } = this.props
		this.setState({
			flag,
			userId,
		},() => {
			this.getNextProxyList()
		})
	}
	getNextProxyList = async () => {
		let { pageNumber, pageSize, userId } = this.state
		let params = {
			current: pageNumber,
			size: pageSize,
			userId
		}
		let result = await reqNextProxyList(params)
		if (result.code === 0) {
			this.setState({
				dataSource: result.data,
				dataTotal: result.data.length
			})
		}
	}
	closeClear = () => {
		let { closeDatails } = this.props
		closeDatails()
	}

	render() {
		let { flag, dataSource, pageNumber, pageSize, dataTotal } = this.state
		return (
			<Modal 
				title="代理用户列表"
				visible={flag}
				onOk={this.closeClear}
				onCancel={() => this.closeClear()} 
				cancelText="取消" 
				okText="确定"
				width='70%'
				style={{marginTop:'-20px'}}
			>
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
						showTotal: () => {return `共 ${dataTotal} 条`}}}
					scroll={{ y: '50vh' }}
					columns={[
						{
							title: 'userId',
							align: 'center',
							dataIndex: 'userId',
							key: 'userId',
						},
						{
							title: '代理等级',
							align: 'center',
							dataIndex: 'actingLevel',
							key: 'actingLevel',
						},
						{
							title: '消费金额',
							align: 'center',
							dataIndex: 'amount',
							key: 'amount',
						},
						{
							title: '分佣金额',
							align: 'center',
							dataIndex: 'commissionAmount',
							key: 'commissionAmount',
						},
						{
							title: '注册时间',
							align: 'center',
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
        },() => {
			this.getNextProxyList()
		})
    }
}