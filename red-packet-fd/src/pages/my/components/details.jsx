import React, { Component } from 'react'
import goback from '../images/goback.png'
import { reqDetailsList } from '../../../api'
import './withdraw.less'
import { t } from 'i18next'

export default class Records extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            detailsList: []
		}
	}
    componentWillMount() {
		this.getDetailsList()
	}
    getDetailsList = async () => {
        let params = {
			current: 0,
			size: 100,
		}
        let result = await reqDetailsList(params)
        if (result.code === 0) {
            let sum = 0
            for (let i = 0; i < result.data.records.length; i++) {
                sum += result.data.records[i].amount
            }
            this.setState({
                detailsList: result.data.records,
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
                <div style={{height:'50px',lineHeight:'50px',fontSize:'18px',color:'#333333',display:'flex',justifyContent:'center',borderBottom:'1px solid #DCDCDC'}}>{t('my.commission_details')}</div>
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
                                    this.state.detailsList.map(item=>{
                                        return (
                                            <div style={{ borderBottom:'1px solid #EFEFEF',height:'60px',lineHeight:'50px',
                                                        paddingLeft:'10px',display:'flex'}}>
                                                <span style={{width:'50%',height:'60px',lineHeight:'60px'}}>
                                                    <span style={{fontSize:'18px',color:'#999999'}}>{item.name || '2022-3-03'}</span>
                                                </span>
                                                <span style={{width:'50%'}}>
                                                    <span style={{float:'right',paddingRight:'10px',color:'#333333',fontSize:'24px',fontFamily:'PingFang-SC-Heavy',fontWeight:'bold'}}>
                                                        +<span style={{marginTop:'10px'}}>{item.phone || '30000'}</span>
                                                    </span>
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