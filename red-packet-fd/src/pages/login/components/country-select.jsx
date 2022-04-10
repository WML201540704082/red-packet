//对话框表单组件
import React, { Component } from 'react'
import goback from '../images/goback.png'

export default class CountrySelect extends Component {
    formRef = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
            countryCode: [],
		}
	}
    componentWillMount() {
		let { countryCode } = this.props
		this.setState({
            countryCode
		})
	}
    sureCountry = (item) => {
        this.props.closeModal(item.phone_code)
    }
 
	render() {
		return (
            <div>
                <div style={{height:'45px',lineHeight:'45px',fontSize:'16px',fontWeight:'bold',display:'flex',justifyContent:'center',background:'#ffffff'}}>选择国家区码</div>
                <img onClick={()=>this.props.goBackModal()} src={goback} style={{position:'absolute',top:'16px',left:'15px',width:'15px'}} alt="goback"/>
                <div style={{height:'calc(100vh - 45px)',overflowY:'scroll'}}>
                    <div style={{height:'10px',background:'rgb(243 243 243)'}}></div>
                    {
                        this.state.countryCode.map(item => {
                            return (
                                <div onClick={()=>this.sureCountry(item)} style={{height:'40px',lineHeight:'40px',borderBottom:'1px solid #D3D3D3'}}>
                                    <span style={{padding:'10px'}}>{item.chinese_name}</span>
                                    <span style={{float:'right',marginRight:'10px'}}>{'+'+item.phone_code}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
		)
	}
}