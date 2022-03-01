import {
    AppstoreOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
  } from '@ant-design/icons';
const menuList =[
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: <PieChartOutlined />, // 图标名称
    },
    {
        title: '商品',
        key: '/products',
        icon: <MailOutlined />,
        children: [ // 子菜单路由
            {
                title: '品类管理', 
                key: '/category', 
            },
            {
                title: '商品管理', 
                key: '/product', 
            },
        ]
    },
    {
        title: '用户管理', 
        key: '/user', 
        icon: <DesktopOutlined />, 
    },
    {
        title: '角色管理', 
        key: '/role', 
        icon: <ContainerOutlined />, 
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: '柱形图', 
                key: '/charts/bar', 
            },
            {
                title: '折线图', 
                key: '/charts/line', 
            },
            {
                title: '饼图', 
                key: '/charts/pie', 
            },
        ]
    },
]

export default menuList