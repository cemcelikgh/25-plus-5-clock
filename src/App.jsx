import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';

function App() {

  const [sessionMinutesLeft, setSessionMinutesLeft] = useState(25);
  const [breakMinutesLeft, setBreakMinutesLeft] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isSession, setIsSession] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const intervalRef = useRef(null);
  const beepRef = useRef(null);


  useEffect(() => {
    if (isStart) {
      intervalRef.current = setInterval(
      () => { setSecondsLeft(sec => sec - 1) }
      , 1000)
    };
    return () => { clearInterval(intervalRef.current) };
  }, [isStart]);

  if (secondsLeft === -1) {
    if (isSession) {
      setSecondsLeft(59);
      setSessionMinutesLeft(sessionMinutesLeft - 1);
      if(sessionMinutesLeft === 0) {
        setSecondsLeft(0);
        setIsSession(false);
        setSessionMinutesLeft(sessionLength);
        beepRef.current.play();
      }
    } else {
      setSecondsLeft(59);
      setBreakMinutesLeft(breakMinutesLeft - 1);
      if(breakMinutesLeft === 0) {
        setSecondsLeft(0);
        setIsSession(true);
        setBreakMinutesLeft(breakLength);
        beepRef.current.play();
      }
    }
  };


  const convertTwoDigit = useCallback((period) => {
    if (period > 9) {return  period} else {return '0' + period};
  }, []);

  const showMinute = useCallback((isSession) => {
    if (isSession) {
      return convertTwoDigit(sessionMinutesLeft)
    } else { return convertTwoDigit(breakMinutesLeft) }
  }, [convertTwoDigit, sessionMinutesLeft, breakMinutesLeft]);

  const counter = `${showMinute(isSession)}:${convertTwoDigit(secondsLeft)}`;


  let lastOneMinute;
  if (showMinute(isSession) !== '00') {
    lastOneMinute = undefined;
  } else { lastOneMinute = 'last-one-minute' }


  const sessionDecrement = useCallback(() => {
    if (!isStart) {
      if (sessionLength > 1) {
        setSessionLength(sessionLength - 1);
        setSessionMinutesLeft(sessionLength - 1);
        setSecondsLeft(0);
      }
    }
  }, [isStart, sessionLength]);
  const sessionIncrement = useCallback(() => {
    if (!isStart) {
      if (sessionLength < 60) {
        setSessionLength(sessionLength + 1);
        setSessionMinutesLeft(sessionLength + 1);
        setSecondsLeft(0);
      }
    }
  }, [isStart, sessionLength]);
  const breakDecrement = useCallback(() => {
    if (!isStart) {
      if (breakLength > 1) {
        setBreakLength(breakLength - 1);
        setBreakMinutesLeft(breakLength - 1);
        setSecondsLeft(0);
      }
    }
  }, [isStart, breakLength]);
  const breakIncrement = useCallback(() => {
    if (!isStart) {
      if (breakLength < 60) {
        setBreakLength(breakLength + 1);
        setBreakMinutesLeft(breakLength + 1);
        setSecondsLeft(0);
      }
    }
  }, [isStart, breakLength]);

  const resetCounter = useCallback(() => {
    setIsStart(false);
    setIsSession(true);
    setSessionLength(25);
    setSessionMinutesLeft(25);
    setBreakLength(5);
    setBreakMinutesLeft(5);
    setSecondsLeft(0);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }, []);

  return (
    <>
      <section id="timer-label">
        <h2>{isSession ? 'Session' : 'Break'}</h2>
        <p id="time-left" className={lastOneMinute}>{counter}</p>
      </section>
      <section id='period-settings'>
        <div>
          <h2 id="session-label">Session Length</h2>
          <div className='period'>
            <i id="session-decrement"
              className="fa-solid fa-circle-chevron-down"
              onClick={sessionDecrement}
            ></i>
            <p id="session-length">{sessionLength}</p>
            <i id="session-increment"
              className="fa-solid fa-circle-chevron-up"
              onClick={sessionIncrement}
            ></i>
          </div>
        </div>
        <div>
          <h2 id="break-label">Break Length</h2>
          <div className='period'>
            <i id="break-decrement"
              className="fa-solid fa-circle-chevron-down"
              onClick={breakDecrement}
            ></i>
            <p id="break-length">{breakLength}</p>
            <i id="break-increment"
              className="fa-solid fa-circle-chevron-up"
              onClick={breakIncrement}
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
        ref={beepRef}
        src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'
        preload="auto"
      ></audio>
    </>
  );

};

export default App;
