import '../i18n/config';
import { t } from 'i18next'
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

export default menuList