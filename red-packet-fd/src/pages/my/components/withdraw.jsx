import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqCardList, reqAddCard } from '../../../api'
import { message } from 'antd'
import './withdraw.less'

export default class Withdrawal extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            cardList: [],
            newCardFlag: false,
            name:'',
            bankName:'',
            bankNo:''
		}
	}
    componentWillMount() {
        let { balanceAmount } = this.props
        this.setState({
            balanceAmount,
            money: balanceAmount,
        })
		this.getCardList()
	}
    getCardList = async () => {
        let params = {
			current: 0,
			size: 100,
		}
        let result = await reqCardList(params)
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
    addBackCard = async () => {
        let { name, bankName, bankNo } = this.state
        let params = {
            backName: bankName,//银行名称
            cardNum: bankNo,//银行卡号
            cardSerialNum: 1,//银行编号
            collectionName: name,//收款人姓名
        }
        let result = await reqAddCard(params)
        if (result.code === 0) {
            message.success('添加成功')
            this.setState({
                newCardFlag:false
            },()=>{
                this.getCardList()
            })
        }
    }
	render() {
		return (
            <div style={{position:'absolute',width:'100%',height:'100%',zIndex:2}}>
                {
                    !this.state.newCardFlag ? (
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
                                            <div style={{width:'100%',height:'calc(100vh - 250px)',overflowY:'scroll'}}>
                                                {
                                                    this.state.cardList.map((item,index)=>{
                                                        return (
                                                            <div onClick={()=>this.setState({clickFlag:index})} 
                                                                style={{color:this.state.clickFlag === index ? 'red' : '',
                                                                        border:this.state.clickFlag === index ? '1px solid red' : '',
                                                                        background:'#ffffff',height:'50px',lineHeight:'50px',
                                                                        borderRadius:'5px',marginBottom:'10px',paddingLeft:'10px'}}>
                                                                <span>{item.backName}</span>
                                                                <span style={{marginLeft:'20px'}}>{item.cardNum}</span>
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
                            <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>添加银行卡</div>
                            <img src={goback} onClick={()=>this.setState({newCardFlag:false})} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                            <div style={{padding:'20px 20px 0',background:'#f5f5f5'}}>
                                <div style={{background:'#ffffff',height:'180px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>姓名</span>
                                        <input value={this.state.name} placeholder='特朗普'
                                            onChange={event => this.setState({name:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',borderBottom:'1px solid #DCDCDC',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>银行名称</span>
                                        <input value={this.state.bankName} placeholder='渣打银行'
                                            onChange={event => this.setState({bankName:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                    <div style={{height:'60px',lineHeight:'60px',display:'flex',alignContent:'center',width:'100%',fontFamily:'PingFang-SC-Heavy'}}>
                                        <span style={{width:'120px',color:'#666666',paddingLeft:'10px',fontSize:'16px'}}>银行卡号</span>
                                        <input value={this.state.bankNo} placeholder='1234567890'
                                            onChange={event => this.setState({bankNo:event.target.value})}
                                            style={{height:'40px',width:'90%',color:'#333333',fontSize:'16px',marginTop:'10px',border:'1px solid #ffffff'}} type="text" />
                                    </div>
                                </div>
                                <div style={{height:'calc(100vh - 250px)',paddingTop:'10px'}}>
                                    <div style={{width:'100%',height:'80px',paddingTop:'20px'}}>
                                        <div onClick={()=>this.addBackCard()} style={{width:'100%',height:'40px',lineHeight:'40px',borderRadius:'10px',backgroundColor:'#D53E1C',color:'#ffffff',display:'flex',justifyContent:'center'}}>添加</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
		)
	}
}