import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';

// 引入路由
import Grab from '../grab/grab'
import Open from '../open/open'
import My from '../my/my'
import Customer from '../customer/customer'
import i18n from 'i18next'

const { Content } = Layout;

/*
前台管理的路由组件
*/
export default class Admin extends Component {
    componentWillReceiveProps (){
        console.log(i18n.language)
        i18n.changeLanguage(i18n.language)
        // if (window.location.hash) {
        //     // 重新赋值本地存储导航栏信息(防止点击的链接后面没有’/grab‘、'/open'。。。)
        //     localStorage.setItem('navigate',window.location.hash.substring(1) || '/grab')
        //     console.log(window.location.hash.substring(1) || '/grab')
        // }
        this.forceUpdate()
    }
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
                <LeftNav
                    language={i18n.language}
                />
            </Layout>
        )
    }
}