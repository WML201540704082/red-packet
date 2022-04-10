import React, { Component } from 'react'
import { Input, message } from 'antd'
import { reqBankList } from '../../../api'
import goback from '../images/goback.png'
// import './withdraw.less'

export default class BankList extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            bankName: '',
            bankList: []
		}
	}
    componentWillMount() {
        this.getBankList()
	}
    getBankList = async () => {
        let params = {
            current: 0,
            size: 100,
            bankName: this.state.bankName
        }
        let result = await reqBankList(params)
        if (result.code === 0) {
            this.setState({
                bankList: result.data.records
            })
        } else {
            message.error(result.msg)
        }
    }
    sureCountry = (item) => {
        this.props.closeModal(item.id,item.bankId,item.backName)
    }
 
	render() {
		return (
            <div style={{background:'#ffffff'}}>
                <div style={{height:'45px',lineHeight:'45px',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center'}}>银行列表</div>
                <img onClick={()=>this.props.closeModal()} src={goback} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                <div style={{height:'50px',padding:'7px 15px'}}>
                    <Input 
                        placeholder="请输入银行名称"
                        style={{height:'36px'}}
                        onChange={event => this.setState({bankName:event.target.value},()=>{this.getBankList()})}
                    />
                </div>
                <div style={{height:'calc(100vh - 95px)',overflowY:'scroll',padding:'10px 10px'}}>
                    {
                        this.state.bankList.map(item => {
                            return (
                                <div onClick={()=>this.sureCountry(item)} style={{height:'40px',lineHeight:'40px',borderBottom:'1px solid #D3D3D3',background:'#f2f2f2'}}>
                                    <span style={{padding:'10px',overflow:'hidden',whiteSpace:'nowrap'}}>{item.backName}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
		)
	}
}