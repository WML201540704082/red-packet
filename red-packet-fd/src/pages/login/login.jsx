import React, {Component} from 'react'
import { Form, Input, Button, message, Tabs } from 'antd'
// import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.less'
import facebook from './images/facebook.png'
// import zalo from './images/zalo.png'
import { reqLogin, reqFacebookLogin, reqGoogleLogin, reqPhoneLogin, reqSendSms } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import LinkButton from '../../components/link-button'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login';
const { TabPane } = Tabs;

export default class Login extends Component {
    state = {
        phone: '',
		num: 0,
	}

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
    forgotPwd = () => {}
    /*
        注册
    */
    registerAccount = () => {}
    /*
        Google登录
    */
    responseGoogle = async (response) => {
        if (response.profileObj) {
            const { name, googleId } = response.profileObj
            try {
                const result = await reqGoogleLogin(name, googleId)
                if (result.code === 0) {
                    message.success('登陆成功')
                    // 保存user
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                    storageUtils.saveUser(user)
                    this.props.history.push('/')
                } else {
                    message.error(result.message)
                }
            } catch (error) {
                console.log('失败了', error);
            }
        } else {
            message.warning('登录失败')
        }
    }
    /*
        facebook登录
    */
    responseFacebook = async (response) => {
        if (response.name || response.userID) {
            const { name, userID } = response
            try {
                const result = await reqFacebookLogin(name, userID)
                if (result.code === 0) {
                    message.success('登陆成功')
                    // 保存user
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                    storageUtils.saveUser(user)
                    this.props.history.push('/')
                } else {
                    message.error(result.message)
                }
            } catch (error) {
                console.log('失败了', error);
            }   
        } else {
            message.warning('登录失败')
        }
    }

    // 发送验证码
    handleSend = async () => {
        let a = 60;
        console.log(this.state.phone,'手机号');
        var reg_tel = /^[0-9]*$/
        if (reg_tel.test(this.state.phone)) {
            let { phone } = this.state
            let result = await reqSendSms(phone)
            if (result.code === 0) {
                message.success('发送验证码成功！')
            } else {
                message.error('发送验证码失败！')
            }
            this.setState({num: a})
            const t1 = setInterval(()=>{
                a=a-1
                this.setState({num: a})
                if(a === 0){
                    clearInterval(t1)
                }
            },1000)
        }else {
            alert('手机号格式不正确')
        }
    }
      
    render () {
        const {num} = this.state

        // 如果用户已经登陆，自动跳转到管理洁面
        const user = memoryUtils.user
        if (user && user.id) {
            return <Redirect to='/'/>
        }

        // async 和 await 以同步编码(没有回调函数了)方式实现异步流程
        const onFinish = async (values) => {
            const { account, passWord } = values
            try {
                const result = await reqLogin(account, passWord)
                if (result.code === 0) {
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
        const onPhoneFinish = async values => {
            const { phone, code } = values
            try {
                const result = await reqPhoneLogin(phone, code)
                if (result.code === 0) {
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
        }
        return (
            <div className="login">
                <section className='login-section'>
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="密码登录" key="1" className="login-content">
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
                                        // prefix={<UserOutlined className="site-form-item-icon" />}
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
                                        // prefix={<LockOutlined className="site-form-item-icon" />}
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
                        </TabPane>
                        <TabPane tab="免密登录" key="2" className="login-content">
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onPhoneFinish}
                            >
                                <Form.Item
                                    name="phone"
                                    rules={[
                                        {   required: true, whitespace: true,  message: '手机号必须输入!'   },
                                        {   min: 9,  message: '用户名最少9位'   },
                                        {   max: 11,  message: '用户名最多11位'   },
                                        {   pattern: /^[0-9]+$/,  message: '手机号必须是数字'   },
                                    ]}
                                >
                                    <Input 
                                        placeholder="手机号"
                                        onChange={event => this.setState({phone:event.target.value})}
                                    />
                                    
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    rules={[
                                        {   required: true, whitespace: true,  message: '验证码必须输入!'   },
                                    ]}
                                >
                                    <Input
                                        placeholder="验证码"
                                        style={{width: '180px'}}
                                        // onChange={event => this.setState({code:event.target.value})}
                                    />
                                    <Button style={{marginLeft:'5px',color: '#FF0000'}} disabled={num!==0} onClick={this.handleSend}>{num===0?'发送':num+"秒"}</Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        登录
                                    </Button>
                                </Form.Item>
                                <Form.Item className="login-form-bottom"></Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </section>
                <div className='otherLogin'>
                    <span className='text_line'>
                        <div className='left_line'></div>
                        其他登录方式
                        <div className='right_line'></div>
                    </span>
                    <span className='login_icon'>
                        <GoogleLogin
                            clientId="715440772497-uuq231lpek9ek0m08o2013dvua1728jl.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            className="btnGoogle">
                            <i className="fa fa-google-plus" /> 
                            <span>&nbsp;</span>
                        </GoogleLogin>
                        {/* 346326924009220 */}
                        <FacebookLogin
                            appId="895624567779325"
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btnFacebook"
                            icon={<img src={facebook} alt="facebook" /> }
                            textButton = ""
                        />
                    </span>
                </div>
            </div>
        )
    }
}