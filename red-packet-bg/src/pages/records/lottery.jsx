//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Card } from 'antd'
import { reqLottery } from '../../api'

export default class Lottery extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            pageNumber: 1,
            pageSize: 5,
            searchName: '',
            deviceId: ''
        }
    }
    componentWillMount() {
        this.getDataList()
    }
    getDataList = async () => {
        let { searchName, pageNumber, pageSize } = this.state
        let params = {
            searchName,
            pageNumber,
            pageSize
        }
        let result = await reqLottery(params)
        if (result.code === 200) {
            this.setState({
                dataSource: result.data,
            })
        }
    }
    render() {
        let { dataSource, pageNumber, pageSize, searchName } = this.state
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
                                dataIndex: 'deviceId',
                                key: 'deviceId',
                            },
                            {
                                title: '红包ID',
                                dataIndex: 'deviceName',
                                key: 'deviceName',
                            },
                            {
                                title: '奖项',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '中奖金额',
                                dataIndex: 'upgradeStatus',
                                key: 'upgradeStatus',
                                render: upgradeStatus =>  upgradeStatus + '元'
                            },
                            {
                                title: '开奖时间',
                                dataIndex: 'createdAt',
                                key: 'createdAt',
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
        })
    }
}