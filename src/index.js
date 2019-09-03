import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'antd/dist/antd.css';
import { render } from 'react-dom';
import SignInPage from './components/SignInPage/SignInPage';
import SignUpPage from './components/SignUpPage/SignUpPage';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={SignInPage} />
                <Route path="/signIn" exact component={SignInPage} />
                <Route path="/signUp" component={SignUpPage} />
            </Router>
        );
    }
}

render(<App />, document.getElementById('root'));