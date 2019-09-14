import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './MainPage.scss';

class MainPage extends Component {
    handleExit = () => {
        this.props.history.push('/signIn');
    };

    render() {
        if (!JSON.parse(window.localStorage.getItem('User'))) {
            this.props.history.push('/signIn');
        }
        return (
            <div className="main-page">
                <div className="main-header">

                </div>
                <div className="main-body">

                </div>
                <div className="main-footer">

                </div>
            </div>
        );
    }
};

export default withRouter(MainPage);