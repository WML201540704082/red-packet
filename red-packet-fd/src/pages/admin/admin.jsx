import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav';

// 引入路由
import Open from '../open/open'
import Grab from '../grab/grab'
import My from '../my/my'
import Customer from '../customer/customer'

const { Content } = Layout;

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
            <Layout style={{width: '100%',height: '100%'}}>
                <Content>
                    <Switch>
                        <Route path='/open' component={Open}></Route>
                        <Route path='/grab' component={Grab}></Route>
                        <Route path='/customer' component={Customer}></Route>
                        <Route path='/my' component={My}></Route>
                        <Redirect to='/open'/>
                    </Switch>
                </Content>
                <LeftNav/>
            </Layout>
        )
    }
}