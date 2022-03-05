import React, {Component} from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.less'
// import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

export default class Login extends Component {
    // 对密码进行自定义验证
    validatorPwd = (rule, value, callback) => {
        if (!value) {
            // return Promise.resolve
            callback('请输入密码')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必 须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
    }
    render () {
        // 如果用户已经登陆，自动跳转到管理洁面
        const user = memoryUtils.user
        if (user && user.userId) {
            return <Redirect to='/'/>
        }

        // async 和 await 以同步编码(没有回调函数了)方式实现异步流程
        const onFinish = async (values) => {
            // console.log('Received values of form: ', values);
            const { account, passWord } = values
            try {
                let params = {
                    account,
                    passWord
                }
                const result = await reqLogin(params)
                if (result.code === 0) {
                    message.success('登陆成功')
                    // 保存user
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                    storageUtils.saveUser(user)

                    // 跳转到管理页面(不需要会退到登陆用replace，需要会退到登陆用push)
                    // this.props.history.push('/')
                } else {
                    message.error(result.message)
                }
            } catch (error) {
                console.log('失败了', error);
            }
        };
        return (
            <div className="login">
                <header className="login-header">
                    {/* <img src={logo} alt="logo" /> */}
                    {/* <h1>红包抽奖后台管理系统</h1> */}
                </header>
                <section className="login-content">
                    <h2>红包抽奖后台管理系统</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="account"
                            // 生命式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                {   required: true, whitespace: true,  message: '用户名必须输入!'   },
                                {   min: 4,  message: '用户名最少4位'   },
                                {   max: 12,  message: '用户名最多12位'   },
                                {   pattern: /^[a-zA-Z0-9_]+$/,  message: '用户名必须是英文、数字或下划线组成'   },
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="passWord"
                            rules={[
                                {
                                    validator: this.validatorPwd
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="passWord"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}