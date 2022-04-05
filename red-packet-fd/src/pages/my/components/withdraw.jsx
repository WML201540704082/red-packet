import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqCardList } from '../../../api'
import { Input, message } from 'antd'
import './withdraw.less'

export default class Withdrawal extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            cardList: [{},{},{}]
		}
	}
    componentWillMount() {
        let { balanceAmount } = this.props
        this.setState({
            balanceAmount
        })
		this.getCardList()
	}
    getCardList = async () => {
        let result = await reqCardList()
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
        message.success('提现成功！')
        this.props.sureModal()
    }
	render() {
        var linkStyle;
        if (this.state.hover) {
            linkStyle = {borderColor:'#ffffff'}
        } else {
            linkStyle = {borderColor:'#ffffff'}
        }
		return (
            <div style={{position:'absolute',width:'100%',height:'100%',zIndex:2}}>
                <div style={{height:'50px',lineHeight:'50px',background:'#ffffff',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>提现</div>
                <img src={goback} onClick={()=>this.goBack()} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                <div style={{position:'absolute',top:'16px',right:'15px'}}>添加账号</div>
                <div style={{padding:'30px 20px 0',background:'#f5f5f5'}}>
                    <div style={{paddingBottom:'10px'}}>输入提现金额</div>
                    <div style={{background:'#ffffff',height:'110px',border:'1px solid #D53E1C',borderRadius:'5px',padding:'0 15px'}}>
                        <div style={{height:'70px',lineHeight:'70px',width:'100%',borderBottom:'1px solid #DCDCDC'}}>
                            <Input 
                                onMouseEnter={() => this.setState({hover: !this.state.hover})} 
                                onMouseLeave={() => this.setState({hover: !this.state.hover})}
                                style={linkStyle}
                                // style={{height:'50px',border:'1px solid #ffffff'}}
                                // onChange={event => this.setState({phone:event.target.value})}
                            />
                        </div>
                        <div style={{height:'40px',lineHeight:'40px',color:'#666666',fontSize:'12px'}}>
                            可提现金额：{this.state.balanceAmount || 10000}
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
                                                    <span>{item.name || '123'}</span>
                                                    <span style={{marginLeft:'20px'}}>{item.phone || '12312312312'}</span>
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
		)
	}
}