import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, message } from 'antd';
import grab from './images/grab.png'
import grab_hover from './images/grab_hover.png'
import open from './images/open.png'
import open_hover from './images/open_hover.png'
import customer from './images/customer.png'
import customer_hover from './images/customer_hover.png'
import my from './images/my.png'
import my_hover from './images/my_hover.png'
// import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
import { t } from 'i18next'
import i18n from 'i18next';

const { SubMenu } = Menu;

class leftNav extends Component {
    state = {
        collapsed: false,
        grabFlag: true,
        openFlag: false,
        customerFlag: false,
        myFlag: false,
        shareId: ''
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    // 根据menu的数据数组生成对应的标签数组
    // 使用map() + 递归调用
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    componentDidMount() {
        const menuList =[
            {
                title: t('navigation.red_envelope_lucky_draw'), // 菜单标题名称
                key: '/grab', // 对应的path
            },
            {
                title: t('navigation.remove_the_red_envelope'),
                key: '/open',
            },
            {
                title: t('navigation.customer_service'), 
                key: '/customer', 
            },
            {
                title: t('navigation.my'), 
                key: '/my', 
            },
        ]
        // 监听路由的变化,如果路由发生变化则进行相应操作
        this.props.history.listen(location => {
            // 最新路由的 location 对象，可以通过比较 pathname 是否相同来判断路由的变化情况
            if (this.props.location.pathname !== location.pathname) {
                // 路由发生了变化
                if (location.pathname === '/grab') {
                    this.setState({
                        grabFlag: true,
                        openFlag: false,
                        customerFlag: false,
                        myFlag: false
                    },()=>{
                        this.menuNodes = this.getMenuNodes(menuList)
                        this.forceUpdate()
                    })            
                } else if (location.pathname === '/open') {
                    this.setState({
                        grabFlag: false,
                        openFlag: true,
                        customerFlag: false,
                        myFlag: false
                    },()=>{
                        this.menuNodes = this.getMenuNodes(menuList)
                        this.forceUpdate()
                    })           
                } else if (location.pathname === '/customer') {
                    this.setState({
                        grabFlag: false,
                        openFlag: false,
                        customerFlag: true,
                        myFlag: false
                    },()=>{
                        this.menuNodes = this.getMenuNodes(menuList)
                        this.forceUpdate()
                    })           
                }  else if (location.pathname === '/my') {
                    this.setState({
                        grabFlag: false,
                        openFlag: false,
                        customerFlag: false,
                        myFlag: true
                    },()=>{
                        this.menuNodes = this.getMenuNodes(menuList)
                        this.forceUpdate()
                    })            
                }
            }
        })
    }
    menu_click = (val) => {
        localStorage.setItem('navigate',val.key)
        const menuList =[
            {
                title: t('navigation.red_envelope_lucky_draw'), // 菜单标题名称
                key: '/grab', // 对应的path
            },
            {
                title: t('navigation.remove_the_red_envelope'),
                key: '/open',
            },
            {
                title: t('navigation.customer_service'), 
                key: '/customer', 
            },
            {
                title: t('navigation.my'), 
                key: '/my', 
            },
        ]
        const user = memoryUtils.user
        if (user && user.userId) {
            // 已登录
            if (val.key === "/grab") {
                this.setState({
                    grabFlag: true,
                    openFlag: false,
                    customerFlag: false,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (val.key === "/open") {
                this.setState({
                    grabFlag: false,
                    openFlag: true,
                    customerFlag: false,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (val.key === "/customer") {
                this.setState({
                    grabFlag: false,
                    openFlag: false,
                    customerFlag: true,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (val.key === "/my") {
                this.setState({
                    grabFlag: false,
                    openFlag: false,
                    customerFlag: false,
                    myFlag: true
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            }
        } else {
            // 未登录
            if (val.key === "/grab") {
                // 点击抢红包页面
                this.setState({
                    grabFlag: true,
                    openFlag: false,
                    customerFlag: false,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else {
                // 点击非抢红包页面的其他icon
                let { shareId } = this.state
                message.warning(t('login.please_log_in_first'))
                if (shareId) {
                    this.props.history.push({
                        pathname:'/login',
                        state:{
                            shareId
                        }
                    })
                } else {
                    this.props.history.push({
                        pathname:'/login'
                    })
                }
            }
        }
    }
    // 根据menu的数据数组生成对应的标签数组
    // 使用reduce() + 递归调用
    getMenuNodes = () => {
        const menuList =[
            {
                title: t('navigation.red_envelope_lucky_draw'), // 菜单标题名称
                key: '/grab', // 对应的path
            },
            {
                title: t('navigation.remove_the_red_envelope'),
                key: '/open',
            },
            {
                title: t('navigation.customer_service'), 
                key: '/customer', 
            },
            {
                title: t('navigation.my'), 
                key: '/my', 
            },
        ]
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        let { grabFlag, openFlag, customerFlag, myFlag } = this.state
        
        return menuList.reduce((pre,item) => {
            // 向pre添加<Menu.Item>
            if (!item.children) {
                // debugger
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon} onClick={this.menu_click}>
                        <Link to={item.key}>{
                            <span className='img_and_title'>
                                <img src={(item.key === '/grab' && !grabFlag) ? grab : 
                                          (item.key === '/grab' && grabFlag) ? grab_hover :
                                          (item.key === '/open' && !openFlag) ? open : 
                                          (item.key === '/open' && openFlag) ? open_hover :
                                          (item.key === '/customer' && !customerFlag) ? customer : 
                                          (item.key === '/customer' && customerFlag) ? customer_hover :
                                          (item.key === '/my' && !myFlag) ? my : my_hover} 
                                    style={{marginBottom: '-10px',marginTop:'7px'}} alt="icon"/>
                                <span style={{marginBottom: '-12px',transform: i18n.language === 'en' ? 'scale(0.9)' : '',
                                              color:(item.key === '/grab' && !grabFlag) ? '#666666' : 
                                              (item.key === '/grab' && grabFlag) ? '' :
                                              (item.key === '/open' && !openFlag) ? '#666666' : 
                                              (item.key === '/open' && openFlag) ? '' :
                                              (item.key === '/customer' && !customerFlag) ? '#666666' : 
                                              (item.key === '/customer' && customerFlag) ?  '':
                                              (item.key === '/my' && !myFlag) ? '#666666' : ''}}>
                                    {item.title}
                                </span>
                            </span>
                        }</Link>
                    </Menu.Item>
                ))
            } else {

                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    // 如果存在，说明当前item的子列表需要打开
                    this.openKey = item.key   
                }

                // 向pre添加<SubMenu>
                pre.push((
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }

            return pre
        }, [])
    }

    /*
        在第一次render()之前执行一次
        为第一个render()准备数据(必须同步的)
    */
    componentWillMount() {
        const menuList =[
            {
                title: t('navigation.red_envelope_lucky_draw'), // 菜单标题名称
                key: '/grab', // 对应的path
            },
            {
                title: t('navigation.remove_the_red_envelope'),
                key: '/open',
            },
            {
                title: t('navigation.customer_service'), 
                key: '/customer', 
            },
            {
                title: t('navigation.my'), 
                key: '/my', 
            },
        ]
        if (localStorage.getItem('navigate')) {
            if (localStorage.getItem('navigate') === "/grab") {
                this.setState({
                    grabFlag: true,
                    openFlag: false,
                    customerFlag: false,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (localStorage.getItem('navigate') === "/open") {
                this.setState({
                    grabFlag: false,
                    openFlag: true,
                    customerFlag: false,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (localStorage.getItem('navigate') === "/customer") {
                this.setState({
                    grabFlag: false,
                    openFlag: false,
                    customerFlag: true,
                    myFlag: false
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            } else if (localStorage.getItem('navigate') === "/my") {
                this.setState({
                    grabFlag: false,
                    openFlag: false,
                    customerFlag: false,
                    myFlag: true
                },()=>{
                    this.menuNodes = this.getMenuNodes(menuList)
                    this.forceUpdate()
                })
            }
        } else {
            this.setState({
                grabFlag: true,
                openFlag: false,
                customerFlag: false,
                myFlag: false
            },()=>{
                this.menuNodes = this.getMenuNodes(menuList)
                this.forceUpdate()
            })
        }
        let aaa = this.props.location.search
        if (aaa) {
            // 是分享过来的
            this.setState({
                shareId: aaa.substring(6)
            })
        }
    }

    render() {
        // 得到当前请求的路由路径
        // const path = this.props.location.pathname
        // 得到需要打开菜单项的key
        // const openKey = this.openKey

        return (
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/open']}>
                {this.menuNodes}
            </Menu>
        )
    }
}

/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件你
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(leftNav)