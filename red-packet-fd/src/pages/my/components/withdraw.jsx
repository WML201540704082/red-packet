import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqUserCardList, reqAddCard, reqUpdateCard, reqDeleteCard } from '../../../api'
import { message } from 'antd'
import BankList from './bank-list'
import arrows from './arrows.png'
import './withdraw.less'

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
            bankNameFlag: false,
            type:null
		}
	}
    componentWillMount() {
        let { balanceAmount } = this.props
        this.setState({
            balanceAmount,
            money: balanceAmount,
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
    widthdraw = () => {
        let { clickFlag, money, balanceAmount } = this.state
        if (clickFlag !==0 && !clickFlag) {
            message.warning('请选择账号！')
        } else if (!money) {
            message.warning('请输入提现金额！')
        } else if (money > balanceAmount) {
            message.warning('提现金额需小于余额！')
        } else {
            message.success('提现成功！')
            this.props.sureModal()
        }   
    }
    // 添加银行卡
    addBankCard = async () => {
        let { cardName, id, cardNo, type, bankId } = this.state
        let params = {
            cardName,//收款人姓名
            cardNo,//银行卡号
            id,//用户银行列表id
            bankId: type === 'update' ? bankId : null
        }
        debugger
        let result = type === 'update'? await reqUpdateCard(params) : await reqAddCard(params)
        if (result.code === 0 && result.data.code === 0) {
            message.success(type === 'update' ? '修改成功' : '添加成功')
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
            message.success('删除成功！')
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
                closeModal={(id,bankId,bankName) => this.setState({bankNameFlag: false,id,bankId,bankName})}
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
                            <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>提现</div>
                            <img src={goback} onClick={()=>this.goBack()} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                            <div onClick={()=>this.setState({newCardFlag:true})} style={{position:'absolute',top:'16px',right:'15px'}}>添加账号</div>
                            <div style={{padding:'30px 20px 0',background:'#f5f5f5'}}>
                                <div style={{paddingBottom:'10px'}}>输入提现金额</div>
                                <div style={{background:'#ffffff',height:'110px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                                    <div style={{height:'70px',lineHeight:'70px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy',fontSize:'36px',fontWeight:'bold'}}>
                                        <span>₫</span>
                                        <input value={this.state.money}
                                            onChange={event => this.setState({money:event.target.value})}
                                            style={{height:'50px',width:'90%',fontSize:'40px',margin:'12px 5px 0',
                                            fontWeight:'500',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'40px',lineHeight:'40px',color:'#666666',fontSize:'12px'}}>
                                        可提现金额：{this.state.balanceAmount}
                                    </div>
                                </div>
                                <div style={{height:'calc(100vh - 280px)',paddingTop:'10px'}}>
                                    {
                                        <div style={{width:'100%',height:'100%'}}>
                                            <div style={{height:'40px',lineHeight:'40px',color:'#0F0F0F'}}>
                                                请选择账号
                                            </div>
                                            <div style={{width:'100%',height:'calc(100vh - 350px)',overflowY:'scroll'}}>
                                                {
                                                    this.state.cardList.map((item,index)=>{
                                                        return (
                                                            <div style={{width:'100%',display:'flex'}}>
                                                                <div onClick={()=>this.setState({clickFlag:index})} 
                                                                    style={{color:this.state.clickFlag === index ? 'red' : '',
                                                                            border:this.state.clickFlag === index ? '1px solid red' : '',
                                                                            background:'#ffffff',height:'40px',lineHeight:'40px',
                                                                            borderRadius:'5px',marginBottom:'10px',paddingLeft:'10px',
                                                                            width:'calc(100vw - 110px)'}}>
                                                                    <span>{item.backName}</span>
                                                                    <span style={{marginLeft:'20px'}}>{item.cardNo}</span>
                                                                </div>
                                                                <div onClick={()=>this.setState({newCardFlag:true,type:'update',cardName:item.cardName,bankName:item.backName,id:item.id,bankId:item.bankId,cardNo:item.cardNo})}
                                                                     style={{width:'40px',height:'40px',lineHeight:'40px',textAlign:'center',background:'#2878ff',marginLeft:'4px',color:'#ffffff',borderRadius:'5px'}}>编辑</div>
                                                                <div onClick={()=>this.deleteBankCard(item.id)} style={{width:'40px',height:'40px',lineHeight:'40px',textAlign:'center',background:'#ff3029',marginLeft:'4px',color:'#ffffff',borderRadius:'5px'}}>删除</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div style={{width:'100%',height:'80px'}}>
                                    <div onClick={()=>this.widthdraw()} style={{width:'100%',height:'40px',lineHeight:'40px',borderRadius:'10px',backgroundColor:'#D53E1C',color:'#ffffff',display:'flex',justifyContent:'center'}}>提现</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{width:'100%',height:'100%'}}>
                            <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display: bankNameFlag ? 'none' : 'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>{type==='update'?'修改银行卡':'新增银行卡'}</div>
                            <img src={goback} onClick={()=>this.setState({newCardFlag:false})} style={{position:'absolute',top:'16px',left:'15px',width:'15px',display: bankNameFlag ? 'none' : ''}} alt="goback"/>
                            <div style={{padding:'20px 20px 0',background:'#f5f5f5',display: bankNameFlag ? 'none' : ''}}>
                                <div style={{background:'#ffffff',height:'180px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>姓名</span>
                                        <input value={this.state.cardName} placeholder=''
                                            onChange={event => this.setState({cardName:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <div style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>银行名称</div>
                                        <div onClick={()=>this.selectBankName()} style={{width:'calc(100vw - 120px)',display:'flex'}}>
                                            <span style={{width:'calc(100vw - 165px)',paddingLeft:'10px'}}>{this.state.bankName}</span>
                                            <img style={{width:'15px',height:'15px',marginTop:'22px',marginLeft:'5px'}} src={arrows} alt="arrows"/>
                                        </div>
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>银行卡号</span>
                                        <input value={this.state.cardNo} placeholder=''
                                            onChange={event => this.setState({cardNo:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                </div>
                                <div style={{height:'calc(100vh - 250px)',paddingTop:'10px'}}>
                                    <div style={{width:'100%',height:'80px',paddingTop:'20px'}}>
                                        <div onClick={()=>this.addBankCard()} style={{width:'100%',height:'40px',lineHeight:'40px',borderRadius:'10px',backgroundColor:'#D53E1C',color:'#ffffff',display:'flex',justifyContent:'center'}}>{type==='update'?'修改':'添加'}</div>
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