import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { render } from 'react-dom';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import MainPage from './components/MainPage';
import PongPage from './components/Games/PongPage';
import registerServiceWorker from './registerServiceWorker';


class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={PongPage} />
                <Route path="/signIn" exact component={SignInPage} />
                <Route path="/signUp" component={SignUpPage} />
                <Route path="/mainPage" component={MainPage} />
                <Route path="/pong" component={PongPage} />

            </Router>
        );
    }
}

render(<App />, document.getElementById('root'));
registerServiceWorker();