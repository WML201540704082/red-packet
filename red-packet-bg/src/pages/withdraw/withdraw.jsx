//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Select, Card, Modal, DatePicker, message } from 'antd'
import { reqWithdraw, reqAudit } from '../../api'
import moment from 'moment';
const { Option } = Select

export default class Withdraw extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			pageNumber: 1,
			pageSize: 5,
			isModalVisible: false,
			accRow: {},
			audit: null,
			keyWord: null,
			beginDate: null, // 开始时间
            endDate: null, // 结束时间
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
		let { audit, keyWord, pageNumber, pageSize, beginDate, endDate } = this.state
		let params = {
			audit,
			keyWord,
			current: pageNumber,
            size: pageSize,
			beginDate,
            endDate,
		}
		let result = await reqWithdraw(params)
		if (result.code === 0) {
            this.setState({
                dataSource: result.data.records,
				dataTotal: result.data.total
            })
		}
	}
    pass_rejust = async (id) => {
		let { type } = this.state
		let params = {
			id,
			audit: type === 'pass' ? '3' : '2'
		}
		const result = await reqAudit(params)
		if (result.code === 0) {
			// 更新状态
			this.setState({
				isModalVisible: false
			})
			this.getDataList()
		} else {
			message.error(result.message)
		}
	}
	// 开始时间选择器(监控记录日期变换)
	handleStartDateChange = (value, dateString) => {
		this.setState({
			beginDate: dateString,
		});
	};

	// 结束时间选择器(监控记录日期变换)
	handleEndDateChange = (value, dateString) => {
		this.setState({
			endDate: dateString,
		});
	};

	// 结束时间可选范围
	handleEndDisabledDate = (current) => {
		const { beginDate } = this.state;
		if (beginDate !== '') {
		// 核心逻辑: 结束日期不能多余开始日期后60天，且不能早于开始日期
			return current > moment(beginDate).add(60, 'day') || current < moment(beginDate);
		} else {
			return null;
		}
	}

	// 开始时间可选范围
	handleStartDisabledDate = (current) => {
		const { endDate } = this.state;
		if (endDate !== '') {
			// 核心逻辑: 开始日期不能晚于结束日期，且不能早于结束日期前60天
			return current < moment(endDate).subtract(60, 'day') || current > moment(endDate);
		} else {
			return null;
		}
	}
	render() {
		let { dataSource, pageNumber, pageSize, isModalVisible, id, audit, keyWord, type, dataTotal } = this.state
		// 读取状态数据
		// card的左侧
		const title = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>状态:&nbsp;&nbsp;</span>
				<Select 
					value={audit}
					style={{width: 120}}
					onChange={value => this.setState({audit:value})}
				>
					<Option>全部</Option>
					<Option value="1">未审核</Option>
					<Option value="2">审核未通过</Option>
					<Option value="3">审核通过</Option>
					<Option value="4">审核中</Option>
				</Select> &nbsp;&nbsp;
				<Input 
					value={keyWord}
					placeholder='用户ID、手机号、FaceBookID、zaloID'
					style={{width:200, margin: '0 15px'}}
					onChange={event => this.setState({keyWord:event.target.value})}
				/>
				<DatePicker
                    onChange={this.handleStartDateChange}
                    disabledDate={this.handleStartDisabledDate}
                    placeholder="开始日期"
                />
                <span>-</span>
                <DatePicker
                    onChange={this.handleEndDateChange}
                    disabledDate={this.handleEndDisabledDate}
                    placeholder="结束日期"
                />
				<Button type='primary' style={{float:'right'}} onClick={() => this.getDataList()}>搜索</Button>
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
                                title: 'ID',
								align: 'center',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '用户ID',
								align: 'center',
                                dataIndex: 'userId',
                                key: 'userId',
                            },
                            {
                                title: '提现金额',
								align: 'center',
                                dataIndex: 'amount',
                                key: 'amount',
                            },
                            {
                                title: '提现时间',
								align: 'center',
                                dataIndex: 'createDate',
                                key: 'createDate',
                            },
                            {
                                title: '状态',
								align: 'center',
                                dataIndex: 'audit',
                                key: 'audit',
                                render: (audit) =>  audit === '1' ? '未审核' : audit === '2' ? '审核未通过' : audit === '3' ? '审核通过' : '审核中'
                            },
                            {
                                title: <span style={{ fontWeight: 700 }}>操作</span>,
                                key: 'id',
                                align: 'center',
                                render: reload => {
                                    return (
                                        (reload.audit === '1' || reload.audit === '2') ? 
										(<span>
                                            <Button type={'link'} onClick={() => this.oppModal(reload.id,'pass')}>通过</Button>
                                            <Button type={'link'} onClick={() => this.oppModal(reload.id,'reject')}>拒绝</Button>
                                        </span>) : null
                                    )
                                },
                            },
                        ]}
                    />
                    <Modal
                        title={type === 'pass' ?  '通过' : '拒绝'}
                        visible={isModalVisible}
                        onOk={() => this.pass_rejust(id)}
                        onCancel={() => {
                            this.setState({isModalVisible: false})
                        }}
                    >
                        <span>{type === 'pass' ?  '确认通过?' : '确认拒绝?'}</span>
                    </Modal>
				</Card>
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

	oppModal = (id, type) => {
        // 通过
        this.setState({
            id,
            isModalVisible: true,
            type,
        })
	}
}