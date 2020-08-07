(function() {
    window.accurateInterval = function(fn, time) {
      var cancel, nextAt, timeout, wrapper;
      nextAt = new Date().getTime() + time;
      timeout = null;
      wrapper = function() {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
      };
      cancel = function() {
        return clearTimeout(timeout);
      };
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return {
        cancel: cancel
      };
    };
  }).call(this);


class PomodoroClock extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            breakTime: 5,
            sessionTime: 25,
            timerState: "stop",
            timerType: "Session",
            timer: 1500,
            intervalID: "",
            startStopButton: <i class="far fa-play-circle" aria-hidden="true"></i>
        }
        this.incrementBreak = this.incrementBreak.bind(this);
        this.incrementSession = this.incrementSession.bind(this);
        this.decrementBreak = this.decrementBreak.bind(this);
        this.decrementSession = this.decrementSession.bind(this);
        this.startStop = this.startStop.bind(this);
        this.beginCountdown = this.beginCountdown.bind(this);
        this.update = this.update.bind(this);
        this.clock = this.clock.bind(this);
        this.reset = this.reset.bind(this);
       
    }

    incrementBreak () {
        let breakTime = this.state.breakTime;
        if (breakTime < 60) {
            this.setState({
                breakTime: breakTime +1
            })
        }
    }

    incrementSession () {
        let sessionTime = this.state.sessionTime;
        let timer = this.state.timer;
        if (sessionTime < 60){
            this.setState({
                sessionTime: sessionTime +1,
                timer: timer + 60
            })
        }
    }

    decrementBreak () {
        let breakTime = this.state.breakTime;
        if (breakTime > 1) {
            this.setState({
                breakTime: breakTime -1,
            })
        }
    }

    decrementSession () {
        let sessionTime = this.state.sessionTime;
        let timer = this.state.timer;
        if (sessionTime > 1) {
            this.setState({
                sessionTime: sessionTime -1,
                timer: timer - 60
            })
        }
    }

    startStop () {
        if (this.state.timerState == "stop") {
            this.beginCountdown();
            this.setState({
                timerState: "running", 
                startStopButton: <i class="far fa-pause-circle" aria-hidden="true"></i>
            });
        } else { 
            this.setState({
                timerState: "stop", 
                startStopButton: <i class="far fa-play-circle" aria-hidden="true"></i>
            });
            this.state.intervalID && this.state.intervalID.cancel();
        }
    }

    beginCountdown () {
        this.setState({
            intervalID: accurateInterval(() => {
                this.update(); 
               }, 1000)
        })
    }

    update(){
        let timer = this.state.timer;
        let breakTime = this.state.breakTime;
        let sessionTime = this.state.sessionTime;
        let timerType = this.state.timerType;
        switch (timerType) {
            case "Session":
                if (timer > 0) {
                    this.setState({
                        timer: timer -1
                    })
                } else if (timer == 0) {
                    this.audioBeep.play();
                    this.setState({
                        timer: breakTime * 60,
                        timerType: "Break"
                    })
                };
                break;
            case "Break":
                if (timer > 0) {
                    this.setState({
                        timer: timer -1
                    })
                } else if (timer == 0) {
                    this.audioBeep.play();
                    this.setState({
                        timer: sessionTime * 60,
                        timerType: "Session"
                    })
                }
                break;
        }
    }
    
    clock () {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ":" + seconds;
    }

    reset () {
        this.setState({
            breakTime: 5,
            sessionTime: 25,
            timerState: "stop",
            timerType: "Session",
            timer: 1500,
            intervalID: "",
            startStopButton: <i class="far fa-play-circle" aria-hidden="true"></i>
        });
        this.state.intervalID && this.state.intervalID.cancel();
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    }

    render () {
        return (
            <div id="pomodoro-clock">
                <div id="sessions">
                    <div class="time-control">
                        <h3 id="break-label">Break Length</h3>
                        <div class="controls">
                            <button id="break-decrement" aria-label="Subtract one minute to the break" onClick={this.decrementBreak}><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
                            <p id="break-length">{this.state.breakTime}</p>
                            <button id="break-increment" aria-label="Add one minute to the break" onClick={this.incrementBreak}><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    <div class="time-control">
                        <h3 id="session-label">Session Length</h3>
                        <div class="controls">
                            <button id="session-decrement" aria-label="Subtract one minute to the session" onClick={this.decrementSession}><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
                            <p id="session-length">{this.state.sessionTime}</p>
                            <button id="session-increment" aria-label="Add one minute to the session" onClick={this.incrementSession}><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div id="clock">
                    <h2 id="timer-label">{this.state.timerType}</h2>
                    <p id="time-left">{this.clock()}</p>
                </div>
                <div class="main-buttons">
                    <button id="start_stop" onClick={this.startStop}>{this.state.startStopButton}</button>
                    <button id="reset" aria-label="Reset session" onClick={this.reset}><i class="fas fa-sync-alt" aria-hidden="true"></i></button>
                </div>
                <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" ref={(audio) => {this.audioBeep = audio;}}/>
            </div>
        )
    }
}

ReactDOM.render(<PomodoroClock/>, document.getElementById("root"));
