import {
    PieChartOutlined,
    ContainerOutlined,
    DesktopOutlined,
    UserOutlined,
    MailOutlined,
    AppstoreOutlined,
    SwapOutlined
  } from '@ant-design/icons';
const menuList =[
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: <PieChartOutlined />, // 图标名称
    },
    {
        title: '角色管理', 
        key: '/role', 
        icon: <ContainerOutlined />, 
    },
    {
        title: '账号管理', 
        key: '/account', 
        icon: <DesktopOutlined />, 
    },
    {
        title: '用户管理', 
        key: '/user', 
        icon: <UserOutlined />, 
    },
    {
        title: '配置',
        key: '/config',
        icon: <MailOutlined />,
        children: [ // 子菜单路由
            {
                title: '抢红包配置', 
                key: '/robConfig', 
            },
            {
                title: '拆红包设置', 
                key: '/openConfig', 
            },
        ]
    },
    {
        title: '记录',
        key: '/records',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: '开奖记录', 
                key: '/records/lottery', 
            },
            {
                title: '充值记录', 
                key: '/records/paid', 
            },
            {
                title: '操作记录', 
                key: '/records/operate', 
            },
        ]
    },
    {
        title: '提现管理', 
        key: '/withdraw', 
        icon: <SwapOutlined />, 
    },
]

export default menuList