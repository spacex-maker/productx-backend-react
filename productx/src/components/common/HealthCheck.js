import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Tooltip } from 'antd';
import { healthCheckService } from 'src/service/login.service';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  },
  50% {
    transform: scale(1.1);
    opacity: 1;
  },
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 4px;
  background-color: ${(props) => {
    switch (props.status) {
      case 'online':
        return '#52c41a';
      case 'offline':
        return '#ff4d4f';
      case 'checking':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  }};
  ${(props) =>
    props.status === 'online' &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
      box-shadow: 0 0 4px ${(props) => (props.status === 'online' ? '#52c41a' : 'transparent')};
    `}
`;

const HealthCheck = ({ url }) => {
  const [status, setStatus] = useState('checking');
  const [latency, setLatency] = useState(null);
  const timerRef = useRef(null);

  const checkHealth = async () => {
    setStatus('checking');
    const startTime = Date.now();
    const [error, response] = await healthCheckService(url);
    if (error) {
      setStatus('offline');
      setLatency(null);
    } else {
      setLatency(Date.now() - startTime);
      if (response.data.data === true) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    }
    timerRef.current = setTimeout(() => {
      checkHealth();
    }, 1e4);
  };

  useEffect(() => {
    checkHealth();
    return () => {
      if (timerRef.current) {
        console.log('clearTimeout');
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getTooltipTitle = () => {
    switch (status) {
      case 'online':
        return `可用 (延迟: ${latency}ms)`;
      case 'offline':
        return '不可用';
      case 'checking':
        return '检查中...';
      default:
        return '未知状态';
    }
  };

  return (
    <Tooltip title={getTooltipTitle()} placement="right">
      <StatusDot status={status} />
    </Tooltip>
  );
};

export default HealthCheck;
