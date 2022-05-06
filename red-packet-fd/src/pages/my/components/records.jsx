import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqRecordsList } from '../../../api'
import './withdraw.less'
import { t } from 'i18next'

export default class Records extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            recordsList: []
		}
	}
    componentWillMount() {
		this.getRecordsList()
	}
    getRecordsList = async () => {
        let params = {
			current: 0,
			size: 100,
		}
        let result = await reqRecordsList(params)
        if (result.code === 0) {
            let sum = 0
            for (let i = 0; i < result.data.records.length; i++) {
                sum += result.data.records[i].amount
            }
            this.setState({
                recordsList: result.data.records,
                sum
            })
        }
    }
    goBack = () => {
        this.props.closeModal()
    }
 
	render() {
		return (
            <div style={{background:'#ffffff',position:'absolute',width:'100%',height:'100%',fontSize:'16px',zIndex:2}}>
                <div style={{height:'50px',lineHeight:'50px',fontSize:'18px',color:'#333333',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>{t('my.withdrawal_record')}</div>
                <img src={goback} onClick={()=>this.goBack()} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                <div style={{height:'calc(100vh - 50px)',overflowY:'scroll'}}>
                    {
                        <div style={{width:'100%',height:'100%'}}>
                            <div className='records_top' style={{height:'50px',lineHeight:'50px',display:'flex'}}>
                                <div style={{width:'50%'}}></div>
                                <div style={{width:'50%',color:'#FFFFFF'}}>
                                    <span style={{float:'right',paddingRight:'20px'}}>{t('my.sum')}:&nbsp;&nbsp;{this.state.sum}</span>
                                </div>
                            </div>
                            <div style={{padding:'0 10px'}}>
                                {
                                    this.state.recordsList.map((item,index)=>{
                                        return (
                                            <div style={{ borderBottom:'1px solid #EFEFEF',height:'50px',lineHeight:'50px',
                                                        marginTop:'10px',paddingLeft:'10px',display:'flex'}}>
                                                <span style={{width:'50%',height:'100%',display:'flex',flexDirection:'column'}}>
                                                    <span style={{height:'30px',lineHeight:'30px'}}>{item.audit === '1' ? t('my.not_audited') : item.audit === '2' ? t('my.audit_failed') : t('my.audit_pass')}</span>
                                                    <span style={{height:'12px',lineHeight:'12px',fontSize:'15px',color:'#999999'}}>{item.createDate}</span>
                                                </span>
                                                <span style={{width:'50%'}}>
                                                    <span style={{float:'right',paddingRight:'10px',color:'#333333',fontSize:'24px',fontFamily:'PingFang-SC-Heavy',fontWeight:'bold'}}>{item.amount}</span>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
		)
	}
}