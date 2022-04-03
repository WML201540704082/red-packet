import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';

// 引入路由
import Grab from '../grab/grab'
import Open from '../open/open'
import My from '../my/my'
import Customer from '../customer/customer'

const { Content } = Layout;

/*
后台管理的路由组件
*/
export default class Admin extends Component {
    render () {
        return (
            <Layout style={{width: '100%',height: '100%'}}>
                <Content>
                    <Switch>
                        <Route path='/grab' component={Grab}></Route>
                        <Route path='/open' component={Open}></Route>
                        <Route path='/customer' component={Customer}></Route>
                        <Route path='/my' component={My}></Route>
                        <Redirect to='/grab'/>
                    </Switch>
                </Content>
                <LeftNav/>
            </Layout>
        )
    }
}