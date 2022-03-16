import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, message } from 'antd';
// import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import Sider from 'antd/lib/layout/Sider';
import { reqGetPermission } from '../../api'
import { PieChartOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

class leftNav extends Component {
    state = {
        collapsed: false,
    };
    /*
        在第一次render()之前执行一次
        为第一个render()准备数据(必须同步的)
    */
    componentWillMount() {
        this.getMenuList()
    }
    getMenuList = async () => {
        const result = await reqGetPermission()
		if (result.code === 0) {
			const portMenuList = result.data.list
			this.setState({
				portMenuList
			})
            let intersection = [{
                title: "首页",
                key: "/home",
                icon: <PieChartOutlined />
            }]
            for (let i = 1; i < menuList.length; i++) {
                for (let j = 0; j < portMenuList.length; j++) {
                    if (menuList[i].title === portMenuList[j].name) {
                        intersection.push(menuList[i])
                    }
                }
            }
            this.setState({
                menuList: intersection
            })
            this.menuNodes = this.getMenuNodes(this.state.menuList)
            this.forceUpdate()
		} else {
			message.error('获取分类列表失败')
		}
    }

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

    // 根据menu的数据数组生成对应的标签数组
    // 使用reduce() + 递归调用
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        
        return menuList.reduce((pre,item) => {
            // 向pre添加<Menu.Item>
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
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

    render() {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        // 得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.state.collapsed}
                className="left-nav">
                <Link to='/' className="left-nav-header">
                    {/* <img src={logo} alt="logo" /> */}
                    <h1>红包抽奖后台管理系统</h1>
                    {/* <h1>AIOTEdge</h1> */}
                </Link>
                    <Menu
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >
                        {
                            this.menuNodes
                        }
                    </Menu>
            </Sider>
        )
    }
}

/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件你
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(leftNav)