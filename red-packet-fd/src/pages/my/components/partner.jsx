import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqPartnerList } from '../../../api'

export default class Partner extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            partnerList: [{},{},{}]
		}
	}
    componentWillMount() {
		this.getPartnerList()
	}
    getPartnerList = async () => {
        let result = await reqPartnerList()
        if (result.code === 0) {
            this.setState({
                partnerList: result.data.records
            })
        }
    }
    goBack = () => {
        this.props.closeModal()
    }
 
	render() {
		return (
            <div style={{background:'#ffffff',position:'absolute',width:'100%',height:'100%',zIndex:2}}>
                <div style={{height:'50px',lineHeight:'50px',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>我的伙伴</div>
                <img src={goback} onClick={()=>this.goBack()} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                <div style={{height:'calc(100vh - 50px)',padding:'0 20px',overflowY:'scroll'}}>
                    {
                        <div style={{width:'100%',height:'100%'}}>
                            <div style={{height:'40px',lineHeight:'40px',color:'#0F0F0F'}}>
                            合计：36人
                            </div>
                            <div>
                                <table width="100%" align="center">
                                    <thead>
                                        <tr style={{height:'30px',fontSize:'14px'}}>
                                            <th style={{fontWeight:'normal'}}>序号</th>
                                            <th style={{fontWeight:'normal'}}>账号</th>
                                            <th style={{fontWeight:'normal'}}>级别</th>
                                        </tr>
                                    </thead>
                                    <tbody align="center">
                                        {
                                            this.state.partnerList.map((item,index)=>{
                                                return (
                                                    <tr style={{height:'30px',fontSize:'12px',fontWeight:'normal'}}>
                                                        <th style={{fontWeight:'normal'}}>{index+1}</th>
                                                        <th style={{fontWeight:'normal'}}>{item.userId}</th>
                                                        <th style={{fontWeight:'normal'}}>{item.actingLevel}</th>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
		)
	}
}