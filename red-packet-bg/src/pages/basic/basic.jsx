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
            beginDate1: new Date(), // 开始时间
            endDate1: new Date(), // 结束时间
            beginDate2: '', // 开始时间
            endDate2: '', // 结束时间
            beginDate3: '', // 开始时间
        }
    }
    componentWillMount() {
        this.getSearch()
    }
    getSearch() {
        this.setState({
            beginDate1: moment(this.state.beginDate1).format('YYYY-MM-DD'),
            endDate1: moment(this.state.endDate1).format('YYYY-MM-DD'),
            beginDate2: moment(this.state.beginDate1).format('YYYY-MM-DD'),
            endDate2: moment(this.state.endDate1).format('YYYY-MM-DD'),
            beginDate3: moment(this.state.beginDate1).format('YYYY-MM-DD HH:mm:ss'),
        },()=>{
            // 获取数据统计列表
            this.getDataList()
            // 获取开奖概率
            this.getProbabilityList()
            // 获取留存数据
            this.keepList()
        })
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
    sortBy(property){
        return function(value1,value2){
            let a=value1[property]
            let b=value2[property]
            return a < b ? -1 : a > b ? 1 : 0
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
                        xxx:result.data[i].amount,
                        sortId: item.name === '奖项' ? 0 : item.name === '一等奖' ? 1 : item.name === '二等奖' ? 2 : item.name === '三等奖' ? 3 : item.name === '四等奖' ? 4 : item.name === '五等奖' ? 5 : 
                        item.name === '六等奖' ? 6 : item.name === '七等奖' ? 7 : item.name === '八等奖' ? 8 : item.name === '九等奖' ? 9 : item.name === '十等奖' ? 10 : 11
                    }
                }))
            }
            for (let i = 0; i < forList.length; i++) {
                forList[i].sort(this.sortBy('sortId'))
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
                keepSource: [{
                    name: '用户留存',
                    stayPre: '留存百分比',
                    stay: '留存用户数'
                },{
                    name: '次留',
                    stayPre: result.data.secondPer,
                    stay: result.data.secondStay
                },{
                    name: '3留',
                    stayPre: result.data.threePer,
                    stay: result.data.three
                },{
                    name: '7留',
                    stayPre: result.data.sevenStayPer,
                    stay: result.data.sevenStay
                },{
                    name: '15留',
                    stayPre: result.data.fifteenStayPer,
                    stay: result.data.fifteenStay
                },{
                    name: '月留',
                    stayPre: result.data.monthStayPer,
                    stay: result.data.monthStay
                }],
            })
        }
    }
    // 用户留存Dom表格
    keepDom = (keepSource) => {
        if (keepSource) {
            return (
                <div>
                    <table border="1" width="100%" align="center" style={{marginBottom:'15px'}}>
                        <thead>
                            <tr bgcolor="#FAFAFA">
                                {
                                    keepSource.map(item=>{
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
                                    keepSource.map(item=>{
                                        return (
                                            <th style={item.stayPre !== '留存百分比' ? {fontWeight: 'normal'} : {}}>{item.stayPre === '留存百分比' ? item.stayPre : item.stayPre + '%'}</th>
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                                {
                                    keepSource.map(item=>{
                                        return (
                                            <th style={item.stay !== '留存用户数' ? {fontWeight: 'normal'} : {}}>{item.stay}</th>
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
    render() {
        let { dataSource, probabilityDate, keepSource } = this.state
        // 读取状态数据
        // card的左侧
        const title1 = (
            <span>
                <DatePicker
                    defaultValue={moment(this.state.beginDate1)}
                    onChange={this.handleStartDateChange1}
                    disabledDate={this.handleStartDisabledDate1}
                    placeholder="开始日期"
                />
                <span> - </span>
                <DatePicker
                    defaultValue={moment(this.state.endDate1)}
                    onChange={this.handleEndDateChange1}
                    disabledDate={this.handleEndDisabledDate1}
                    placeholder="结束日期"
                />
            </span>
        )
        // card的右侧
        const extra1 = (
            <span>
                <Button type='primary' onClick={() => this.getSearch()}>搜索</Button>
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
                <Card>
                    {this.keepDom(keepSource)}
                </Card>
                <Card>
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