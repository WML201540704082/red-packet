import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import { ConfigProvider } from "antd"
import zhCN from "antd/lib/locale/zh_CN"

// 读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
  ,document.getElementById('root')
);

reportWebVitals();