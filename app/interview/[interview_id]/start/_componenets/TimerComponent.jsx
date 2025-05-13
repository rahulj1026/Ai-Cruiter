"use client";
import React, { useEffect, useState } from "react";

const TimerComponent = ({ start }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (start) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [start]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return <span>{formatTime(time)}</span>;
};

export default TimerComponent;
