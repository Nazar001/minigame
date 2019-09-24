import React, { Component } from 'react';
import { withRouter } from "react-router";
import './PongPage.scss';
import { Stage, Layer, Rect, Circle, Text, Label } from 'react-konva';
import { message } from 'antd';
import MIDISounds from 'midi-sounds-react';

let address = document.URL;
address = address.replace("http", "ws");
address = address.replace(":3000/", ":3030");
const URL = address;

let leftData = {
    leftY: 720 / 2 - 45,
};

let rightData = {
    rightY: 720 / 2 - 45,
};

class PongPage extends Component {
    state = {
        player: -1,
        leftScore: 0,
        rightScore: 0,
        isPlaying: false,
        botActive: false,
        leftY: leftData.leftY,
        rightY: rightData.rightY,
        ballX: 1280 / 2 - 5,
        ballY: 720 / 2 - 5,
    }

    ws = new WebSocket(URL)

    componentDidMount() {
        document.title = "PingPong";
        this.ws.onopen = () => {
            console.log('connected')
        };
        this.ws.onmessage = evt => {
            const message1 = JSON.parse(evt.data)
            if (message1 === 1) {
                if (this.state.player === 2) {
                    this.setState({
                        player: 1
                    })
                    message.info("Press space to start the game!");
                    this.ws.send(JSON.stringify(604));
                };
            } else if (message1 === 404 && (this.state.player === 1 || this.state.player === 2)) {
                this.ws.send(JSON.stringify(504));
                message.success("You WIN!!!");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else if (message1 === 504) {
                alert("You lose!!!");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else if (message1 === 604) {
                message.info("The game may be started by first player");
            } else {
                if (this.state.player === 1 || this.state.player === 2) {
                    this.up(message1);
                };
            }
        };
        if ((this.state.player === 1 || this.restart.player === 2) && (this.state.leftScore === 0 && this.state.leftScore === 0 && this.state.isPlaying === false)) {
            if (this.state.player === 1) {
                message.info("Вы играете за игрока слева");
            } else {
                message.info("Вы играете за игрока справа");
            }
        };

        this.ws.onclose = () => {
            console.log('disconnected')
            this.setState({
                ws: new WebSocket(URL),
            })
        }
    };



    updateRight = (message) => {
        if (this.state.player === 1 || this.state.player === 2) {
            let obj = {
                leftScore: this.state.leftScore,
                rightScore: this.state.rightScore,
                rightY: message,
                isPlaying: this.state.isPlaying,
                leftY: this.state.leftY,
                ballX: this.state.ballX,
                ballY: this.state.ballY,
            };

            if (!this.ws.readyState) {
                setTimeout(function () {
                    this.ws.send(JSON.stringify(obj));
                }, 100);
            } else {
                this.ws.send(JSON.stringify(obj));
            }
        };

        this.setState({
            rightY: message,
        });
    };

    updateLeft = (message) => {
        if (this.state.player === 1 || this.state.player === 2) {
            let obj = {
                leftY: message,
                leftScore: this.state.leftScore,
                rightScore: this.state.rightScore,
                isPlaying: this.state.isPlaying,
                rightY: this.state.rightY,
                ballX: this.state.ballX,
                ballY: this.state.ballY
            };

            if (!this.ws.readyState) {
                setTimeout(function () {
                    this.ws.send(JSON.stringify(obj));
                }, 100);
            } else {
                this.ws.send(JSON.stringify(obj));
            }
        };

        this.setState({
            leftY: message,
        });
    }

    up = (message) => {
        this.setState({
            leftScore: message.leftScore,
            rightScore: message.rightScore,
            leftY: message.leftY,
            rightY: message.rightY,
            isPlaying: message.isPlaying,
            ballX: message.ballX,
            ballY: message.ballY
        })
    };

    ball = (message) => {
        let obj = {
            leftY: this.state.leftY,
            leftScore: this.state.leftScore,
            rightScore: this.state.rightScore,
            isPlaying: this.state.isPlaying,
            rightY: this.state.rightY,
            ballX: message.ballX,
            ballY: message.ballY
        };

        if (!this.ws.readyState) {
            setTimeout(function () {
                this.ws.send(JSON.stringify(obj));
            }, 100);
        } else {
            this.ws.send(JSON.stringify(obj));
        }
    };

    moveBall = () => {
        this.setState({
            isPlaying: true
        })

        let fieldH = 720;
        let scaleX = Math.random() * 2.5;
        let scaleY = Math.random() * 2.5;
        let temp = setInterval(() => {
            if (this.state.isPlaying === false) clearInterval(temp);
            if (this.state.player === 3) this.setState({ botActive: true })
            if (this.state.botActive) this.ai();
            this.setState({
                ballX: this.state.ballX += scaleX,
                ballY: this.state.ballY += scaleY
            })
            // Мячик по-вертикали
            if (this.state.ballY < 0 || this.state.ballY + 10 > fieldH) {
                scaleY = -scaleY;
            }
            // Мячик направо
            if (this.state.ballX > 1280 - 20) {
                scaleX = Math.random() * -2.5;
                scaleY = Math.random() * 2.5;
                let temp = this.state.leftScore + 1;
                this.setState({
                    ballX: 1280 / 2 - 5,
                    ballY: 720 / 2 - 5,
                    leftScore: temp
                })
            }

            // Мячик налево
            if (this.state.ballX < 20) {
                scaleX = Math.random() * 2.5;
                scaleY = Math.random() * 2.5;
                let temp = this.state.rightScore + 1;
                this.setState({
                    ballX: 1280 / 2 - 5,
                    ballY: 720 / 2 - 5,
                    rightScore: temp
                })
            };

            if (this.touch(this.Circle, this.Rect) === true || this.touch(this.Circle, this.Rectangle) === true) {
                scaleX = -scaleX;
            };

            if (this.state.leftScore === 21) {
                alert(this.state.leftName + ' wins')
                clearInterval(temp);
            }
            else if (this.state.rightScore === 21) {
                alert(this.state.rightName + ' wins')
                clearInterval(temp);
            };

            if (this.state.player === 1 || this.state.player === 2) {
                let ob = {
                    ballX: this.state.ballX += scaleX,
                    ballY: this.state.ballY += scaleY
                };
                this.ball(ob);
            };
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
            if (this.Rectangle.attrs.y < 720 - this.Rectangle.attrs.height)
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
            a.attrs.y < b.attrs.y + b.attrs.height) {
            this.midiSounds.playChordNow(3, [60], 2.5);

            return true;
        }
        else
            return false;
    }

    handleKeyDown = e => {

        if (e.keyCode === 32) {
            if (this.state.isPlaying === false && (this.state.player === 1 || this.state.player === 3 || this.state.player === 0)) {
                this.moveBall();
            }
        }
        //Левый
        if (this.state.player === 0 || this.state.player === 1 || this.state.player === 3) {
            // ВНИЗ!
            if (e.keyCode === 83) {
                if (this.Rect.attrs.y < 720 - this.Rect.attrs.height) {
                    this.Rect.to({
                        y: this.Rect.attrs.y + this.Rect.attrs.height / 3,
                        duration: 0.06
                    })
                    this.setState({
                        leftY: this.Rect.attrs.y + this.Rect.attrs.height / 3
                    })
                    this.updateLeft(this.Rect.attrs.y + this.Rect.attrs.height / 3)
                };
            };
            // ВВЕРХ!
            if (e.keyCode === 87) {
                if (this.Rect.attrs.y > 0) {
                    this.Rect.to({
                        y: this.Rect.attrs.y - this.Rect.attrs.height / 3,
                        duration: 0.06
                    })
                    this.setState({
                        leftY: this.Rect.attrs.y - this.Rect.attrs.height / 3
                    });
                    this.updateLeft(this.Rect.attrs.y - this.Rect.attrs.height / 3)
                }
            }
        }
        // Правый
        if (this.state.player === 0 || this.state.player === 2) {
            // ВНИЗ!
            if (e.keyCode === 40)
                if (this.Rectangle.attrs.y < 720 - this.Rectangle.attrs.height) {
                    this.Rectangle.to({
                        y: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3,
                        duration: 0.06
                    })
                    this.setState({
                        rightY: this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3
                    })
                    this.updateRight(this.Rectangle.attrs.y + this.Rectangle.attrs.height / 3)
                };
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
                    this.updateRight(this.Rectangle.attrs.y - this.Rectangle.attrs.height / 3)
                };
        };
    }

    handlePlayVsAi = (e) => {
        e.preventDefault();
        document.getElementById("gameField").focus();
        this.setState({
            botActive: !this.state.botActive,
            player: 3
        })
        let tmp = document.getElementById('alpha');
        tmp.remove();
    };

    handleHotseat = (e) => {
        e.preventDefault();
        document.getElementById("gameField").focus();
        this.setState({
            player: 0
        })
        let tmp = document.getElementById('alpha');
        tmp.remove();
    };

    handleOnline = (e) => {
        e.preventDefault();
        document.getElementById("gameField").focus();
        this.ws.send(JSON.stringify(1));
        this.setState({
            player: 2
        })
        let tmp = document.getElementById('alpha');
        tmp.remove();
    };
    restart = () => {
        if (this.state.isPlaying && (this.state.player === 1 || this.state.player === 2)) {
            this.ws.send(JSON.stringify(404));
        }
        this.setState({
            leftScore: 0,
            rightScore: 0,
            isPlaying: false,
            botActive: false,
            leftY: leftData.leftY,
            rightY: rightData.rightY,
            ballX: 1280 / 2 - 5,
            ballY: 720 / 2 - 5,
        })
        let obj = {
            leftScore: 0,
            rightScore: 0,
            isPlaying: false,
            botActive: false,
            leftY: 720 / 2 - 45,
            rightY: 720 / 2 - 45,
            ballX: 1280 / 2 - 5,
            ballY: 720 / 2 - 5,
        }
        if (!this.ws.readyState) {
            setTimeout(function () {
                this.ws.send(JSON.stringify(obj));
            }, 100);
        } else {
            this.ws.send(JSON.stringify(obj));
        }
    };

    back = () => {
        if (this.state.isPlaying && (this.state.player === 1 || this.state.player === 2)) {
            this.ws.send(JSON.stringify(404));
        }
        window.location.reload();
    }


    render() {
        window.onbeforeunload = () => {
            if (this.state.isPlaying && (this.state.player === 1 || this.state.player === 2)) {
                this.ws.send(JSON.stringify(404));
            };
        };
        return (
            <div>
                <form id='alpha' className='settings'>
                    <button onClick={this.handlePlayVsAi}
                        className='UI'> Player vs AI</button>
                    <button onClick={this.handleHotseat}
                        className='UI'> Hotseat</button>
                    <button onClick={this.handleOnline}
                        className='UI'> Online</button>
                </form>
                < div className='gameField' id="gameField" tabIndex='1' onKeyDown={this.handleKeyDown}>
                    <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
                    <Stage width={1280} height={720} >
                        <Layer>
                            <Rect
                                x={0}
                                y={0}
                                width={1280}
                                height={720}
                                fill='green'
                            />
                            <Rect
                                x={1280 / 2 - 10}
                                y={0}
                                width={10}
                                height={720}
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
                                radius={10}
                                fill="white"
                            />
                            <Rect
                                id='leftPlayer'
                                ref={node => {
                                    this.Rect = node;
                                }}
                                x={31}
                                y={this.state.leftY}
                                width={15}
                                height={90}
                                fill={(this.state.player === 1) ? 'blue' : 'black'}
                                onKeyDown={this.handleKeyDown}
                            />
                            <Rect
                                id='rightPlayer'
                                ref={node => {
                                    this.Rectangle = node;
                                }}
                                x={1280 - 46}
                                y={this.state.rightY}
                                width={15}
                                height={90}
                                fill={(this.state.player === 2) ? 'blue' : 'black'}
                            />
                        </Layer>
                        <Layer>
                            <Label>
                                <Text
                                    x={1280 / 2 - 120}
                                    fontSize={90}
                                    text={`${this.state.leftScore}`}
                                    wrap="char"
                                    align="center"
                                />
                                <Text
                                    x={1280 / 2 - 43}
                                    fontSize={90}
                                    text=' : '
                                    wrap="char"
                                    align="center"
                                />
                                <Text
                                    x={1280 / 2 + 30}
                                    fontSize={90}
                                    text={`${this.state.rightScore}`}
                                    wrap="char"
                                    align="center"
                                />
                            </Label>
                        </Layer>
                    </Stage >

                </div >
                <div className="div-btn">
                    <button className='restart btn' onClick={this.restart}>Restart</button>
                    <button className='back btn' onClick={this.back}>Back to menu</button>
                </div>
            </div >
        );
    }
}

export default withRouter(PongPage)