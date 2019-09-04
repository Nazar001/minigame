import React, { Component } from 'react';
import { withRouter } from "react-router";
import './PongPage.scss';
import { Stage, Layer, Rect, Circle, Group, Arrow, Tag, Text, Label } from 'react-konva';
import Konva from 'react-konva';



class PongPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ballDirection: false
        }
    }

    moveBall = () => {
        let fly = Math.random() * 1000;
        if (fly / 1000 > 0.5) this.bottom(this.Circle);
        if (fly / 1000 <= 0.5) this.top(this.Circle);
    }

    bottom = (a) => {
        let endY = document.documentElement.clientHeight - 20;
        let fly = Math.random() * 1000;
        if (this.state.ballDirection === true) fly *= -1;
        a.to({
            x: this.Circle.attrs.x - fly,
            y: endY,
            duration: 1,
            onFinish: () => {
                if (a.attrs.y === endY) {
                    this.top(a);
                }
            }
        })
        if (a.attrs.x <= 0) {
            a.to({
                x: document.documentElement.clientWidth / 2 - 5,
                y: document.documentElement.clientHeight / 2 - 5,
                duration: 0
            })
        }

    }

    top = (a) => {
        let fly = Math.random() * 1000;
        if (this.state.ballDirection === true) fly *= -1;
        a.to({
            x: this.Circle.attrs.x - fly,
            y: 20,
            duration: 1,
            onFinish: () => {
                if (a.attrs.y === 20) {
                    this.bottom(a);
                }
            }
        })
        if (a.attrs.x <= 0) {
            a.to({
                x: document.documentElement.clientWidth / 2 - 5,
                y: document.documentElement.clientHeight / 2 - 5,
                duration: 0
            })
        }

    }

    render() {
        return (
            <Stage width={document.documentElement.clientWidth} height={document.documentElement.clientHeight}>
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
                        x={document.documentElement.clientWidth / 2 - 5}
                        y={document.documentElement.clientHeight / 2 - 5}
                        radius={20}
                        fill="white"
                        onClick={() => this.moveBall(this.props.node)}
                    />
                    <Rect
                        ref={node => {
                            this.Rect = node;
                        }}
                        x={20}
                        y={document.documentElement.clientHeight / 2 - 45}
                        width={15}
                        height={90}
                        fill='black'
                    />
                </Layer>
            </Stage>
        );
    }
}

export default withRouter(PongPage)