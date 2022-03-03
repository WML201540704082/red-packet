import React, {Component} from "react"
import { PropTypes } from "prop-types"
import {
    Form,
    Input,
} from 'antd'

const Item = Form.Item

/*
添加分类的form组建
 */
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数

    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render() {
        return (
            <Form>
                <Item label='角色名称' name='roleName' rules={[{required: true, message: '角色名称必须输入'}]}>
                    <Input placeholder="请输入角色名称"/>
                </Item>
            </Form>
        )
    }
}

export default AddForm