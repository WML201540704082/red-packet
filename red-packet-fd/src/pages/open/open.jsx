import React, { Component } from 'react'
import open from './images/open.png'
import './open.less'

export default class Open extends Component {
    oepnRedPacket = () => {
        
    }
    openShow = () => {
        let list = [];
        for (let i = 0; i < 15; i++) {
            list.push({index:i})
        }
        return(
            <div className='openImg'>
                {
                    list.map(item=>{
                        return (
                            <div className='openContent' key={item.index} onClick={() => this.oepnRedPacket(item)}>
                                <span className='content_img'>
                                    <img src={open} alt="open"/>
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    render() {
        return (
            <div className='open'>
                {this.openShow()}
            </div>
        )
    }
}
