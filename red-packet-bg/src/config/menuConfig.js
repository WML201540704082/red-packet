import {
    PieChartOutlined,
    ContainerOutlined,
    AccountBookOutlined,
    LineChartOutlined,
    UserOutlined,
    MailOutlined,
    FolderOpenOutlined,
    RedEnvelopeOutlined,
    CustomerServiceOutlined,
    AppstoreOutlined,
    SwapOutlined,
    DollarOutlined,
    DesktopOutlined,
    PropertySafetyOutlined
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
        title: '账户管理', 
        key: '/account', 
        icon: <AccountBookOutlined />, 
    },
    {
        title: '基本指标', 
        key: '/basic', 
        icon: <LineChartOutlined />, 
    },
    {
        title: '用户管理', 
        key: '/user', 
        icon: <UserOutlined />, 
    },
    {
        title: '抢红包配置', 
        key: '/robConfig', 
        icon: <MailOutlined />, 
    },
    {
        title: '拆红包配置', 
        key: '/openConfig', 
        icon: <FolderOpenOutlined />, 
    },
    {
        title: '充值配置', 
        key: '/recharge', 
        icon: <RedEnvelopeOutlined />, 
    },
    {
        title: '客服配置', 
        key: '/customer', 
        icon: <CustomerServiceOutlined />,
    },
    {
        title: '开奖记录', 
        key: '/lottery', 
        icon: <AppstoreOutlined />, 
    },
    {
        title: '提现列表', 
        key: '/withdraw', 
        icon: <SwapOutlined />, 
    },
    {
        title: '充值记录', 
        key: '/paid', 
        icon: <DollarOutlined />, 
    },
    {
        title: '操作记录', 
        key: '/operate', 
        icon: <DesktopOutlined />, 
    },
    {
        title: '代理管理',
        key: '/proxy',
        icon: <PropertySafetyOutlined />,
        children: [ // 子菜单路由
            {
                title: '代理列表', 
                key: '/proxyList', 
            },
            {
                title: '代理配置', 
                key: '/proxyConfig', 
            },
        ]
    },
]

export default menuList