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
            keyWord: null,
            isDetailsVisible: false,//用户详情
            type: null
        }
    }
    componentWillMount() {
        this.getDataList()
    }
    getDataList = async () => {
        let { keyWord, pageNumber, pageSize, type } = this.state
        let params = {
            keyWord,
            current: pageNumber,
            size: pageSize,
            type
        }
        let result = await reqProxyList(params)
        if (result.code === 0) {
            this.setState({
                dataSource: result.data.records,
                dataTotal: result.data.total
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
    handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter)
        this.setState({
            type: sorter.columnKey === 'amount' && sorter.order === 'ascend' ? 1 : 
                  sorter.columnKey === 'amount' && sorter.order === 'descend' ? 2 :
                  sorter.columnKey === 'commissionAmount' && sorter.order === 'ascend' ? 3 : 
                  sorter.columnKey === 'commissionAmount' && sorter.order === 'descend' ? 4 : null
        },()=>{
            this.getDataList()
        })
    };
    render() {
        let { dataSource, pageNumber, pageSize, keyWord, dataTotal } = this.state
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
                        pagination={{current: pageNumber,pageSize: pageSize, 
							showQuickJumper: false, 
							showSizeChanger: true, 
							pageSizeOptions: ["5","10","15","20"],
							total: this.state.dataTotal,
							onChange: this.onPageChange,
							onShowSizeChange: this.onPageChange,
							showTotal: () => {return `共 ${dataTotal} 条`}}}
                        scroll={{ y: '55vh' }}
                        onChange={this.handleTableChange}
                        columns={[
                            {
                                title: '用户ID',
                                align: 'center',
                                dataIndex: 'userId',
                                key: 'userId',
                            },
                            {
                                title: '旗下用户累计充值',
                                align: 'center',
                                dataIndex: 'amount',
                                key: 'amount',
                                sorter: true,
                            },
                            {
                                title: '累计分佣收益',
                                align: 'center',
                                dataIndex: 'commissionAmount',
                                key: 'commissionAmount',
                                sorter: true,
                            },
                            {
                                title: '旗下用户列表',
                                align: 'center',
                                render: reload => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.nextProxyDetails(reload.userId)}>查看</Button>
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
        },() => {
            this.getDataList()
        })
    }
}