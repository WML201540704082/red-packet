import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import {  message } from 'antd';

message.config({
  duration: 3,// 持续时间
  maxCount: 3, // 最大显示数, 超过限制时，最早的消息会被自动关闭
  top: 330,// 到页面顶部距离
});
// 读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
  <App />,document.getElementById('root')
);

reportWebVitals();