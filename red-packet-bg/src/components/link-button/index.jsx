import React from 'react'
import './index.less'

// 以前类定义组件
// 下面函数定义组件
/*
 外形像链接的按钮
*/
export default function LinkButton(props) {
    return <button {...props} className="link-button"></button>
}
