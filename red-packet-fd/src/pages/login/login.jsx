import React, {Component} from 'react'
import { Form, Input, Button, message, Tabs, Select } from 'antd'
import './login.less'
import facebook from './images/facebook.png'
import google from './images/google.png'
import { reqLogin, reqFacebookLogin, reqGoogleLogin, reqPhoneLogin, reqSendSms } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import LinkButton from '../../components/link-button'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login'
import countryCode from './countryCode'
import RegisterAcc from './components/register-acc'
import RetrievePwd from './components/retrieve-pwd'
import CountrySelect from './components/country-select'
import arrows from './images/arrows.png'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import bg_2 from './images/bg_2.png'
import { t } from 'i18next'
import i18n from 'i18next'
const { TabPane } = Tabs;
const { Option } = Select;

export default class Login extends Component {
    state = {
        phone: '',
		num: 0,
        isModalVisible: false,
        countryFlag: false,
        phoneCode: '+84',
        clientHeight: 0,
        pop: false,
        language: 'vie'
	}
    componentDidMount() {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        this.setState({ clientHeight })
        window.addEventListener('resize', this.resize)
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize) // 移除监听
    }

    resize = () => {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (this.state.clientHeight > clientHeight) { // 键盘弹出
            // this.inputClickHandle()
            this.setState({
                pop: true
            })
        } else { // 键盘收起
            // this.inputBlurHandle()
            this.setState({
                pop: false
            })
        }
    }

    // inputClickHandle = () => {
    //     // 这里处理键盘弹出的事件
    // }
    // inputBlurHandle = () => {
    //     // 这里处理键盘收起的事件
    // }
    componentWillMount() {
        this.setState({
            language: i18n.language
        })
        // 本地存储lng
        localStorage.setItem('lng', i18n.language)

        let aaa = this.props.location.search
        // let aaa = "?id=123"
        if (aaa) {
            this.setState({
                shareId: aaa.substring(6)
            })
        } else {
            this.setState({
                shareId: this.props.location.state ? this.props.location.state.shareId : null,
            })
        }
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
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
    }
    /*
        Google登录
    */
    responseGoogle = async (response) => {
        console.log('**********',response)
        if (response.profileObj) {
            const { name, googleId } = response.profileObj
            let { shareId } = this.state
            let params = {
                id: shareId,
                name: name,
                userId: googleId,
                type: this.state.language === 'en' ? '0' : 1
            }
            try {
                const result = await reqGoogleLogin(params)
                if (result.code === 0) {
                    message.success(t('login.login_success'))
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
            // message.warning('登录失败')
        }
    }
    /*
        facebook登录
    */
    responseFacebook = async (response) => {
        console.log('----------',response)
        if (response.name || response.userID) {
            const { name, userID } = response
            let { shareId } = this.state
            let params = {
                id: shareId,
                name: name,
                userId: userID,
                type: this.state.language === 'en' ? '0' : 1
            }
            try {
                const result = await reqFacebookLogin(params)
                if (result.code === 0) {
                    message.success(t('login.login_success'))
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
            // message.warning('登录失败')
        }
    }

    // 发送验证码
    handleSend = async () => {
        if (!this.state.phone) {
            message.warning(t('login.Please enter your mobile number'))
        } else {
            let a = 60;
            var reg_tel = /^[0-9]*$/
            if (reg_tel.test(this.state.phone)) {
                let phone = this.state.phoneCode.substring(1) + this.state.phone
                let result = await reqSendSms(phone)
                if (result.code === 0) {
                    this.setState({num: a})
                    const t1 = setInterval(()=>{
                        a=a-1
                        this.setState({num: a})
                        if(a === 0){
                            clearInterval(t1)
                        }
                    },1000)
                } else {
                    message.error(result.data.msg)
                }
            }else {
                message.warning(t('login.mobile_number_format_error'))
            }
        }
    }
    selectCode = () => {
        this.setState({
            countryFlag: true
        })
    }
    render () {
        const {num, countryFlag, phoneCode} = this.state

        // 如果用户已经登陆，自动跳转到主界面
        const user = memoryUtils.user
        if (user && user.userId) {
            return <Redirect to='/'/>
        }

        // 密码登录
        const onFinish = async (values) => {
            const { account, passWord } = values
            const type = this.state.language === 'en' ? '0' : 1
            if (!account) {
                message.warning(t('login.Please enter the account'))
            } else if (!passWord) {
                message.warning(t('login.Please enter the password'))
            } else {
                NProgress.start() // 显示滚动条
                try {
                    const result = await reqLogin(account, passWord, type)
                    if (result.code === 0) {
                        message.success(t('login.login_success'))
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
                NProgress.done() // 关闭滚动条
            }
        };
        // 免密登录
        const onPhoneFinish = async () => {
            const { phone, code, shareId } = this.state
            let params = {
                userId: shareId,
                phone: this.state.phoneCode.substring(1) + phone,
                code: code,
                type: this.state.language === 'en' ? '0' : 1
            }
            try {
                const result = await reqPhoneLogin(params)
                if (result.code === 0) {
                    message.success(t('login.login_success'))

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
        const changeLanguage = (value) => {
            this.setState({language: value})
            i18n.changeLanguage(value)
            // 本地存储lng
            localStorage.setItem('lng', value)
            this.forceUpdate()
        }
        return (
            // 解决软键盘问题
            <div style={{width:'100%', height: '100%'}}>
                <Select style={{position:'absolute',top:'15px',right:'20px',width:'106px'}} value={this.state.language} onChange={value => changeLanguage(value)}>
                    <Option value="vie">ViệtName</Option>
                    <Option value="en">English</Option>
                    <Option value="zh">中文</Option>
                </Select>
                {
                    !countryFlag ? (
                        <div className="login" style={{ backgroundImage: !this.state.pop ? '' : `url("${bg_2}")`}}>
                            <section className='login-section' style={{height: !this.state.pop ? '' : '60%'}}>
                                <Tabs defaultActiveKey="1" centered>
                                    <TabPane tab={t('login.passwordless_login')} key="1" className="login-content" style={{top: !this.state.pop ? '52%' : '70%'}}>
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
                                                    // {   required: false, whitespace: true,  message: '手机号必须输入!'   },
                                                    // {   min: 9,  message: '用户名最少9位'   },
                                                    // {   max: 11,  message: '用户名最多11位'   },
                                                    // {   pattern: /^[0-9+]+$/,  message: '手机号必须是数字'},
                                                ]}
                                                style={{marginBottom: '10px'}}
                                            >
                                                <div className='input_outer'>
                                                    <div className='input_text'>Mobile phone no.</div>
                                                    <span onClick={()=>this.selectCode()}>
                                                        <span style={{width:'30px',paddingLeft:'10px'}}>{phoneCode}
                                                            <img style={{width:'15px',marginLeft:'5px'}} src={arrows} alt="arrows"/>
                                                        </span>
                                                    </span>
                                                    <Input 
                                                        placeholder={t('login.phone_number')}
                                                        // onClick={this.inputClickHandle}
                                                        // onBlur={this.inputBlurHandle}
                                                        style={{width: '172px', marginLeft: '3px'}}
                                                        onChange={event => this.setState({phone:event.target.value})}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                name="code"
                                                rules={[
                                                    // {   required: false, whitespace: true,  message: '验证码必须输入!'},
                                                ]}
                                            >
                                                <div className='input_outer'>
                                                    <div className='input_text'>Verification Code</div>
                                                    <Input
                                                        placeholder={t('login.verification_code')}
                                                        onChange={event => this.setState({code:event.target.value})}
                                                    />
                                                    <Button style={{float: 'right',margin: '-39px 3px 0 0',borderColor: '#ffffff',color: '#D32940'}} disabled={num!==0} onClick={this.handleSend}>{num===0 ? t('login.send') : num + "s"}</Button>
                                                </div>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" className="login-form-button">
                                                    {t('login.login')}
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </TabPane>
                                    <TabPane tab={t('login.password_login')} key="2" className="login-content" style={{top: !this.state.pop ? '52%' : '70%'}}>
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
                                                rules={[
                                                    // {   required: true, whitespace: true,  message: '用户名必须输入!'   },
                                                    // {   min: 4,  message: '用户名最少4位'   },
                                                    // {   max: 12,  message: '用户名最多12位'   },
                                                    // {   pattern: /^[a-zA-Z0-9_]+$/,  message: '用户名必须是英文、数字或下划线组成'   },
                                                ]}
                                                style={{marginBottom: '10px'}}
                                            >
                                                <div className='input_outer'>
                                                    <div className='input_text'>Account</div>
                                                    <Input 
                                                        placeholder={t('login.account')}
                                                        onChange={e => {this.setState({account: e.target.value})}}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                name="passWord"
                                                rules={[
                                                    {
                                                        // validator: this.validatorPwd
                                                    }
                                                ]}
                                            >
                                                <div className='input_outer'>
                                                    <div className='input_text'>PassWord</div>
                                                    <Input
                                                        type={t('login.password')}
                                                        placeholder={t('login.password')}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" className="login-form-button">
                                                    {t('login.login')}
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <div className="login-form-bottom">
                                            <LinkButton style={{color: '#1F79FF'}} onClick={() => {this.setState({isPwdVisible: true})}}>{t('login.forget_password')}</LinkButton>
                                            <span className="login-form-register">
                                                <LinkButton style={{color: '#1F79FF',float: 'right'}} onClick={() => {this.setState({isModalVisible:true})}}>{t('login.register')}</LinkButton>
                                            </span>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </section>
                            {
                                !this.state.pop ? (
                                    <div className='otherLogin'>
                                        <span className='text_line'>
                                            <div className='left_line'></div>
                                            <div className={i18n.language === 'zh' ? 'line_text_zh' : i18n.language === 'en' ? 'line_text_en' : 'line_text_vie'}>{t('login.other_login_methods')}</div>
                                            <div className='right_line'></div>
                                        </span>
                                        <span className='login_icon'>
                                            <GoogleLogin
                                                // clientId="715440772497-uuq231lpek9ek0m08o2013dvua1728jl.apps.googleusercontent.com"
                                                clientId="927698055570-nevn1mcsm2u7ijjgghdi5ijn7t0i8ehh.apps.googleusercontent.com"
                                                buttonText="Login"
                                                onSuccess={this.responseGoogle}
                                                onFailure={this.responseGoogle}
                                                cookiePolicy={'single_host_origin'}
                                                render={renderProps => (
                                                    <img onClick={renderProps.onClick} src={google} style={{width:'26px',height:'26px'}} alt="facebook" />
                                                )}
                                                className="btnGoogle">
                                                <i className="fa fa-google-plus" /> 
                                                <span>&nbsp;</span>
                                            </GoogleLogin>
                                            <FacebookLogin
                                                // appId="895624567779325"
                                                appId="346326924009220"
                                                // autoLoad={true}
                                                fields="name,email,picture"
                                                callback={this.responseFacebook}
                                                cssClass="btnFacebook"
                                                icon={<img src={facebook} style={{width:'36px',height:'36px'}} alt="facebook" /> }
                                                textButton = ""
                                            />
                                        </span>
                                    </div>
                                ) : null
                            }
                            {this.showModal(this.state.isModalVisible)}
                            {this.showPwdModal(this.state.isPwdVisible)}
                        </div>
                    ) : (
                        <div>
                            {this.showCountrySelect(this.state.countryFlag)}
                        </div>
                    )
                }
            </div>
        )
    }
    // 注册
    showModal = (flag) => {
		if (flag) {
            let { shareId } = this.state
			return (
				<RegisterAcc
					flag={flag}
                    shareId={shareId}
					closeModal={() => this.setState({isModalVisible: false})}
                    type={this.state.language === 'en' ? '0' : 1}
				/>
			)
		}
	}
    // 找回密码
    showPwdModal = (flag) => {
        let { account } = this.state
		if (flag) {
			return (
				<RetrievePwd
					flag={flag}
					closeModal={() => this.setState({isPwdVisible: false})}
                    account={account}
                    type={this.state.language === 'en' ? '0' : 1}
				/>
			)
		}
	}
    showCountrySelect = flag => {
        if (flag) {
            return (
                <CountrySelect
					flag={flag}
                    countryCode={countryCode}
                    goBackModal={()=>this.setState({countryFlag: false})}
					closeModal={(phone_code) => 
                        this.setState({
                            countryFlag: false,
                            phoneCode: '+' + phone_code
                        })
                    }
				/>
            )
        }
    }
}