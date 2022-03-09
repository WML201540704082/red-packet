//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Card, Modal } from 'antd'
import { reqAccount } from '../../api'
import Details from './user-details'

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
            searchName: null,
            userRow: {},
            id: null
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
        let { searchName, pageNumber, pageSize } = this.state
        let params = {
            searchName,
            current: pageNumber,
            size: pageSize
        }
        let result = await reqAccount(params)
        if (result.code === 200) {
            this.setState({
                dataSource: result.data,
            })
        }
    }
    render() {
        let { dataSource, pageNumber, pageSize, searchName, isRecordsVisible, isShieldVisible, id } = this.state
        // 读取状态数据
        // card的左侧
        const title = (
            <span>
                <Input 
                    value={searchName}
                    placeholder='用户ID、手机号、FacebookID'
                    style={{width:200, margin: '0 15px'}}
                    onChange={event => this.setState({searchName:event.target.value})}
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
                                title: '用户ID',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '用户余额',
                                dataIndex: 'deviceName',
                                key: 'deviceName',
                            },
                            {
                                title: '累计充值',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '累计收益',
                                dataIndex: 'upgradeStatus',
                                key: 'upgradeStatus',
                                render: upgradeStatus =>  upgradeStatus + '元'
                            },
                            {
                                title: '最近登录时间',
                                dataIndex: 'createdAt',
                                key: 'createdAt',
                            },
                            {
                                title: '抢红包记录',
                                align: 'center',
                                render: reload => {
                                return (
                                    <span>
                                    <Button type={'link'} onClick={() => this.recordsView()}>查看</Button>
                                    </span>
                                )
                                },
                            },
                            {
                                title: '登录类型',
                                dataIndex: 'deviceModel',
                                key: 'deviceModel',
                            },
                            {
                                title: <span style={{ fontWeight: 700 }}>操作</span>,
                                key: 'id',
                                align: 'center',
                                width: '20%',
                                render: reload => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.openDetails(reload)}>用户详情</Button>
                                            <Button type={'link'} onClick={() => this.userShield(reload.id)}>拉黑</Button>
                                        </span>
                                    )
                                },
                            },
                        ]}
                    />
                    <Modal
                        title="抢红包记录查看"
                        visible={isRecordsVisible}
                        onOk={() => {this.setState({
                            isRecordsVisible: false
                        })}}
                        onCancel={() => {this.setState({
                            isRecordsVisible: false
                        })}}
                    >
                        <span>123</span>
                    </Modal>
                    <Modal
                        title="拉黑"
                        visible={isShieldVisible}
                        onOk={() => this.confirmShield(id)}
                        onCancel={() => {this.setState({
                            isShieldVisible: false
                        })}}
                    >
                        <span>确认拉黑用户吗?</span>
                    </Modal>
                    
                </Card>
                {this.showDetails(this.state.isDetailsVisible, dataSource)}
            </div>
        )
    }
    onPageChange = (pageNumber, pageSize) => {
        this.setState({
            pageNumber,
            pageSize,
        })
    }

    // 抢红包记录查看
    recordsView = (id) => {
        this.setState({
            isRecordsVisible: true,
            id
        })
    }
    // 拉黑
    userShield = (id) => {
        this.setState({
            isShieldVisible: true,
            id
        })
    }
    confirmShield = (id) => {
        console.log(id)
    }
    openDetails = (reload) => {
        this.setState({
            isDetailsVisible: true,
            userRow: reload
        })
    }
    // 用户详情
    showDetails = (flag) => {
        if (flag) {
            let { userRow } = this.state
            return (
                <Details
                    flag={flag}
                    userRow={userRow}
                    closeDatails={() => this.setState({isDetailsVisible: false,})}
                />
            )
        }
      }
}