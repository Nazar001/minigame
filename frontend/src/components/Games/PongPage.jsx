import React, { Component } from 'react';
import { withRouter } from "react-router";
import './PongPage.scss';
import { Stage, Layer, Rect, Circle, Text, Label } from 'react-konva';

const URL = 'ws://localhost:3030'

let leftData = {
    leftY: document.documentElement.clientHeight / 2 - 45,
};

let rightData = {
    rightY: document.documentElement.clientHeight / 2 - 45,
};


let leftObj = {};
let rightObj = {};

// TODO1 localstorage: x,y plates  

class PongPage extends Component {
    state = {
        ballDirection: false,

        isPlaying: false,
        botActive: false,
        play: {
            leftY: leftData.leftY,
            rightY: rightData.rightY,
            ballX: document.documentElement.clientWidth / 2 - 5,
            ballY: document.documentElement.clientHeight / 2 - 5,
        }
    }

    ws = new WebSocket(URL)

    componentDidMount() {
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }
        debugger
        this.ws.onmessage = evt => {
            debugger
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            console.log('update');
            this.up(message);
        }

        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
            this.setState({
                ws: new WebSocket(URL),
            })
        }
    };

    updateRight = (message) => {
        debugger
        let obj = {
            rightY: message,
            leftY: this.state.play.leftY,
            ballX: this.state.play.ballX,
            ballY: this.state.play.ballY
        };
        this.ws.send(JSON.stringify(obj));
        this.setState({
            play: {
                rightY: message,
                leftY: this.state.play.leftY,
                ballX: this.state.play.ballX,
                ballY: this.state.play.ballY
            }
        });
    }

    updateLeft = (message) => {
        debugger
        let obj = {
            leftY: message,
            rightY: this.state.play.rightY,
            ballX: this.state.play.ballX,
            ballY: this.state.play.ballY
        };
        this.ws.send(JSON.stringify(obj));
        this.setState({
            play: {
                leftY: message,
                rightY: this.state.play.rightY,
                ballX: this.state.play.ballX,
                ballY: this.state.play.ballY
            }
        });
    }

    up = (message) => {
        debugger
        this.setState({
            play: {
                leftY: message.leftY,
                rightY: message.rightY,
                ballX: message.ballX,
                ballY: message.ballY
            }
        })
    };

    moveBall = () => {
        this.setState({
            isPlaying: true
        })

        let fieldH = document.documentElement.clientHeight;
        let scaleX = Math.random() * 3;
        let scaleY = Math.random() * 3;
        let temp = setInterval(() => {
            if (this.state.botActive) this.ai();
            this.setState({
                play: {
                    leftY: this.state.play.leftY,
                    rightY: this.state.play.rightY,
                    ballX: this.state.ballX += scaleX,
                    ballY: this.state.ballY += scaleY
                }
            })
            // Мячик по-вертикали
            if (this.state.ballY < 0 || this.state.ballY + 20 > fieldH) {
                scaleY = -scaleY;
            }
            // Мячик направо
            if (this.state.ballX > document.documentElement.clientWidth - 16) {
                scaleX = Math.random() * -3;
                scaleY = Math.random() * 3;
                let temp = this.state.leftScore + 1;
                this.setState({
                    play: {
                        leftY: this.state.play.leftY,
                        rightY: this.state.play.rightY,
                        ballX: document.documentElement.clientWidth / 2 - 5,
                        ballY: document.documentElement.clientHeight / 2 - 5
                    },
                    leftScore: temp
                })
                leftObj = {
                    leftY: this.state.leftY
                }
                debugger
                this.updateLeft(leftObj.leftY)
            }

            // Мячик налево
            if (this.state.ballX < 16) {
                scaleX = Math.random() * 3;
                scaleY = Math.random() * 3;
                let temp = this.state.rightScore + 1;
                this.setState({
                    play: {
                        leftY: this.state.play.leftY,
                        rightY: this.state.play.rightY,
                        ballX: document.documentElement.clientWidth / 2 - 5,
                        ballY: document.documentElement.clientHeight / 2 - 5
                    },
                    rightScore: temp
                })
                rightObj = {
                    rightY: this.state.rightY
                }
                this.updateRight()
            }
            if (this.touch(this.Circle, this.Rect) === true || this.touch(this.Circle, this.Rectangle) === true) {
                scaleX = -scaleX * 1.1;
            }
            if (this.state.leftScore === 21) {
                alert(this.state.leftName + ' wins')
                clearInterval(temp);
            }
            else if (this.state.rightScore === 21) {
                alert(this.state.rightName + ' wins')
                clearInterval(temp);
            }
        })

    }

    ai = () => {
        if (this.Circle.attrs.y < this.Rectangle.attrs.y + this.Rectangle.attrs.height) {
            if (this.Rectangle.attrs.y > 0)
                this.Rectangle.to({
                    x: this.Rectangle.attrs.x,
                    y: this.Rectangle.attrs.y - this.Rectangle.attrs.height / 2,
                    duration: 0.03
                })
        }
        else {
            if (this.Rectangle.attrs.y < document.documentElement.clientHeight - this.Rectangle.attrs.height)
                this.Rectangle.to({
                    x: this.Rectangle.attrs.x,
                    y: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 2,
                    duration: 0.03
                })
        }
    }

    touch = (a, b) => {
        if (a.attrs.x + a.attrs.radius > b.attrs.x &&
            a.attrs.x < b.attrs.x + b.attrs.width &&
            a.attrs.y + a.attrs.radius > b.attrs.y &&
            a.attrs.y < b.attrs.y + b.attrs.height)
            return true;
        else
            return false;
    }
    touch = (a, b) => {
        if (a.attrs.x + a.attrs.radius > b.attrs.x &&
            a.attrs.x < b.attrs.x + b.attrs.width &&
            a.attrs.y + a.attrs.radius > b.attrs.y &&
            a.attrs.y < b.attrs.y + b.attrs.height)
            return true;
        else
            return false;
    }

    handleKeyUp = e => {
        if (e.keyCode === 107) this.setState({
            botActive: !this.state.botActive
        })

        if (e.keyCode === 32)
            if (this.state.isPlaying === false)
                this.moveBall()
        //Левый
        // ВНИЗ!
        if (e.keyCode === 83)
            if (this.Rect.attrs.y < document.documentElement.clientHeight - this.Rect.attrs.height) {
                this.Rect.to({
                    y: this.Rect.attrs.y + this.Rect.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    play: {
                        leftY: this.Rect.attrs.y + this.Rect.attrs.height / 3
                    }
                })
                this.updateLeft(this.Rect.attrs.y + this.Rect.attrs.height / 3)
            }
        // ВВЕРХ!
        if (e.keyCode === 87)
            if (this.Rect.attrs.y > 0) {
                this.Rect.to({
                    y: this.Rect.attrs.y - this.Rect.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    play: {
                        leftY: this.Rect.attrs.y - this.Rect.attrs.height / 3
                    }
                });
                this.updateLeft(this.Rect.attrs.y - this.Rect.attrs.height / 3)

            }

        // Правый
        // ВНИЗ!
        if (e.keyCode === 40)
            if (this.Rectangle.attrs.y < document.documentElement.clientHeight - this.Rectangle.attrs.height) {
                this.Rectangle.to({
                    y: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    play: {
                        rightY: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3
                    }
                })
                this.updateRight(this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3)
            }
        // ВВЕРХ!
        if (e.keyCode === 38)
            if (this.Rectangle.attrs.y > 0) {
                this.Rectangle.to({
                    y: this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    play: {
                        rightY: this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3
                    }
                })
                this.updateRight(this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3)
            }
    };

    render() {
        return (
            <div tabIndex='1' onKeyUp={this.handleKeyUp}>
                <Stage width={document.documentElement.clientWidth} height={document.documentElement.clientHeight} >
                    <Layer>
                        <Rect
                            x={0}
                            y={0}
                            width={document.documentElement.clientWidth}
                            height={document.documentElement.clientHeight}
                            fill='green'
                        />
                        <Rect
                            x={document.documentElement.clientWidth / 2 - 10}
                            y={0}
                            width={10}
                            height={document.documentElement.clientHeight}
                            fill='white'
                            opacity={0.8}
                        />
                    </Layer>
                    <Layer key="ballLayer">
                        <Circle
                            ref={node => {
                                this.Circle = node;
                            }}
                            x={this.state.play.ballX}
                            y={this.state.play.ballY}
                            radius={16}
                            fill="white"
                        />
                        <Rect
                            id='leftPlayer'
                            ref={node => {
                                this.Rect = node;
                            }}
                            x={20}
                            y={this.state.play.leftY}
                            width={15}
                            height={90}
                            fill='black'
                            onKeyUp={this.handleKeyUp}
                        />
                        <Rect
                            id='rightPlayer'
                            ref={node => {
                                this.Rectangle = node;
                            }}
                            x={document.documentElement.clientWidth - 35}
                            y={this.state.play.rightY}
                            width={15}
                            height={90}
                            fill='black'
                        />
                    </Layer>
                    <Layer>
                        <Label>
                            <Text
                                x={document.documentElement.clientWidth / 2 - 120}
                                fontSize={90}
                                text={`${this.state.leftScore}`}
                                wrap="char"
                                align="center"
                            />
                            <Text
                                x={document.documentElement.clientWidth / 2 - 43}
                                fontSize={90}
                                text=' : '
                                wrap="char"
                                align="center"
                            />
                            <Text
                                x={document.documentElement.clientWidth / 2 + 30}
                                fontSize={90}
                                text={`${this.state.rightScore}`}
                                wrap="char"
                                align="center"
                            />
                        </Label>
                    </Layer>
                </Stage >
            </div>
        );
    }
}

export default withRouter(PongPage)