import {
    // AppstoreOutlined,
    // PieChartOutlined,
    // DesktopOutlined,
    // ContainerOutlined,
    // MailOutlined,
  } from '@ant-design/icons';
const menuList =[
    {
        title: '拆包包', // 菜单标题名称
        key: '/open', // 对应的path
        // icon: <PieChartOutlined />, // 图标名称
    },
    {
        title: '抢包包',
        key: '/grab',
        // icon: <MailOutlined />,
        // children: [ // 子菜单路由
        //     {
        //         title: '品类管理', 
        //         key: '/category', 
        //     },
        //     {
        //         title: '商品管理', 
        //         key: '/product', 
        //     },
        // ]
    },
    {
        title: '在线客服', 
        key: '/customer', 
        // icon: <DesktopOutlined />, 
    },
    {
        title: '我的', 
        key: '/my', 
        // icon: <ContainerOutlined />, 
    },
    // {
    //     title: '图形图表',
    //     key: '/charts',
    //     icon: <AppstoreOutlined />,
    //     children: [
    //         {
    //             title: '柱形图', 
    //             key: '/charts/bar', 
    //         },
    //         {
    //             title: '折线图', 
    //             key: '/charts/line', 
    //         },
    //         {
    //             title: '饼图', 
    //             key: '/charts/pie', 
    //         },
    //     ]
    // },
]

export default menuList