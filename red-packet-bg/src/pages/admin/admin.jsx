import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';

// 引入路由
import Home from '../home/home'
import RobConfig from '../robConfig/robConfig'
import OpenConfig from '../openConfig/openConfig'
import Recharge from '../recharge/recharge'
import Role from '../role/role'
import Account from '../account/account'
import User from '../user/user'
import Basic from '../basic/basic'
import Lottery from '../records/lottery'
import Paid from '../records/paid'
import Operate from '../records/operate'
import Withdraw from '../withdraw/withdraw'
import ProxyList from '../proxy/proxyList'
import ProxyConfig from '../proxy/proxyConfig'

// const { Footer, Sider, Content } = Layout;
const { Sider, Content } = Layout;

/*
后台管理的路由组件
*/
export default class Admin extends Component {
    render () {
        const user = memoryUtils.user
        // 如果内存没有存储user ==> 当前没有登陆
        if (!user || !user.userId) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: 20, backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/account' component={Account}></Route>
                            <Route path='/basic' component={Basic}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/robConfig' component={RobConfig}></Route>
                            <Route path='/openConfig' component={OpenConfig}></Route>
                            <Route path='/recharge' component={Recharge}></Route>
                            <Route path='/lottery' component={Lottery}></Route>
                            <Route path='/paid' component={Paid}></Route>
                            <Route path='/operate' component={Operate}></Route>
                            <Route path='/withdraw' component={Withdraw}></Route>
                            <Route path='/proxyList' component={ProxyList}></Route>
                            <Route path='/proxyConfig' component={ProxyConfig}></Route>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    {/* <Footer style={{textAlign: 'center', color: '#cccccc', padding: '0 0 15px'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer> */}
                </Layout>
            </Layout>
        )
    }
}