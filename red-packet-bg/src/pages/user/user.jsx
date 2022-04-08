//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Card, Modal, message, Select, DatePicker } from 'antd'
import { reqUserList, reqShieldUser } from '../../api'
import Details from './user-details'
import RecordsView from './records-view'
import moment from 'moment';
const { Option } = Select

export default class User extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            pageNumber: 1,
            pageSize: 5,
            isRecordsVisible: false,//抢红包记录查看
            isDetailsVisible: false,//用户详情
            isShieldVisible: false,
            keyWord: null,
            userId: null,
            delFlag: null,
            beginDate: '', // 开始时间
            endDate: '', // 结束时间
            type: null
        }
    }
    componentWillMount() {
        this.getDataList()
    }
    // componentWillUpdate(nextProps, nexpState) {
    //     let { isRecordsVisible } = this.state
    //     if (isRecordsVisible !== nexpState.isRecordsVisible) {
    //         this.getDataList()
    //     }
    // }
    getDataList = async () => {
        let { keyWord, pageNumber, pageSize, delFlag, beginDate, endDate, type } = this.state
        let params = {
            keyWord,
            delFlag,
            beginDate,
            endDate,
            current: pageNumber,
            size: pageSize,
            type
        }
        let result = await reqUserList(params)
        if (result.code === 0) {
            this.setState({
                dataSource: result.data.records,
                dataTotal: result.data.total
            })
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
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            type: sorter.columnKey === 'amount' && sorter.order === 'ascend' ? 1 : 
                  sorter.columnKey === 'amount' && sorter.order === 'descend' ? 2 :
                  sorter.columnKey === 'rechargeTotal' && sorter.order === 'ascend' ? 3 : 
                  sorter.columnKey === 'rechargeTotal' && sorter.order === 'descend' ? 4 :
                  sorter.columnKey === 'incomeTotal' && sorter.order === 'ascend' ? 5 : 
                  sorter.columnKey === 'incomeTotal' && sorter.order === 'descend' ? 6 : null
        },()=>{
            this.getDataList()
        })
    };
    render() {
        let { dataSource, pageNumber, pageSize, keyWord, isShieldVisible, delFlag, dataTotal } = this.state
        const title = (
            <span>
                <Input 
                    value={keyWord}
                    placeholder='用户ID、手机号、FacebookID'
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
                <span style={{fontSize: '14px',fontWeight: '400',marginLeft:'16px'}}>状态:&nbsp;&nbsp;</span>
				<Select 
					value={delFlag}
					style={{width: 120}}
					onChange={value => this.setState({delFlag:value})}
				>
					<Option>全部</Option>
					<Option value="0">正常</Option>
					<Option value="1">黑名单</Option>
				</Select>
            </span>
        )
        const extra = (
            <span>
                <Button type='primary' onClick={() => this.getDataList()}>搜索</Button>
            </span>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey="userId"
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
                        onChange={this.handleTableChange}
                        columns={[
                            {
                                title: '用户ID',
                                align: 'center',
                                dataIndex: 'userId',
                                key: 'userId',
                                width:'160px'
                            },
                            {
                                title: '用户余额',
                                align: 'center',
                                dataIndex: 'amount',
                                key: 'amount',
                                sorter: true,
                            },
                            {
                                title: '累计充值',
                                align: 'center',
                                dataIndex: 'rechargeTotal',
                                key: 'rechargeTotal',
                                sorter: true,
                            },
                            {
                                title: '累计收益',
                                align: 'center',
                                dataIndex: 'incomeTotal',
                                key: 'incomeTotal',
                                sorter: true,
                            },
                            {
                                title: '最近登录时间',
                                align: 'center',
                                dataIndex: 'endDate',
                                key: 'endDate',
                                width:'160px'
                            },
                            {
                                title: '状态',
                                align: 'center',
                                dataIndex: 'delFlag',
                                key: 'delFlag',
                                render: delFlag => delFlag === '0' ? '正常' : '黑名单',
                            },
                            {
                                title: '抢红包记录',
                                align: 'center',
                                render: reload => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.recordsView(reload.userId)}>查看</Button>
                                        </span>
                                    )
                                },
                            },
                            {
                                title: '登录类型',
                                align: 'center',
                                dataIndex: 'loginWay',
                                key: 'loginWay',
                                render: loginWay => loginWay === '1' ? '账号' : loginWay === '2' ? 'Facebook' :
                                                    loginWay === '3' ? 'Google' : '手机',
                            },
                            {
                                title: <span style={{ fontWeight: 700 }}>操作</span>,
                                key: 'userId',
                                align: 'center',
                                width: '16%',
                                render: reload => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.openDetails(reload.userId)}>用户详情</Button>
                                            <Button type={'link'} onClick={() => this.userShield(reload.userId, reload.delFlag)}>{reload.delFlag === '0' ? '拉黑' : '恢复'}</Button>
                                        </span>
                                    )
                                },
                            },
                        ]}
                    />
                    <Modal
                        title="拉黑"
                        visible={isShieldVisible}
                        onOk={() => this.confirmShield()}
                        onCancel={() => {this.setState({isShieldVisible: false})}}
                    >
                        <span>{delFlag === '0' ? '确认拉黑用户吗?' : '确认将该用户从黑名单中移除，恢复登录权限吗?'}</span>
                    </Modal>
                    
                </Card>
                {this.showDetails(this.state.isDetailsVisible)}
                {this.showRecordsView(this.state.isRecordsVisible)}
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

    // 抢红包记录查看
    recordsView = (userId) => {
        this.setState({
            isRecordsVisible: true,
            userId
        })
    }
    // 查看红包记录
    showRecordsView = (flag) => {
        if (flag) {
            let { userId } = this.state
            return (
                <RecordsView
                    flag={flag}
                    userId={userId}
                    closeView={() => {this.setState({isRecordsVisible: false})}}
                >
                </RecordsView>
            )
        }
    }
    // 拉黑
    userShield = (userId, delFlag) => {
        this.setState({
            isShieldVisible: true,
            userId,
            shieldFlag: delFlag
        })
    }
    confirmShield = async () => {
        let { userId, shieldFlag } = this.state
        let params = {
			userId,
			delFlag: shieldFlag === '0' ? '1' : '0',
		}
		let result = await reqShieldUser(params)
		if (result.code === 0) {
			message.success('操作成功！')
			this.setState({
				isShieldVisible: false
			})
			this.getDataList()
		}
    }
    openDetails = (userId) => {
        this.setState({
            isDetailsVisible: true,
            userId
        })
    }
    // 用户详情
    showDetails = (flag) => {
        if (flag) {
            let { userId } = this.state
            return (
                <Details
                    flag={flag}
                    userId={userId}
                    closeDatails={() => this.setState({isDetailsVisible: false})}
                />
            )
        }
      }
}