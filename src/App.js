import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [sessionMinutesLeft, setSessionMinutesLeft] = useState(25);
  const [breakMinutesLeft, setBreakMinutesLeft] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isSession, setIsSession] = useState(true);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    let intervalID;
    if (isStart) {intervalID = setInterval(
      () => {setSecondsLeft(sec => sec - 1)}
    , 1000)};
    return () => clearInterval(intervalID);
  }, [isStart]);

  function convertTwoDigit(period) {
    return period > 9 ? period : '0' + period;
  };

  function showMinute(isSession) {
    return isSession
      ? convertTwoDigit(sessionMinutesLeft)
      : convertTwoDigit(breakMinutesLeft);
  };

  function counter() {

    if (secondsLeft === -1) {
      if (isSession) {
        setSecondsLeft(59);
        setSessionMinutesLeft(sessionMinutesLeft - 1);
        if(sessionMinutesLeft === 0) {
          setSecondsLeft(0);
          setIsSession(false);
          setSessionMinutesLeft(sessionLength);
          document.getElementById('beep').play();
        }
      } else {
        setSecondsLeft(59);
        setBreakMinutesLeft(breakMinutesLeft - 1);
        if(breakMinutesLeft === 0) {
          setSecondsLeft(0);
          setIsSession(true);
          setBreakMinutesLeft(breakLength);
          document.getElementById('beep').play();
        }
      }
    };

    // const timeLeft = document.getElementById('time-left');
    // if (timeLeft) {
    //   showMinute(isSession) !== '00'
    //     ? timeLeft.style.color = '#FFFFFF'
    //     : timeLeft.style.color = '#FF0000';
    // }

    return `${showMinute(isSession)}:${convertTwoDigit(secondsLeft)}`;

  };

  function sessionDecrement() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setSessionMinutesLeft(sessionLength - 1);
      setSecondsLeft(0);
    }
  };
  function sessionIncrement() {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setSessionMinutesLeft(sessionLength + 1);
      setSecondsLeft(0);
    }
  };
  function breakDecrement() {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      setBreakMinutesLeft(sessionLength - 1);
      setSecondsLeft(0);
    }
  };
  function breakIncrement() {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      setBreakMinutesLeft(sessionLength + 1);
      setSecondsLeft(0);
    }
  };

  function resetCounter() {
    setIsStart(false);
    setIsSession(true);
    setSessionLength(25);
    setSessionMinutesLeft(25);
    setBreakLength(5);
    setBreakMinutesLeft(5);
    setSecondsLeft(0);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <>
      <section id="timer-label">
        <h2>{isSession ? 'Session' : 'Break'}</h2>
        <p id="time-left">{counter()}</p>
      </section>
      <section id='period-settings'>
        <div>
          <h2 id="session-label">Session Lenght</h2>
          <div className='period'>
            <i id="session-decrement"
              className="fa-solid fa-circle-chevron-down"
              onClick={!isStart ? sessionDecrement : null}
            ></i>
            <p id="session-length">{sessionLength}</p>
            <i id="session-increment"
              className="fa-solid fa-circle-chevron-up"
              onClick={!isStart ? sessionIncrement : null}
            ></i>
          </div>
        </div>
        <div>
          <h2 id="break-label">Break Lenght</h2>
          <div className='period'>
            <i id="break-decrement"
              className="fa-solid fa-circle-chevron-down"
              onClick={!isStart ? breakDecrement : null}
            ></i>
            <p id="break-length">{breakLength}</p>
            <i id="break-increment"
              className="fa-solid fa-circle-chevron-up"
              onClick={!isStart ? breakIncrement : null}
            ></i>
          </div>
        </div>
      </section>
      <section id='start-stop'>
        <i id="start_stop"
          className={'fa-solid ' + (isStart ? 'fa-stop' : 'fa-play')}
          onClick={() => {setIsStart(!isStart)}}
        ></i>
        <i id="reset"
          className="fa-solid fa-rotate"
          onClick={resetCounter}
        ></i>
      </section>
      <audio id='beep'
        src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'
        preload="auto"
      ></audio>
    </>
  );

};

export default App;
