import React, {Component} from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.less'
import facebook from './images/facebook.png'
import zalo from './images/zalo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import LinkButton from '../../components/link-button'
import FacebookLogin from 'react-facebook-login'

export default class Login extends Component {
    // 对密码进行自定义验证
    validatorPwd = (rule, value, callback) => {
        if (!value) {
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
    /*
        忘记密码
    */
    forgotPwd = () => {
        // 显示确认狂
        // Modal.confirm({
        //     title: '确定退出吗?',
        //     icon: <ExclamationCircleOutlined />,
        //     onOk: () => {
        //         // 删除保存的user数据
        //         storageUtils.removeUser()
        //         memoryUtils.user = {}
        //         // 跳转到Login
        //         this.props.history.replace('/login')
        //     },
        //     onCancel() {
        //       console.log('Cancel');
        //     },
        // })
    }
    /*
        注册
    */
    registerAccount = () => {

    }
    responseFacebook = (response) => {
        console.log(response);
        // setIsLoggedin(true)
    }
    // componentDidMount = () => {
    //     window.fbAsyncInit = function() {
    //       FB.init({
    //         appId      : '346326924009220',
    //         cookie     : true,  // enable cookies to allow the server to access
    //                           // the session
    //         xfbml      : true,  // parse social plugins on this page
    //         version    : 'v2.1' // use version 2.1
    //       });
    //       FB.getLoginStatus(function(response) {
    //         this.statusChangeCallback(response);
    //       }.bind(this));
    //     }.bind(this);

    //     (function(d, s, id) {
    //       var js, fjs = d.getElementsByTagName(s)[0];
    //       if (d.getElementById(id)) return;
    //       js = d.createElement(s); js.id = id;
    //       js.src = "//connect.facebook.net/en_US/sdk.js";
    //       fjs.parentNode.insertBefore(js, fjs);
    //     }(document, 'script', 'facebook-jssdk'));
    // }
    // testAPI = () => {
    //     console.log('Welcome!  Fetching your information.... ');
    //     FB.api('/me', function(response) {
    //     console.log('Successful login for: ' + response.name);
    //     document.getElementById('status').innerHTML =
    //       'Thanks for logging in, ' + response.name + '!';
    //     });
    // }
    // statusChangeCallback = (response) => {
    //     console.log('statusChangeCallback');
    //     console.log(response);
    //     if (response.status === 'connected') {
    //     this.testAPI();
    //     } else if (response.status === 'not_authorized') {
    //     document.getElementById('status').innerHTML = 'Please log ' +
    //         'into this app.';
    //     } else {
    //         document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    //     }
    // }
    // checkLoginState = () => {
    //     FB.getLoginStatus(function(response) {
    //         this.statusChangeCallback(response);
    //     }.bind(this));
    // }
    /*
        facebook登录
    */
    facebookLogin = () => {
        // FB.login(this.checkLoginState());
    }
    render () {
        // 如果用户已经登陆，自动跳转到管理洁面
        const user = memoryUtils.user
        if (user && user.id) {
            return <Redirect to='/'/>
        }

        // async 和 await 以同步编码(没有回调函数了)方式实现异步流程
        const onFinish = async (values) => {
            const { username, password } = values
            try {
                const result = await reqLogin(username, password)
                if (result.code === 200) {
                    message.success('登陆成功')

                    // 保存user
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                    storageUtils.saveUser(user)

                    // 跳转到管理页面(不需要会退到登陆用replace，需要会退到登陆用push)
                    this.props.history.push('/')
                } else {
                    message.error(result.message)
                }
            } catch (error) {
                console.log('失败了', error);
            }
        };
        return (
            <div className="login">
                <section className="login-content">
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="username"
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
                            name="password"
                            rules={[
                                {
                                    validator: this.validatorPwd
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                        <Form.Item className="login-form-bottom">
                            <LinkButton onClick={this.forgotPwd}>忘记密码？</LinkButton>
                            <span className="login-form-register">
                                <LinkButton onClick={this.registerAccount}>注册</LinkButton>
                            </span>
                        </Form.Item>
                    </Form>
                </section>
                <div className='otherLogin'>
                    <span className='text_line'>
                        <div className='left_line'></div>
                        其他登录方式
                        <div className='right_line'></div>
                    </span>
                    <span>
                        {/* <img onClick={this.facebookLogin} src={facebook} alt="facebook" /> */}
                        <img src={zalo} alt="zalo" />
                        <FacebookLogin
                            appId="895624567779325"
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            render={renderProps => (
                                <img onClick={this.facebookLogin} src={facebook} alt="facebook" />
                            )}
                        />
                    </span>
                </div>
            </div>
        )
    }
}