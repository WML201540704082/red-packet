import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

// 读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
  <App />,document.getElementById('root')
);

reportWebVitals();