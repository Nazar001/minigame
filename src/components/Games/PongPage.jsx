import React, { Component } from 'react';
import { withRouter } from "react-router";
import './PongPage.scss';
import { Stage, Layer, Rect, Circle, Text, Label } from 'react-konva';

let leftData = {
    leftName: 'Biba',
    leftScore: 0,
    leftY: document.documentElement.clientHeight / 2 - 45,
};
window.localStorage.setItem('leftData', JSON.stringify(leftData));

let rightData = {
    rightName: 'Boba',
    rightScore: 0,
    rightY: document.documentElement.clientHeight / 2 - 45,
};
window.localStorage.setItem('rightData', JSON.stringify(rightData));


let leftObj = {};
let rightObj = {};

// TODO1 localstorage: x,y plates  

class PongPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ballDirection: false,
            ballX: document.documentElement.clientWidth / 2 - 5,
            ballY: document.documentElement.clientHeight / 2 - 5,
            isPlaying: false,
            botActive: false,

            //left
            leftName: leftData.leftName,
            leftScore: leftData.leftScore,
            leftY: leftData.leftY,
            //right
            rightName: rightData.rightName,
            rightScore: rightData.rightScore,
            rightY: rightData.rightY,
        }
    }
    updateRight = () => {
        let rightData = JSON.parse(window.localStorage.getItem('rightData'))
        this.setState({
            //right
            rightName: rightData.rightName,
            rightScore: rightData.rightScore,
            rightY: rightData.rightY,
        })
        window.localStorage.setItem('rightData', JSON.stringify(rightData));
    }

    updateLeft = () => {
        let leftData = JSON.parse(window.localStorage.getItem('leftData'))
        this.setState({
            //left
            leftName: leftData.leftName,
            leftScore: leftData.leftScore,
            leftY: leftData.leftY,
        })
        window.localStorage.setItem('leftData', JSON.stringify(leftData));

    }
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
                ballX: this.state.ballX += scaleX,
                ballY: this.state.ballY += scaleY
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
                    ballX: document.documentElement.clientWidth / 2 - 5,
                    ballY: document.documentElement.clientHeight / 2 - 5,
                    leftScore: temp
                })
                leftObj = {
                    leftName: leftData.leftName,
                    leftY: this.state.leftY,
                    leftScore: this.state.leftScore
                }
                window.localStorage.setItem('leftData', JSON.stringify(leftObj));
                this.updateLeft()
            }

            // Мячик налево
            if (this.state.ballX < 16) {
                scaleX = Math.random() * 3;
                scaleY = Math.random() * 3;
                let temp = this.state.rightScore + 1;
                this.setState({
                    ballX: document.documentElement.clientWidth / 2 - 5,
                    ballY: document.documentElement.clientHeight / 2 - 5,
                    rightScore: temp
                })
                rightObj = {
                    rightName: rightData.rightName,
                    rightY: this.state.rightY,
                    rightScore: this.state.rightScore
                }
                window.localStorage.setItem('rightData', JSON.stringify(rightObj));
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

    handleKeyDown = e => {
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
                    leftY: this.Rect.attrs.y + this.Rect.attrs.height / 3
                })
                leftObj = {
                    leftName: leftData.leftName,
                    leftY: this.state.leftY,
                    leftScore: this.state.leftScore
                }
                window.localStorage.setItem('leftData', JSON.stringify(leftObj));
                this.updateLeft()
            }
        // ВВЕРХ!
        if (e.keyCode === 87)
            if (this.Rect.attrs.y > 0) {
                this.Rect.to({
                    y: this.Rect.attrs.y - this.Rect.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    leftY: this.Rect.attrs.y - this.Rect.attrs.height / 3
                })
                leftObj = {
                    leftName: leftData.leftName,
                    leftY: this.state.leftY,
                    leftScore: this.state.leftScore
                }
                window.localStorage.setItem('leftData', JSON.stringify(leftObj));
                this.updateLeft()

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
                    rightY: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3
                })
                rightObj = {
                    rightName: rightData.rightName,
                    rightY: this.state.rightY,
                    rightScore: this.state.rightScore
                }
                window.localStorage.setItem('rightData', JSON.stringify(rightObj));
                this.updateRight()
            }
        // ВВЕРХ!
        if (e.keyCode === 38)
            if (this.Rectangle.attrs.y > 0) {
                this.Rectangle.to({
                    y: this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3,
                    duration: 0.06
                })
                this.setState({
                    rightY: this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3
                })
                rightObj = {
                    rightName: rightData.rightName,
                    rightY: this.state.rightY,
                    rightScore: this.state.rightScore
                }
                window.localStorage.setItem('rightData', JSON.stringify(rightObj));
                this.updateRight()
            }
    };

    render() {
        return (
            <div tabIndex='1' onKeyDown={this.handleKeyDown}>
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
                            x={this.state.ballX}
                            y={this.state.ballY}
                            radius={16}
                            fill="white"
                        />
                        <Rect
                            id='leftPlayer'
                            ref={node => {
                                this.Rect = node;
                            }}
                            x={20}
                            y={this.state.leftY}
                            width={15}
                            height={90}
                            fill='black'
                            onKeyDown={this.handleKeyDown}
                        />
                        <Rect
                            id='rightPlayer'
                            ref={node => {
                                this.Rectangle = node;
                            }}
                            x={document.documentElement.clientWidth - 35}
                            y={this.state.rightY}
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