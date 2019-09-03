import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, message } from 'antd';
import './SignUpPage.scss';

class SignUpPage extends Component {
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

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    handleSignUp = (e) => {
        e.preventDefault();
        let temp = e.target;
        let db = this.state.DataBase;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        let reg = 0;
        db.forEach(el => {
            if (temp[0].value === el.login) {
                reg = 3;
            } else {
                if (temp[1].value === temp[2].value) {
                    reg = 1;
                } else {
                    reg = 2;
                };
            };
        });
        if (reg === 1) {
            db.push({
                id: db.length,
                login: temp[0].value,
                password: temp[1].value
            })

            window.localStorage.setItem('DataBase', JSON.stringify(db));
            this.props.history.push('MainPage');
            this.props.history.push('MainPage');
        } else if (reg === 2) {
            message.error('You have entered the wrong password!');
        } else {
            message.error('This login in use!');
        }
    };

    handleSignIn = () => {
        this.props.history.push('signIn');
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="center-reg">
                <div className="sign-up-form">
                    <Form onSubmit={this.handleSignUp} className="login-form">
                        <Form.Item label="Username">
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        type: 'username',
                                        message: 'The input is not valid username!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item className="gor-center">
                            <Button type="primary" htmlType="submit" className="login-form-button">Register</Button> Or <a onClick={this.handleSignIn}>log in!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
};

export default Form.create()(withRouter(SignUpPage));