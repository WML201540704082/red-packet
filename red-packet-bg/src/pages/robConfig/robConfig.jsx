import React, { Component } from 'react'
import { Card, Table, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import {getDeviceList} from '../../api'

// 商品分类路由
export default class RobConfig extends Component {

	state = {
		loading: false, // 是否正在获取数据中
		crobConfigs: [], // 一级分类列表
	}

	/*
	 初始化Table所有列的数组
	*/
	initColums = () => {
		this.columns = [
            {
              title: '设备id',
              dataIndex: 'deviceId',
              key: 'deviceId',
            },
            {
              title: '设备名称',
              dataIndex: 'deviceName',
              key: 'deviceName',
            },
            {
              title: 'id',
              dataIndex: 'id',
              key: 'addidress',
            },
            {
                title: '操作',
                width: 300,
                render: () => (
                    <span>
                        <LinkButton>修改子分类</LinkButton>
                        <LinkButton>查看子分类</LinkButton>
                    </span>
                )
			},
		];
	}

	/*
	 异步获取一级分类列表显示
	 */
	getDeviceList = async () => {

		// 在发请求前显示Loading
		this.setState({loading:true})
		// 发异步ajax请求，获取数据
		const result = await getDeviceList()
		// 在请求完成后隐藏Loading
		this.setState({loading:false})
		if (result.code === 200) {
			const robConfigs = result.data
			// 更新状态
			this.setState({
				robConfigs
			})
		} else {
			message.error('获取分类列表失败')
		}
	}

	/*
	 为第一次render()准备数据
	*/
	componentWillMount() {
		this.initColums()
	}

	/*
	 执行异步任务：发异步ajax请求
	*/
	componentDidMount() {
		this.getDeviceList()
	}
    render() {

		// 读取状态数据
		const {robConfigs,loading} = this.state

        // card的左侧
        const title = '一级分类列表'
        // card的右侧
        const extra = (
            <Button type='primary'>
                <PlusOutlined />
                添加
            </Button>
        )
          
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='key'
					loading={loading}
                    dataSource={robConfigs}
                    columns={this.columns}
					pagination={{defaultPageSize:5,showQuickJumper:true}}/>
            </Card>
        )
    }
}
