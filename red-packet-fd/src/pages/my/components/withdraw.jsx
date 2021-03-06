import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqUserCardList, reqAddCard, reqUpdateCard, reqDeleteCard, reqWithdraw } from '../../../api'
import { message } from 'antd'
import BankList from './bank-list'
import arrows from './arrows.png'
import './withdraw.less'
import { t } from 'i18next'
import i18n from 'i18next';

export default class Withdrawal extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            cardList: [],
            newCardFlag: false,
            cardName:'',
            bankName:'',
            cardNo:'',
            id:'',
            bankId:'',
            bankCardId: '',
            bankNameFlag: false,
            type:null,
            pop: false,
            money: 0
		}
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
            this.setState({
                pop: true
            })
        } else { // 键盘收起
            this.setState({
                pop: false
            })
        }
    }
    componentWillMount() {
        let { balanceAmount } = this.props
        this.setState({
            balanceAmount,
        })
		this.getUserCardList()
	}
    // 用户银行卡列表
    getUserCardList = async () => {
        let params = {
			current: 0,
			size: 100,
		}
        let result = await reqUserCardList(params)
        if (result.code === 0) {
            this.setState({
                cardList: result.data.records
            })
        }
    }
    goBack = () => {
        this.props.closeModal()
    }
    // 提现
    widthdraw = async () => {
        let { clickFlag, money, balanceAmount, bankCardId } = this.state
        if (clickFlag !==0 && !clickFlag) {
            message.warning(t('my.Please select an account'))
        } else if (!money) {
            message.warning(t('my.Please enter the withdrawal amount'))
        } else if (money > balanceAmount) {
            message.warning(t('my.less_than_balance'))
        } else {
            let params = {
                bankCardId: bankCardId,
                amount: money,
            }
            let result = await reqWithdraw(params)
            if (result.code === 0) {
                message.success(t('my.withdrawal_succeeded'))
                this.props.sureModal()
                this.props.sureModal2()
            } else {
                message.error(result.data.msg)
            }
        }   
    }
    // 添加银行卡
    addBankCard = async () => {
        let { cardName, id, newId, cardNo, type, bankId } = this.state
        let params = {
            cardName,//收款人姓名
            cardNo,//银行卡号
            id: type === 'update' ? id : newId,//用户银行列表id
            bankId: type === 'update' ? bankId : null
        }
        let result = type === 'update'? await reqUpdateCard(params) : await reqAddCard(params)
        if (result.code === 0 && result.data.code === 0) {
            message.success(type === 'update' ? t('my.successfully_modified') : t('my.added_successfully'))
            this.setState({
                newCardFlag:false
            },()=>{
                this.getUserCardList()
            })
        } else {
            message.error(result.data ? result.data.msg : result.msg)
        }
    }
    // 删除银行卡
    deleteBankCard = async id => {
        let result = await reqDeleteCard(id)
        if (result.data.code === 0) {
            message.success(t('my.delete_succeeded'))
            this.getUserCardList()
        } else {
            message.error(result.data.msg)
        }
    }
    selectBankName = () => {
        this.setState({
            bankNameFlag: true
        })
    }
    showBankName = () => {
        return (
            <BankList
                closeModal={(id,bankId,bankName) => this.setState({bankNameFlag: false,newId:id,bankId:id,bankName})}
            />
        )
    }
	render() {
        let { newCardFlag,type,bankNameFlag } = this.state
		return (
            <div style={{position:'absolute',width:'100%',height:'100%',zIndex:2}}>
                {
                    !newCardFlag ? (
                        <div style={{width:'100%',height:'100%'}}>
                            <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>{t('my.withdraw_cash')}</div>
                            <img src={goback} onClick={()=>this.goBack()} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                            <div onClick={()=>this.setState({newCardFlag:true})} style={{position:'absolute',top:'16px',right:'15px',fontSize:i18n.language === 'vie'?'12px':''}}>{t('my.add_account')}</div>
                            <div style={{padding:'30px 20px 0',background:'#f5f5f5',height:'calc(100vh - 50px)'}}>
                                <div style={{height:'30px'}}>{t('my.Please enter the withdrawal amount')}</div>
                                <div style={{background:'#ffffff',height:'110px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                                    <div style={{height:'70px',lineHeight:'70px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy',fontSize:'36px',fontWeight:'bold'}}>
                                        <input value={this.state.money}
                                            onChange={event => this.setState({money:event.target.value})}
                                            style={{height:'50px',width:'90%',fontSize:'40px',margin:'12px 5px 0',
                                            fontWeight:'500',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'40px',lineHeight:'40px',color:'#666666',fontSize:'12px'}}>
                                        {t('my.cash withdrawal limit')}：{this.state.balanceAmount}
                                    </div>
                                </div>
                                <div style={{height:'calc(100vh - 340px)',paddingTop:'10px'}}>
                                    {
                                        !this.state.pop ? (
                                            <div style={{width:'100%',height:'100%'}}>
                                                <div style={{height:'40px',lineHeight:'40px',color:'#0F0F0F'}}>
                                                    {t('my.Please select an account')}
                                                </div>
                                                <div style={{width:'100%',height:'calc(100vh - 410px)',overflowY:'scroll'}}>
                                                    {
                                                        this.state.cardList.map((item,index)=>{
                                                            return (
                                                                <div style={{width:'100%',display:'flex'}}>
                                                                    <div onClick={()=>this.setState({clickFlag:index,bankCardId:item.id})} 
                                                                        style={{color:this.state.clickFlag === index ? 'red' : '',
                                                                                border:this.state.clickFlag === index ? '1px solid red' : '',
                                                                                background:'#ffffff',height:'40px',lineHeight:'40px',
                                                                                borderRadius:'5px',marginBottom:'10px',paddingLeft:'10px',
                                                                                width:'calc(100vw - 125px)',display:'flex'}}>
                                                                        <div style={{width:'35%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.cardName}</div>
                                                                        <div style={{width:'65%',marginLeft:'20px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.cardNo}</div>
                                                                    </div>
                                                                    <div onClick={()=>this.setState({newCardFlag:true,type:'update',cardName:item.cardName,bankName:item.backName,id:item.id,bankId:item.bankId,cardNo:item.cardNo})}
                                                                        style={{width:'40px',height:'40px',lineHeight:'40px',textAlign:'center',background:'#2878ff',marginLeft:'4px',color:'#ffffff',borderRadius:'5px'}}>{t('my.edit')}</div>
                                                                    <div onClick={()=>this.deleteBankCard(item.id)} style={{width:'40px',height:'40px',lineHeight:'40px',textAlign:'center',background:'#ff3029',marginLeft:'4px',color:'#ffffff',borderRadius:'5px'}}>{t('my.delete')}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        ) : null
                                    }
                                </div>
                                <div style={{width:'100%',height:'80px'}}>
                                    {
                                        !this.state.pop ? (
                                            <div onClick={()=>this.widthdraw()} style={{width:'100%',height:'40px',lineHeight:'40px',borderRadius:'10px',backgroundColor:'#D53E1C',color:'#ffffff',display:'flex',justifyContent:'center'}}>{t('my.withdraw_cash')}</div>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{width:'100%',height:'100%'}}>
                            <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display: bankNameFlag ? 'none' : 'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>{type==='update' ? t('my.modify_bank_card') : t('my.add_bank_card')}</div>
                            <img src={goback} onClick={()=>this.setState({newCardFlag:false})} style={{position:'absolute',top:'16px',left:'15px',width:'15px',display: bankNameFlag ? 'none' : ''}} alt="goback"/>
                            <div style={{padding:'20px 20px 0',background:'#f5f5f5',display: bankNameFlag ? 'none' : ''}}>
                                <div style={{background:'#ffffff',height:'180px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:i18n.language === 'vie'?'141px':'120px',color:'#666666',fontSize:i18n.language === 'vie'?'12px':'16px'}}>{t('my.name')}</span>
                                        <input value={this.state.cardName} placeholder=''
                                            onChange={event => this.setState({cardName:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <div style={{width:i18n.language === 'vie'?'141px':'120px',color:'#666666',fontSize:i18n.language === 'vie'?'12px':'16px'}}>{t('my.bank_name')}</div>
                                        <div onClick={()=>this.selectBankName()} style={{width:'calc(100vw - 120px)',display:'flex'}}>
                                            <span style={{width:i18n.language === 'vie'?'calc(100vw - 178px)':'calc(100vw - 168px)',paddingLeft:'5px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{this.state.bankName}</span>
                                            <img style={{width:'15px',height:'15px',marginTop:'22px',marginLeft:'5px'}} src={arrows} alt="arrows"/>
                                        </div>
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:i18n.language === 'vie'?'141px':'120px',color:'#666666',fontSize:i18n.language === 'vie'?'12px':'16px'}}>{t('my.bank_account_number')}</span>
                                        <input value={this.state.cardNo} placeholder=''
                                            onChange={event => this.setState({cardNo:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                </div>
                                <div style={{height:'calc(100vh - 250px)',paddingTop:'10px'}}>
                                    <div style={{width:'100%',height:'80px',paddingTop:'20px'}}>
                                        <div onClick={()=>this.addBankCard()} style={{width:'100%',height:'40px',lineHeight:'40px',borderRadius:'10px',backgroundColor:'#D53E1C',color:'#ffffff',display:'flex',justifyContent:'center'}}>{type==='update'? t('my.modify') : t('my.add')}</div>
                                    </div>
                                </div>
                            </div>
                            {bankNameFlag ? this.showBankName() : null}
                        </div>
                    )
                }
            </div>
		)
	}
}