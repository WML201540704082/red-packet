//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Card } from 'antd'
import { reqProxyList } from '../../api'
import Details from './proxy-details'

export default class ProxyList extends Component {
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
            isDetailsVisible: false,//用户详情
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
        let result = await reqProxyList(params)
        if (result.code === 0) {
            this.setState({
                dataSource: result.data.records,
            })
        }
    }
    // 旗下用户列表
    nextProxyDetails = (userId) => {
        this.setState({
            isDetailsVisible: true,
            userId,
        })
    }
    render() {
        let { dataSource, pageNumber, pageSize, keyWord } = this.state
        // 读取状态数据
        // card的左侧
        const title = (
            <span>
                <Input 
                    value={keyWord}
                    placeholder='用户ID、手机号、FacebookID'
                    style={{width:200, margin: '0 15px'}}
                    onChange={event => this.setState({keyWord:event.target.value})}
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
                        pagination={{current: pageNumber,pageSize: pageSize,showQuickJumper: true,onChange: this.onPageChange}}
                        columns={[
                            {
                                title: 'userId',
                                dataIndex: 'userId',
                                key: 'userId',
                            },
                            {
                                title: '代理等级',
                                dataIndex: 'level',
                                key: 'level',
                            },
                            {
                                title: '分佣比例',
                                dataIndex: 'commissionRatio',
                                key: 'commissionRatio',
                            },
                            {
                                title: '旗下用户列表',
                                align: 'center',
                                render: reload => {
                                return (
                                    <span>
                                        <Button type={'link'} onClick={() => this.nextProxyDetails(reload.id)}>查看</Button>
                                    </span>
                                )
                                },
                            },
                        ]}
                    />
                </Card>
                {this.showDetails(this.state.isDetailsVisible)}
            </div>
        )
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
    onPageChange = (pageNumber, pageSize) => {
        this.setState({
            pageNumber,
            pageSize,
        })
    }
}