import React, { Component } from 'react'
import { Carousel, message } from 'antd'
import open from './images/open.png'
import open_en from './images/open_en.png'
import horn from './images/horn.png'
import { reqUnpackLottery, reqGrabCount, reqCarouselInfo } from '../../api'
import close from '../grab/images/close.png'
import memoryUtils from '../../utils/memoryUtils'
import './open.less'
import { t } from 'i18next'
import i18n from 'i18next'

export default class Open extends Component {
    constructor(props) {
		super(props)
		this.state = {
            redPacketShow: false,
            winnerObject: {},
            animation: false,
            status: 0,  // 0: 等待拆开 1: 拆开后
            redPacketAmount: null,
            amountFlag: false,
            carouselList: []
		}
	}
    componentWillMount() {
        // 获取已抢红包个数
        this.getGrabCount()
        // 获取轮番图信息
        this.getCarouselInfo()
    }
    // 获取已抢红包个数
    getGrabCount = async () => {
        let result = await reqGrabCount()
        if (result.code === 0) {
            this.setState({
                redPacketAmount: result.data,
                amountFlag: result.data ? false : true
            })
        }
    }
    // 获取轮番图信息
    getCarouselInfo = async () => {
        let result = await reqCarouselInfo({flag:true})
        if (result.code === 0) {
            this.setState({
                carouselList: [{
                    type: result.data.type,
                    amount: result.data.amount,
                    userId: result.data.userId.substring(0,3)+'****'+result.data.userId.substring(result.data.userId.length-4,result.data.userId.length),
                }]
            })
            // this.getCarouselInfo_2()
        }
    }
    getCarouselInfo_2 = async () => {
        let result = await reqCarouselInfo({flag:false})
        if (result.code === 0) {
            this.setState({
                carouselList: (result.data.disResp || result.data.grabResp) ? 
                               result.data.disResp.map(item=>{
                                   return {
                                       ...item,
                                       userId: item.userId.substring(0,3)+'****'+item.userId.substring(item.userId.length-4,item.userId.length)
                                   }
                               }).concat(result.data.grabResp).map(item=>{
                                    return {
                                        ...item,
                                        userId: item.userId.substring(0,3)+'****'+item.userId.substring(item.userId.length-4,item.userId.length)
                                    }
                               }) : result.data.randomResp.map(item=>{
                                    return {
                                        ...item,
                                        userId: item.userId.substring(0,3)+'****'+item.userId.substring(item.userId.length-4,item.userId.length)
                                    }
                               })
            })
        }
    }
    oepnRedPacket = () => {
        let { winnerObject, redPacketAmount, amountFlag, status } = this.state
        if (amountFlag) {
            return(
                <div className='go_grab_outer'>
                    <div className='shadow' onClick={() => this.setState({redPacketShow: false})}></div>
                    <div className='go_grab'>
                        <div className='go_grab_top'>
                            <div className='go_grab_top_top'>{t('open.reminder')}</div>
                            <div className='go_grab_top_bottom'>
                                <div className='go_grab_top_bottom_inner'>{t('open.you_do_not_have_an_unopened_red_envelope,please_grab_the_red_envelope_first')}</div>
                            </div>
                        </div>
                        <div className='go_grab_bottom'>
                            <div className='go_grab_button' onClick={() => this.props.history.push("/grab")}>{t('open.immediately_go_grab')}</div>
                        </div>
                    </div>
                </div>
            )
        } else {
            if (redPacketAmount) {
                if (status === 0) {
                    return(
                        <div className='redpack_outer'>
                            <div className='redpack'>
                                <div className='topcontent' style={{borderRadius: '10px 10px 50% 50% / 10px 10px 15% 15%'}}>
                                    <div className='topcontent_content'>{t('open.wish_you_become_rich,wish_you_auspicious_and_propitious_in_the_new_year')}</div>
                                </div>
                                <div id='redpack-open' className={this.state.animation ? 'rotate' : ''} onClick={this.openRedPacket.bind(this)}>開</div>
                            </div>
                            <div className='bottom_close'>
                                <img src={close} onClick={() => this.setState({redPacketShow: false})} alt="" />
                            </div>
                        </div>
                    )
                } else {
                    return(
                        <div className='winner_outer'>
                            <div className='winner'>
                                <div className='winner_top'>
                                    <div>{t('open.congratulations!You_have_won_a_big_prize')}</div>
                                </div>
                                <div className='winner_middle'>
                                    <div>{winnerObject.amount}</div>
                                </div>
                                <div className='winner_bottom'>
                                    <div className='winner_bottom_content' onClick={() => this.nextOne()}>{t('open.once_more')}》</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        }
    }
    nextOne = async () => {
        let result = await reqGrabCount()
        if (result.code === 0) {
            this.setState({
                redPacketAmount: result.data,
                amountFlag: result.data ? false : true,
                status: 0
            },()=>{
                this.oepnRedPacket()
            })
        }
    }
    openRedPacket = async () => {
        let result = await reqUnpackLottery()
        if (result.code === 0) {
            this.setState({
                winnerObject: result.data,
                carouselList: [{
                    type: '0',
                    amount: result.data.amount,
                    userId: memoryUtils.user.userId.substring(0,3)+'****'+memoryUtils.user.userId.substring(memoryUtils.user.userId.length-4,memoryUtils.user.userId.length),
                }]
            },()=>{
                // 重新获取轮番图信息
                this.getCarouselInfo()
            })
            this.setState({animation: true});
            setTimeout(this.stopAnimation.bind(this), 2000);
            setTimeout(this.showResult.bind(this), 2000);
        } else {
            message.error(result.msg)
        }
    }
    stopAnimation() {
        this.setState({animation: false});
    }
    showResult() {
        this.setState({status: 1});
    }
    openShow = () => {
        let { carouselList } = this.state
        let list = [];
        for (let i = 0; i < 15; i++) {
            list.push({index:i})
        }
        return(
            <div>
                <div className='carousel'>
                    <div className='carousel_content'>
                        <Carousel autoplay effect='scrollx' dotPosition='right' dots={false} autoplaySpeed={4000} speed={2000}>
                            {
                                carouselList ? carouselList.map(item=>{
                                    return(
                                        <div className='content_item'>
                                            <div className='content_item_left'>
                                                <img src={horn} style={{width:'20px'}} alt="horn"/>
                                            </div>
                                            <div className='content_item_right'>
                                                {item.userId + (item.type === "0" ? t('open.unpack') : item.type === "1" ? t('open.grab') : t('open.unpack')) + item.amount}
                                            </div>
                                        </div>
                                    )
                                }) : null
                            }
                        </Carousel>
                    </div>
                </div>
                <div className='openImg'>
                    {
                        list.map(item=>{
                            return (
                                <div className='openContent' key={item.index} onClick={() => this.setState({redPacketShow: true})}>
                                    <span className='content_img'>
                                        <img src={i18n.language === 'zh' ? open : i18n.language === 'cn' ? open_en : open_en} alt="open"/>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className='open'>
                {this.openShow()}
                {this.state.redPacketShow ? this.oepnRedPacket() : null}
            </div>
        )
    }
}
