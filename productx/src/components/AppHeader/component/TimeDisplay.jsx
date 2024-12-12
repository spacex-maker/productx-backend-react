import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CIcon from '@coreui/icons-react';
import { cilSun } from '@coreui/icons';

const glow = keyframes`
  0% {
    text-shadow: none;
    color: #666;
  }
  20% {
    text-shadow: 0 0 8px #0088ff, 0 0 12px #0088ff;
    color: #fff;
  }
  100% {
    text-shadow: none;
    color: #666;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Courier New', monospace;
  font-size: 14px !important;
  padding: 4px 8px;

  .time-digit {
    display: inline-block;
    width: 0.7em;
    text-align: center;
    transition: all 0.3s ease;
  }

  .time-separator {
    opacity: 0.5;
    margin: 0 1px;
  }

  .changed {
    animation: ${glow} 0.5s ease-out;
  }
`;

export const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [changedDigits, setChangedDigits] = useState(new Set());
  const [prevTimeStr, setPrevTimeStr] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      const newTimeStr = newTime.toLocaleTimeString();
      const changed = new Set();

      // 比较每一位数字，找出变化的位置
      for (let i = 0; i < newTimeStr.length; i++) {
        if (newTimeStr[i] !== prevTimeStr[i]) {
          changed.add(i);
        }
      }

      setTime(newTime);
      setChangedDigits(changed);
      setPrevTimeStr(newTimeStr);

      // 500ms 后清除动画状态
      setTimeout(() => {
        setChangedDigits(new Set());
      }, 500);
    }, 1000);

    return () => clearInterval(interval);
  }, [prevTimeStr]);

  const renderTimeDigit = (digit, index) => {
    return (
      <span key={index} className={`time-digit ${changedDigits.has(index) ? 'changed' : ''}`}>
        {digit}
      </span>
    );
  };

  const timeString = time.toLocaleTimeString();

  return (
    <TimeWrapper className="nav-link">
      <CIcon icon={cilSun} size="sm" className="me-2" />
      {timeString.split('').map((digit, index) => {
        if (digit === ':') {
          return (
            <span key={index} className="time-separator">
              :
            </span>
          );
        }
        return renderTimeDigit(digit, index);
      })}
    </TimeWrapper>
  );
};
