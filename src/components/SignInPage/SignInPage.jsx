import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, message } from 'antd';
import './SignInPage.scss';
const error = () => {
    message.error('This is an error message');
};

class SignInPage extends Component {
    constructor(props) {
        super(props);

        const arrayFromlocalStorage = JSON.parse(window.localStorage.getItem('DataBase'));

        if (arrayFromlocalStorage && arrayFromlocalStorage.length) {
            this.state = {
                DataBase: arrayFromlocalStorage
            };
        } else {
            this.state = {
                DataBase: [{
                    id: 0,
                    login: 'admin',
                    password: 'admin'
                }]
            };
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let temp = e.target;
        let db = this.state.DataBase;
        db.forEach(el => {
            debugger
            if(temp[0].value === el.login){
                return {error};
            };
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="center">
                <div className="sign-in-form">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className="gor-center">
                            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button> Or <a href="">register now!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
};

export default Form.create()(withRouter(SignInPage));