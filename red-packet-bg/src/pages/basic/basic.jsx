//列表页面
import React, { Component } from 'react'
import { Button, Table, Card, DatePicker } from 'antd'
import { reqStatistics } from '../../api'
import moment from 'moment';

export default class Basic extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            beginDate: '', // 开始时间
            endDate: '', // 结束时间
        }
    }
    componentWillMount() {
        this.getDataList()
    }
    getDataList = async () => {
        let { beginDate, endDate } = this.state
        let params = {
            beginDate,
            endDate,
        }
        let result = await reqStatistics(params)
        if (result.code === 0) {
            this.setState({
                dataSource: result.data,
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
    render() {
        let { dataSource } = this.state
        // 读取状态数据
        // card的左侧
        const title = (
            <span>
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
            </span>
        )
        // card的右侧
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
                        rowKey="id"
                        dataSource={dataSource}
                        columns={[
                            {
                                title: '抢红包数',
                                dataIndex: 'envelopesNumber',
                                key: 'envelopesNumber',
                            },
                            {
                                title: '拆红包数',
                                dataIndex: 'envelopesRemoveNumber',
                                key: 'envelopesRemoveNumber',
                            },
                            {
                                title: '抢红包总额',
                                dataIndex: 'envelopesTotalAmount',
                                key: 'envelopesTotalAmount',
                            },
                            {
                                title: '新增注册',
                                dataIndex: 'newRegistration',
                                key: 'newRegistration',
                            },
                            {
                                title: '新增访客',
                                dataIndex: 'newVisitors',
                                key: 'newVisitors',
                            },
                            {
                                title: '登陆总数',
                                dataIndex: 'totalLogins',
                                key: 'totalLogins',
                            },
                            {
                                title: '开奖总额',
                                dataIndex: 'totalPrize',
                                key: 'totalPrize',
                            },
                            {
                                title: '充值总额',
                                dataIndex: 'totalRecharge',
                                key: 'totalRecharge',
                            },
                            {
                                title: '提现总额',
                                dataIndex: 'totalWithdrawal',
                                key: 'totalWithdrawal',
                            },
                            {
                                title: '访客总数',
                                dataIndex: 'visitorsTotalNumber',
                                key: 'visitorsTotalNumber',
                            },
                        ]}
                    />
                </Card>
            </div>
        )
    }
}