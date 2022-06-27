import React, { Component } from 'react'
import { Form, Input, message } from "antd";
import axios from "axios";
import { reqAddCustomer, reqCustomerDetail } from '../../api'
import './customer.less'
let { Item } = Form

export default class ProxyList extends Component {
    constructor(props){
        super(props);
        this.state={
            id: null,
            teleAccount: '',
            img: '',
            url: ''
        }
    }
    componentWillMount() {
        this.getCustomerDetails()
    }
    getCustomerDetails = async () => {
        let result = await reqCustomerDetail()
        if (result.code === 0) {
            this.setState({
                id: result.data.id,
                url: result.data.url,
                teleAccount: result.data.teleAccount
            })
        }
    }
    filrChange = async () =>{
        // 获取文件的属性files
        let picDiv = document.getElementById("images").files[0];//xian获取一个
        // 给一个判断，没上传 神魔都不做
        if(!picDiv) return;

        // 打印这个文件看一哈
        console.log(picDiv);//拿到这个图片对象：File {name: "163.png", lastModified: 1584158929773, lastModifiedDate: Sat Mar 14 2020 12:08:49 GMT+0800 (中国标准时间), webkitRelativePath: "", size: 641604, …}
        //从获取的文件对象中，获取图片数据（获取当前图片的Base64码）
        let filerReader = new FileReader();
        //把你得到的图片放进来
        filerReader.readAsDataURL(picDiv);
        //触发加载完成这个事件
        filerReader.onload = ev =>{
            // 拿到Base64码，然后创建图片
            this.img = new Image();//把这个图片挂载到一个实例上
            let img=ev.target.result;//这个事件源里 就是Base64码
            //把图片展示出来
            this.setState({
                img:img
            })
        }
        const fmData = new FormData();
        fmData.append("file", picDiv);
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };
        const res = await axios.post(
            "api/customer/upload",
            fmData,
            config
        );
        if (res.data.code === 0) {
            this.setState({
                url: res.data.data
            })
        } else {
            message.error(res.data.msg)
        }
    }
    saveOk = async () => {
        let { id, url, img, teleAccount } = this.state
        if (!url && !img) {
            message.warning('请先上传图片')
        } else if (!teleAccount) {
            message.warning('请填写tele账号')
        } else {
            let params = {
                id,
                url: url || img,
                teleAccount
            }
            let result = await reqAddCustomer(params)
            if (result.code === 0) {
                message.success('保存成功！')
            } else {
                return message.error(result.msg)
            }
        }
    }
    render() {
        let {  img, url, teleAccount } = this.state
        return (
            <Form labelCol={{span: 2}} ref={this.formRef} style={{paddingTop:'20px'}}>
				<Item label="客服二维码">
                    <div class="btn-box">
                        <button class="btn">上传图片</button>
                        <input type="file" id="images" onChange={this.filrChange} accept="image/*" class="file-ipt" />
                    </div>
				</Item>
                <Item style={{marginLeft:'100px', display:img || url ? '' : 'none'}}>
                    <img src={img || url} width="200" alt=""/>
                </Item>
				<Item label="tele账号">
					<Input value={teleAccount} placeholder="请输入tele账号！" style={{'width': '200px'}} onChange={ e => this.setState({teleAccount:e.target.value})} />
				</Item>
                <button class="btn" style={{marginLeft:'100px'}} onClick={()=>this.saveOk()}>保存</button>
			</Form>
        )
    }
}
