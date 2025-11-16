import React, { useEffect, useRef, useState } from "react";
import countdown from "../assets/countdownw.mp3";
import kaboom from "../assets/Kaboom.mp3";
import ding from "../assets/ding.mp3";

const COUNTDOWN_SECONDS = 10;

const DramaticCountdownButton: React.FC = () => {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [holyimlazy, setholyimlazy] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const countdownRef = useRef<HTMLAudioElement | null>(null);
  const kaboomRef = useRef<HTMLAudioElement | null>(null);
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    countdownRef.current = new Audio(countdown);
    countdownRef.current.currentTime = 0;
    kaboomRef.current = new Audio(kaboom);
    dingRef.current = new Audio(ding);
  }, []);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playDramaticSound = async () => {
    if (kaboomRef.current) {
      kaboomRef.current.currentTime = 0.5;
      kaboomRef.current.play();
    }
  };

  // Start / restart countdown
  const handleClick = () => {
    setRemaining(COUNTDOWN_SECONDS);
    // Reset & restart audio
    if (isRunning && dingRef.current) {
      clearInterval(fadeRef.current!);
      dingRef.current.currentTime = 0;
      dingRef.current.play();
    }
    if (countdownRef.current) {
      countdownRef.current.currentTime = 30;
      countdownRef.current.play();
      setholyimlazy(holyimlazy + 1);
    }
    let currentVolume = 0;
    const fadeInStep = 1 / (1500 / 100); // Calculate step for each 100ms

    fadeRef.current = setInterval(() => {
      currentVolume += fadeInStep;
      if (currentVolume >= 1) {
        currentVolume = 1; // Cap at max volume
        clearInterval(fadeRef.current!);
      }
      countdownRef.current!.volume = currentVolume;
    }, 100); // Adjust interval for smoothness
    setIsRunning(true);
  };

  // Countdown effect
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      if (countdownRef.current) {
        countdownRef.current.pause();
      }
      return;
    }

    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, holyimlazy]);

  // When countdown hits 0, play sound
  useEffect(() => {
    if (!isRunning && remaining === 0) {
      void playDramaticSound();
    }
  }, [remaining, isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const label =
    !isRunning && remaining === COUNTDOWN_SECONDS
      ? `Start ${COUNTDOWN_SECONDS}s countdown`
      : !isRunning && remaining === 0
      ? "Boom! Restart countdown"
      : `Reset (${remaining}s)`;

  return (
    <button
      onClick={handleClick}
      style={{
        width: "180px",
        height: "180px",
        borderRadius: "9999px", // fully round
        border: "none",
        cursor: "pointer",
        fontSize: "1.5rem",
        fontWeight: 700,
        background:
          remaining === 0
            ? "linear-gradient(135deg, #ff2d2d, #ff6b6b)" // brighter when done
            : "linear-gradient(135deg, #b30000, #ff0000)", // deep red
        color: "#fff",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.45)",
        transform: remaining === 0 ? "scale(1.10)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
};

export default DramaticCountdownButton;
