import React, { Component } from 'react';
import { withRouter } from "react-router";
import './PongPage.scss';
import { Stage, Layer, Rect, Circle, Group, Arrow, Tag, Text, Label } from 'react-konva';



class PongPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ballDirection: false,
            ballX: document.documentElement.clientWidth / 2 - 5,
            ballY: document.documentElement.clientHeight / 2 - 5,
            isPlaying: false,
            leftScore: 0,
            rightScore: 0
        }
    }

    moveBall = () => {
        this.setState({
            isPlaying: true
        })
        if (this.state.isPlaying === true) {
            let fieldH = document.documentElement.clientHeight;
            let scaleX = Math.random() * 3;
            let scaleY = Math.random() * 3;
            let temp = setInterval(() => {
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
                }
                if (this.touch(this.Circle, this.Rect) === true || this.touch(this.Circle, this.Rectangle) === true) {
                    scaleX = -scaleX * 1.1;
                }
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

    handleKeyUp = e => {
        if (e.keyCode === 32) this.moveBall()
        //Левый
        // ВНИЗ!
        if (e.keyCode === 83)
            if (this.Rect.attrs.y < document.documentElement.clientHeight - this.Rect.attrs.height)
                this.Rect.to({
                    y: this.Rect.attrs.y + this.Rect.attrs.height,
                    duration: 0.03
                })
        // ВВЕРХ!
        if (e.keyCode === 87)
            if (this.Rect.attrs.y > 0) {
                this.Rect.to({
                    y: this.Rect.attrs.y - this.Rect.attrs.height,
                    duration: 0.03
                })
            }

        // Правый
        // ВНИЗ!
        if (e.keyCode === 40)
            if (this.Rectangle.attrs.y < document.documentElement.clientHeight - this.Rectangle.attrs.height)
                this.Rectangle.to({
                    y: this.Rectangle.attrs.y + this.Rectangle.attrs.height,
                    duration: 0.03
                })
        // ВВЕРХ!
        if (e.keyCode === 38)
            if (this.Rectangle.attrs.y > 0) {
                this.Rectangle.to({
                    y: this.Rectangle.attrs.y - this.Rectangle.attrs.height,
                    duration: 0.03
                })
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
                            y={document.documentElement.clientHeight / 2 - 45}
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
                            y={document.documentElement.clientHeight / 2 - 45}
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