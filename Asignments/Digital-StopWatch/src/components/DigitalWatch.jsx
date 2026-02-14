import React, { useState, useEffect, useRef } from "react";
import "../App.css";

const DigitalWatch = () => {
  const [time, setTime] = useState(0); // milliseconds
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  // Convert time
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  const format = (num, size = 2) =>
    num.toString().padStart(size, "0");

  return (
    <div className="container">
      <div className="watch">
        <h1 className="time">
          {format(hours)} :
          {format(minutes)} :
          {format(seconds)} .
          {format(milliseconds)}
        </h1>

        <div className="buttons">
          <button className="start" onClick={() => setIsActive(true)}>Start</button>
          <button className="stop" onClick={() => setIsActive(false)}>Stop</button>
          <button
            className="reset"
            onClick={() => {
              setIsActive(false);
              setTime(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalWatch;
