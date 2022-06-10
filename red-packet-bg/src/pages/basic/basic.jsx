//列表页面
import React, { Component } from 'react'
import { Button, Table, Card, DatePicker } from 'antd'
import { reqStatistics,reqProbability,reqKeep } from '../../api'
import moment from 'moment';
import './basic.less'

export default class Basic extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            beginDate1: '', // 开始时间
            endDate1: '', // 结束时间
            beginDate2: '', // 开始时间
            endDate2: '', // 结束时间
            beginDate3: '', // 开始时间
        }
    }
    componentWillMount() {
        // 获取数据统计列表
        this.getDataList()
        // 获取开奖概率
        this.getProbabilityList()
        // 获取留存数据
        this.keepList()
    }
    // 获取数据统计列表
    getDataList = async () => {
        let { beginDate1, endDate1 } = this.state
        let params = {
            beginDate: beginDate1,
            endDate: endDate1,
        }
        let result = await reqStatistics(params)
        if (result.code === 0) {
            this.setState({
                dataSource: [result.data],
            })
        }
    }
    // 开奖概率
    getProbabilityList = async () => {
        let { beginDate2, endDate2 } = this.state
        let params = {
            beginDate: beginDate2,
            endDate: endDate2,
        }
        let result = await reqProbability(params)
        if (result.code === 0) {
            let forList = []
            let frontArray = [{
                name: '奖项',
                probability: '开奖概率',
                amount: '总额'
            }]
            for (let i = 0; i < result.data.length; i++) {
                forList.push(frontArray.concat(result.data[i].unpackList).map(item=>{
                    return{
                        ...item,
                        xxx:result.data[i].amount
                    }
                }))
            }
            this.setState({
                probabilityDate: forList,
            })
        }
    }
    keepList = async () => {
        let { beginDate3 } = this.state
        let params = {
            beginDate: beginDate3,
        }
        let result = await reqKeep(params)
        if (result.code === 0) {
            this.setState({
                keepSource: [result.data],
            })
        }
    }
    // 开奖概率Dom表格
    probabilityDom = (probabilityDate) => {
        if (probabilityDate && probabilityDate.length>1) {
            return (
                <div>
                    <div>抢红包金额：{probabilityDate[0].xxx}</div>
                    <table border="1" width="100%" align="center" style={{marginBottom:'15px'}}>
                        <thead>
                            <tr bgcolor="#FAFAFA">
                                {
                                    probabilityDate.map(item=>{
                                        return (
                                            <th>{item.name}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody align="center">
                            <tr>
                                {
                                    probabilityDate.map(item=>{
                                        return (
                                            <th style={item.amount !== '总额' ? {fontWeight: 'normal'} : {}}>{item.amount}</th>
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                                {
                                    probabilityDate.map(item=>{
                                        return (
                                            <th style={item.probability !== '开奖概率' ? {fontWeight: 'normal'} : {}}>{item.probability === '开奖概率' ? item.probability : item.probability + '%'}</th>
                                        )
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    // ***********************************第一个*****************************************
    // 开始时间选择器(监控记录日期变换)
    handleStartDateChange1 = (value, dateString) => {
        this.setState({
            beginDate1: dateString,
        });
    };
    
    // 结束时间选择器(监控记录日期变换)
    handleEndDateChange1 = (value, dateString) => {
        this.setState({
            endDate1: dateString,
        });
    };

    // 结束时间可选范围
    handleEndDisabledDate1 = (current) => {
        const { beginDate1 } = this.state;
        if (beginDate1 !== '') {
        // 核心逻辑: 结束日期不能多余开始日期后60天，且不能早于开始日期
            return current > moment(beginDate1).add(60, 'day') || current < moment(beginDate1);
        } else {
            return null;
        }
    }
    
    // 开始时间可选范围
    handleStartDisabledDate1 = (current) => {
        const { endDate1 } = this.state;
        if (endDate1 !== '') {
            // 核心逻辑: 开始日期不能晚于结束日期，且不能早于结束日期前60天
            return current < moment(endDate1).subtract(60, 'day') || current > moment(endDate1);
        } else {
            return null;
        }
    }

    // ***********************************第二个*****************************************
    // 开始时间选择器(监控记录日期变换)
    handleStartDateChange2 = (value, dateString) => {
        this.setState({
            beginDate2: dateString,
        });
    };
    
    // 结束时间选择器(监控记录日期变换)
    handleEndDateChange2 = (value, dateString) => {
        this.setState({
            endDate2: dateString,
        });
    };

    // 结束时间可选范围
    handleEndDisabledDate2 = (current) => {
        const { beginDate2 } = this.state;
        if (beginDate2 !== '') {
        // 核心逻辑: 结束日期不能多余开始日期后60天，且不能早于开始日期
            return current > moment(beginDate2).add(60, 'day') || current < moment(beginDate2);
        } else {
            return null;
        }
    }
    
    // 开始时间可选范围
    handleStartDisabledDate2 = (current) => {
        const { endDate2 } = this.state;
        if (endDate2 !== '') {
            // 核心逻辑: 开始日期不能晚于结束日期，且不能早于结束日期前60天
            return current < moment(endDate2).subtract(60, 'day') || current > moment(endDate2);
        } else {
            return null;
        }
    }

    // ***********************************第三个*****************************************
    // 开始时间选择器(监控记录日期变换)
    handleStartDateChange3 = (value, dateString) => {
        this.setState({
            beginDate3: dateString,
        });
    };
    render() {
        let { dataSource, probabilityDate, keepSource } = this.state
        // 读取状态数据
        // card的左侧
        const title1 = (
            <span>
                <DatePicker
                    onChange={this.handleStartDateChange1}
                    disabledDate={this.handleStartDisabledDate1}
                    placeholder="开始日期"
                />
                <span>-</span>
                <DatePicker
                    onChange={this.handleEndDateChange1}
                    disabledDate={this.handleEndDisabledDate1}
                    placeholder="结束日期"
                />
            </span>
        )
        const title2 = (
            <span>
                <DatePicker
                    onChange={this.handleStartDateChange2}
                    disabledDate={this.handleStartDisabledDate2}
                    placeholder="开始日期"
                />
                <span>-</span>
                <DatePicker
                    onChange={this.handleEndDateChange2}
                    disabledDate={this.handleEndDisabledDate2}
                    placeholder="结束日期"
                />
            </span>
        )
        const title3 = (
            <span>
                <DatePicker
                    onChange={this.handleStartDateChange3}
                    placeholder="开始日期"
                />
            </span>
        )
        // card的右侧
        const extra1 = (
            <span>
                <Button type='primary' onClick={() => this.getDataList()}>搜索</Button>
            </span>
        )
        const extra2 = (
            <span>
                <Button type='primary' onClick={() => this.getProbabilityList()}>搜索</Button>
            </span>
        )
        const extra3 = (
            <span>
                <Button type='primary' onClick={() => this.keepList()}>搜索</Button>
            </span>
        )
        return (
            <div className='basic'>
                <Card title={title1} extra={extra1}>
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={dataSource}
                        pagination={false}
                        style={{'marginBottom': '20px'}}
                        columns={[
                            {
                                title: '抢红包数',
                                align: 'center',
                                dataIndex: 'envelopesNumber',
                                key: 'envelopesNumber',
                            },
                            {
                                title: '拆红包数',
                                align: 'center',
                                dataIndex: 'envelopesRemoveNumber',
                                key: 'envelopesRemoveNumber',
                            },
                            {
                                title: '抢红包总额',
                                align: 'center',
                                dataIndex: 'envelopesTotalAmount',
                                key: 'envelopesTotalAmount',
                            },
                            {
                                title: '新增注册',
                                align: 'center',
                                dataIndex: 'newRegistration',
                                key: 'newRegistration',
                            },
                            {
                                title: '新增访客',
                                align: 'center',
                                dataIndex: 'newVisitors',
                                key: 'newVisitors',
                            },
                            {
                                title: '登陆总数',
                                align: 'center',
                                dataIndex: 'totalLogins',
                                key: 'totalLogins',
                            },
                            {
                                title: '开奖总额',
                                align: 'center',
                                dataIndex: 'totalPrize',
                                key: 'totalPrize',
                                render: reltotalPrizeoad => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.props.history.push('/lottery')}>{reltotalPrizeoad}</Button>
                                        </span>
                                    )
                                },
                            },
                            {
                                title: '充值总额',
                                align: 'center',
                                dataIndex: 'totalRecharge',
                                key: 'totalRecharge',
                                render: totalRecharge => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.props.history.push('/paid')}>{totalRecharge}</Button>
                                        </span>
                                    )
                                },
                            },
                            {
                                title: '提现总额',
                                align: 'center',
                                dataIndex: 'totalWithdrawal',
                                key: 'totalWithdrawal',
                                render: totalWithdrawal => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.props.history.push('/withdraw')}>{totalWithdrawal}</Button>
                                        </span>
                                    )
                                },
                            },
                            {
                                title: '访客总数',
                                align: 'center',
                                dataIndex: 'visitorsTotalNumber',
                                key: 'visitorsTotalNumber',
                            },
                        ]}
                    />
                </Card>
                <Card title={title3} extra={extra3}>
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={keepSource}
                        pagination={false}
                        style={{'marginTop':'0px',marginBottom:'15px'}}
                        columns={[
                            {
                                title: '用户留存',
                                render: reload => {
                                    return (
                                        <span>留存用户数</span>
                                    )
                                },
                            },
                            {
                                title: '次留',
                                align: 'center',
                                dataIndex: 'secondStay',
                                key: 'secondStay',
                            },
                            {
                                title: '3留',
                                align: 'center',
                                dataIndex: 'three',
                                key: 'three',
                            },
                            {
                                title: '7留',
                                align: 'center',
                                dataIndex: 'sevenStay',
                                key: 'sevenStay',
                            },
                            {
                                title: '15留',
                                align: 'center',
                                dataIndex: 'fifteenStay',
                                key: 'fifteenStay',
                            },
                            {
                                title: '月留',
                                align: 'center',
                                dataIndex: 'monthStay',
                                key: 'monthStay',
                            },
                        ]}
                    />
                </Card>
                <Card title={title2} extra={extra2}>
                    {this.probabilityDom(probabilityDate ? probabilityDate[0] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[1] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[2] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[3] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[4] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[5] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[6] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[7] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[8] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[9] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[10] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[11] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[12] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[13] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[14] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[15] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[16] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[17] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[18] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[19] : [])}
                    {this.probabilityDom(probabilityDate ? probabilityDate[20] : [])}
                </Card>
            </div>
        )
    }
}