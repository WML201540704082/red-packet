//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Card, DatePicker } from 'antd'
import { reqLottery } from '../../api'
import moment from 'moment';

export default class Lottery extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            pageNumber: 1,
            pageSize: 5,
            keyWord: '',
            beginDate: '', // 开始时间
            endDate: '', // 结束时间
        }
    }
    componentWillMount() {
        this.getDataList()
    }
    getDataList = async () => {
        let { keyWord, pageNumber, pageSize, beginDate, endDate } = this.state
        let params = {
            keyWord,
            beginDate,
            endDate,
            current: pageNumber,
            size: pageSize
        }
        let result = await reqLottery(params)
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
    render() {
        let { dataSource, pageNumber, pageSize, keyWord, dataTotal } = this.state
        // card的左侧
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
                                title: '用户ID',
                                align: 'center',
                                dataIndex: 'userId',
                                key: 'userId',
                            },
                            {
                                title: '红包ID',
                                align: 'center',
                                dataIndex: 'redPacketsId',
                                key: 'redPacketsId',
                            },
                            {
                                title: '奖项',
                                align: 'center',
                                dataIndex: 'awards',
                                key: 'awards',
                            },
                            {
                                title: '抢红包金额',
                                align: 'center',
                                dataIndex: 'redPacketsAmount',
                                key: 'redPacketsAmount',
                            },
                            {
                                title: '中奖金额',
                                align: 'center',
                                dataIndex: 'amount',
                                key: 'amount',
                            },
                            {
                                title: '开奖时间',
                                align: 'center',
                                dataIndex: 'createDate',
                                key: 'createDate',
                            },
                        ]}
                    />
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
}