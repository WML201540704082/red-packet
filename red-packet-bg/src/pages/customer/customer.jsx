import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import "./customer.less";
import { Upload, Progress, message, Form, Input, Button } from "antd";
import { reqAddCustomer, reqCustomerDetail } from '../../api'
const { Item } = Form

const Customer = () => {
    const [defaultFileList, setDefaultFileList] = useState([]);
    const [progress, setProgress] = useState(0);
    const [teleAccount, setTeleAccount] = useState('');
    const [url, setUrl] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        getCustomerDetail();
    });

    const getCustomerDetail = async () => {
        let result = await reqCustomerDetail()
        if (result.code === 0) {
            setId(result.data.id)
            setUrl(result.data.url)
            setTeleAccount(result.data.teleAccount)
        }
    }

    const uploadImage = async options => {
        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        fmData.append("file", file);
        const config = {
            headers: { "content-type": "multipart/form-data" },
            onUploadProgress: event => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
            }
        };
        try {
            const res = await axios.post(
                "api/customer/upload",
                fmData,
                config
            );
            if (res.data.code === 0) {
                setUrl(res.data.data)
                message.success('上传成功')
            }

            onSuccess("Ok");
                console.log("server res: ", res);
            } catch (err) {
                console.log("Eroor: ", err);
                //   const error = new Error("Some error");
                onError({ err });
            }
    };

    const handleOnChange = ({ file, fileList, event }) => {
        //Using Hooks to update the state to the current filelist
        setDefaultFileList(fileList);
        //filelist - [{uid: "-1",url:'Some url to image'}]
    };
    const teleAccountConfig = e => {
        setTeleAccount(e.target.value)
        // teleAccount = e.target.value
    }
    const saveOk = async () => {
        let params = {
            id:  id || null,
            url,
            teleAccount
        }
        let result = await reqAddCustomer(params)
        if (result.code === 0) {
            message.success('保存成功！')
        } else {
            return message.error(result.msg)
        }
    }

    return (
        <div class="container">
            <Upload
                accept="image/*"
                customRequest={uploadImage}
                onChange={handleOnChange}
                listType="picture-card"
                defaultFileList={defaultFileList}
                className="avatar-uploader"
                // onProgress={({ percent }) => {
                //   console.log("progre...", percent);
                //   if (percent === 100) {
                //     setTimeout(() => setProgress(0), 1000);
                //   }
                //   return setProgress(Math.floor(percent));
                // }}
            >
                {defaultFileList.length >= 1 ? null : <div>+</div>}
            </Upload>
            {progress > 0 ? <Progress percent={progress} /> : null}
            <Form labelCol={{span: 15}}>
				<Item name="teleAccount" label="tele账号" rules={[{ required: true, message: 'tele账号不可以为空!' }]}>
				    <Input style={{width:'200px'}} placeholder="请输入tele账号！" onChange={e => teleAccountConfig(e)} />
				</Item>
            </Form>
            <Button onClick={saveOk}>保存</Button>
        </div>
    );
};
export default Customer;