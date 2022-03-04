//列表页面
import React, { Component } from 'react'
import { Button, Table, Input, Select, Card, Modal } from 'antd'
import { reqAccount } from '../../api'
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
			searchType: '',
			searchName: '',
		}
	}
	componentWillMount() {
		this.getDataList()
	}
	getDataList = async () => {
		let { searchType, searchName } = this.state
		let params = {
			searchType,
			searchName
		}
		let result = await reqAccount(params)
		if (result.code === 200) {
            this.setState({
                dataSource: result.data,
            })
		}
	}
    pass_rejust = async (deviceId) => {
        console.log(111111,deviceId)
    }
	render() {
		let { dataSource, pageNumber, pageSize, isModalVisible, deviceId, searchType, searchName, type } = this.state
		// 读取状态数据
		// card的左侧
		const title = (
			<span>
				<span style={{fontSize: '14px',fontWeight: '400'}}>状态:&nbsp;&nbsp;</span>
				<Select 
					value={searchType}
					style={{width: 120}}
					onChange={value => this.setState({searchType:value})}
				>
					<Option value="1">审核中</Option>
					<Option value="2">已通过</Option>
					<Option value="3">已拒绝</Option>
				</Select> &nbsp;&nbsp;
				<span style={{fontSize: '14px',fontWeight: '400'}}>角色名称:</span>
				<Input 
					value={searchName}
					placeholder='用户ID、手机号、FaceBookID、zaloID'
					style={{width:200, margin: '0 15px'}}
					onChange={event => this.setState({searchName:event.target.value})}
				/>
				<Button type='primary' onClick={() => this.getDataList()}>搜索</Button>
			</span>
		)
		return (
			<div>
				<Card title={title}>
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={dataSource}
                        pagination={{current: pageNumber,pageSize: pageSize,showQuickJumper: true,onChange: this.onPageChange}}
                        columns={[
                            {
                                title: '登录账号',
                                dataIndex: 'deviceId',
                                key: 'deviceId',
                            },
                            {
                                title: '所属角色',
                                dataIndex: 'deviceName',
                                key: 'deviceName',
                            },
                            {
                                title: '昵称',
                                dataIndex: 'id',
                                key: 'addidress',
                            },
                            {
                                title: '状态',
                                dataIndex: 'upgradeStatus',
                                key: 'upgradeStatus',
                                render: (upgradeStatus) =>  upgradeStatus === 0 ? '使用中' : '已禁用'
                            },
                            {
                                title: <span style={{ fontWeight: 700 }}>操作</span>,
                                key: 'id',
                                align: 'center',
                                width: '20%',
                                render: reload => {
                                    return (
                                        <span>
                                            <Button type={'link'} onClick={() => this.oppModal(reload.deviceId,'pass')}>通过</Button>
                                            <Button type={'link'} onClick={() => this.oppModal(reload.deviceId,'reject')}>拒绝</Button>
                                        </span>
                                    )
                                },
                            },
                        ]}
                    />
                    <Modal
                        title={type === 'pass' ?  '通过' : '拒绝'}
                        visible={isModalVisible}
                        onOk={() => this.pass_rejust(deviceId)}
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
		})
	}

	oppModal = (deviceId, type) => {
        // 通过
        this.setState({
            deviceId,
            isModalVisible: true,
            type,
        })
	}
}